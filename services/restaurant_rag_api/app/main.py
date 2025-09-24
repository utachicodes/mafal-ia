from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List
from .models import ChatMessage, ChatResponse, RestaurantCreate, RestaurantInfo, APIKeyResponse
from .auth import auth
from .rag import rag
from .store import DataStore
from .config import Config

app = FastAPI(
    title=\"Restaurant RAG API\",
    description=\"RAG-powered chatbot API for individual restaurants\",
    version=\"1.0.0\"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[\"*\"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=[\"*\"],
    allow_headers=[\"*\"],
)

# Initialize data store
data_store = DataStore()


@app.get(\"/\")
async def root():
    \"\"\"Health check endpoint\"\"\"
    return {
        \"message\": \"Restaurant RAG API is running\",
        \"version\": \"1.0.0\",
        \"status\": \"healthy\"
    }


@app.post(\"/chat\", response_model=ChatResponse)
async def chat(
    message: ChatMessage,
    restaurant_id: str = Depends(auth.get_restaurant_from_api_key)
):
    \"\"\"
    Main chat endpoint - accepts POST requests from webhooks
    Requires X-API-Key header for authentication
    \"\"\"
    try:
        # Generate response using RAG pipeline
        response_text = rag.generate_response(
            restaurant_id=restaurant_id,
            user_message=message.message,
            session_id=message.session_id
        )
        
        return ChatResponse(
            response=response_text,
            restaurant_id=restaurant_id,
            timestamp=datetime.utcnow(),
            session_id=message.session_id
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f\"Error generating response: {str(e)}\"
        )


@app.post(\"/restaurants\", response_model=APIKeyResponse)
async def create_restaurant(restaurant_data: RestaurantCreate):
    \"\"\"Create a new restaurant and generate its API key\"\"\"
    try:
        # Save restaurant data
        restaurant_dict = restaurant_data.dict()
        restaurant_id = data_store.save_restaurant(restaurant_dict)
        
        # Generate API key
        api_key = auth.create_api_key(restaurant_id)
        
        # Index restaurant data in RAG system
        rag.index_restaurant(restaurant_id, restaurant_dict)
        
        return APIKeyResponse(
            api_key=api_key,
            restaurant_id=restaurant_id,
            message=f\"Restaurant '{restaurant_data.name}' created successfully\"
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f\"Error creating restaurant: {str(e)}\"
        )


@app.get(\"/restaurants/{restaurant_id}\", response_model=RestaurantInfo)
async def get_restaurant(restaurant_id: str):
    \"\"\"Get restaurant information\"\"\"
    restaurant = data_store.get_restaurant(restaurant_id)
    
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail=\"Restaurant not found\"
        )
    
    # Get API key for this restaurant
    api_keys = data_store.load_api_keys()
    restaurant_api_key = None
    
    for api_key, key_data in api_keys.items():
        if key_data[\"restaurant_id\"] == restaurant_id:
            restaurant_api_key = api_key
            break
    
    restaurant_info = RestaurantInfo(
        id=restaurant[\"id\"],
        name=restaurant[\"name\"],
        location=restaurant[\"location\"],
        delivery_area=restaurant[\"delivery_area\"],
        delivery_fee=restaurant[\"delivery_fee\"],
        phone=restaurant.get(\"phone\"),
        hours=restaurant.get(\"hours\", {}),
        api_key=restaurant_api_key or \"API key not found\",
        created_at=datetime.fromisoformat(restaurant[\"created_at\"])
    )
    
    return restaurant_info


@app.get(\"/restaurants\", response_model=List[RestaurantInfo])
async def list_restaurants():
    \"\"\"List all restaurants\"\"\"
    restaurants = data_store.list_restaurants()
    api_keys = data_store.load_api_keys()
    
    # Create a mapping of restaurant_id to api_key
    restaurant_api_keys = {}
    for api_key, key_data in api_keys.items():
        restaurant_api_keys[key_data[\"restaurant_id\"]] = api_key
    
    restaurant_infos = []
    for restaurant in restaurants:
        restaurant_info = RestaurantInfo(
            id=restaurant[\"id\"],
            name=restaurant[\"name\"],
            location=restaurant[\"location\"],
            delivery_area=restaurant[\"delivery_area\"],
            delivery_fee=restaurant[\"delivery_fee\"],
            phone=restaurant.get(\"phone\"),
            hours=restaurant.get(\"hours\", {}),
            api_key=restaurant_api_keys.get(restaurant[\"id\"], \"API key not found\"),
            created_at=datetime.fromisoformat(restaurant[\"created_at\"])
        )
        restaurant_infos.append(restaurant_info)
    
    return restaurant_infos


@app.delete(\"/restaurants/{restaurant_id}\")
async def delete_restaurant(restaurant_id: str):
    \"\"\"Delete a restaurant and its data\"\"\"
    # Check if restaurant exists
    restaurant = data_store.get_restaurant(restaurant_id)
    if not restaurant:
        raise HTTPException(
            status_code=404,
            detail=\"Restaurant not found\"
        )
    
    try:
        # Delete from vector store
        rag.delete_restaurant_data(restaurant_id)
        
        # Delete restaurant data
        data_store.delete_restaurant(restaurant_id)
        
        # Revoke API key
        api_keys = data_store.load_api_keys()
        for api_key, key_data in api_keys.items():
            if key_data[\"restaurant_id\"] == restaurant_id:
                auth.revoke_api_key(api_key)
                break
        
        return {
            \"message\": f\"Restaurant '{restaurant['name']}' deleted successfully\"
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f\"Error deleting restaurant: {str(e)}\"
        )


@app.get(\"/health\")
async def health_check():
    \"\"\"Detailed health check\"\"\"
    try:
        # Check if we can access the data store
        restaurants_count = len(data_store.list_restaurants())
        api_keys_count = len(data_store.load_api_keys())
        
        return {
            \"status\": \"healthy\",
            \"restaurants_count\": restaurants_count,
            \"api_keys_count\": api_keys_count,
            \"timestamp\": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f\"Health check failed: {str(e)}\"
        )


if __name__ == \"__main__\":
    import uvicorn
    uvicorn.run(
        \"main:app\",
        host=\"0.0.0.0\",
        port=Config.SERVICE_PORT,
        log_level=Config.LOG_LEVEL,
        reload=True
    )
