# Restaurant RAG API Service

A FastAPI-powered microservice that provides RAG (Retrieval-Augmented Generation) chatbot functionality for individual restaurants. Each restaurant gets its own API key and has responses generated solely from their provided menu and context.

## Features

- 🔑 **API Key Authentication** - Each restaurant gets a unique API key
- 🤖 **RAG Pipeline** - Uses OpenAI embeddings and ChatGPT for contextual responses
- 📝 **Menu-Based Responses** - Only answers based on restaurant's specific menu and info
- 🚀 **FastAPI Framework** - High-performance async API
- 🔍 **Vector Search** - ChromaDB for semantic similarity search
- 📊 **Restaurant Management** - CRUD operations for restaurants

## Setup

### 1. Environment Setup

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\\Scripts\\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Environment Variables

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
SERVICE_PORT=8000
LOG_LEVEL=info
```

### 3. Initialize Data Directories

The service will automatically create necessary directories, but you can pre-create them:

```bash
mkdir -p data/chroma_db
```

## Running the Service

### Start the API Server

```bash
# From the restaurant_rag_api directory
cd app
python main.py

# Or using uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

### API Documentation

Once running, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Restaurant Management

### Register a New Restaurant

#### Option 1: Using the Build Script (Recommended)

Create a sample restaurant:
```bash
cd scripts
python build_index.py --sample
```

Register from a JSON file:
```bash
python build_index.py --file restaurant_data.json
```

#### Option 2: Using the API Directly

```bash
curl -X POST \"http://localhost:8000/restaurants\" \\
  -H \"Content-Type: application/json\" \\
  -d '{
    \"name\": \"Mario'\''s Pizza\",
    \"location\": \"123 Main St, NY\",
    \"delivery_area\": \"Manhattan\",
    \"delivery_fee\": 3.99,
    \"phone\": \"+1-555-123-4567\",
    \"hours\": {
      \"monday\": \"11:00 AM - 10:00 PM\",
      \"tuesday\": \"11:00 AM - 10:00 PM\"
    },
    \"menu_items\": [
      {
        \"name\": \"Margherita Pizza\",
        \"description\": \"Classic pizza with mozzarella and basil\",
        \"price\": 14.99,
        \"category\": \"Pizza\",
        \"availability\": true,
        \"ingredients\": [\"mozzarella\", \"basil\", \"tomatoes\"],
        \"allergens\": [\"gluten\", \"dairy\"]
      }
    ]
  }'
```

### List Restaurants

```bash
# Using the script
python scripts/build_index.py --list

# Using the API
curl \"http://localhost:8000/restaurants\"
```

### Delete a Restaurant

```bash
# Using the script
python scripts/build_index.py --delete RESTAURANT_ID

# Using the API
curl -X DELETE \"http://localhost:8000/restaurants/RESTAURANT_ID\"
```

## Chat API Usage

Once you have a restaurant registered and its API key, you can send chat messages:

```bash
curl -X POST \"http://localhost:8000/chat\" \\
  -H \"Content-Type: application/json\" \\
  -H \"X-API-Key: YOUR_RESTAURANT_API_KEY\" \\
  -d '{
    \"message\": \"What pizzas do you have?\",
    \"user_id\": \"user123\",
    \"session_id\": \"session456\"
  }'
```

### Response Format

```json
{
  \"response\": \"We have several delicious pizzas! Here are our options: Margherita Pizza ($14.99) - Classic pizza with fresh mozzarella, tomatoes, and basil...\",
  \"restaurant_id\": \"restaurant-uuid\",
  \"timestamp\": \"2025-09-24T19:04:12.123456\",
  \"session_id\": \"session456\"
}
```

## API Endpoints

### Public Endpoints
- `GET /` - Health check
- `GET /health` - Detailed health check
- `POST /restaurants` - Register a new restaurant
- `GET /restaurants` - List all restaurants
- `GET /restaurants/{id}` - Get restaurant details
- `DELETE /restaurants/{id}` - Delete a restaurant

### Authenticated Endpoints (Require X-API-Key header)
- `POST /chat` - Send a chat message

## Data Storage

The service uses JSON files for data storage (suitable for development/small scale):

- `data/restaurants.json` - Restaurant information and menus
- `data/api_keys.json` - API key mappings
- `data/chroma_db/` - Vector database storage

For production, consider migrating to PostgreSQL or similar database.

## Error Handling

The API returns standard HTTP status codes:

- `200` - Success
- `400` - Bad Request (invalid data)
- `401` - Unauthorized (invalid API key)
- `404` - Not Found (restaurant not found)
- `500` - Internal Server Error

## Example Restaurant JSON

```json
{
  \"name\": \"Mario's Pizza Palace\",
  \"location\": \"123 Main St, New York, NY 10001\",
  \"delivery_area\": \"Manhattan, Brooklyn Heights\",
  \"delivery_fee\": 3.99,
  \"phone\": \"+1-555-123-4567\",
  \"hours\": {
    \"monday\": \"11:00 AM - 10:00 PM\",
    \"tuesday\": \"11:00 AM - 10:00 PM\",
    \"wednesday\": \"11:00 AM - 10:00 PM\",
    \"thursday\": \"11:00 AM - 10:00 PM\",
    \"friday\": \"11:00 AM - 11:00 PM\",
    \"saturday\": \"12:00 PM - 11:00 PM\",
    \"sunday\": \"12:00 PM - 9:00 PM\"
  },
  \"menu_items\": [
    {
      \"name\": \"Margherita Pizza\",
      \"description\": \"Classic pizza with fresh mozzarella, tomatoes, and basil\",
      \"price\": 14.99,
      \"category\": \"Pizza\",
      \"availability\": true,
      \"ingredients\": [\"mozzarella\", \"tomatoes\", \"basil\", \"pizza dough\"],
      \"allergens\": [\"gluten\", \"dairy\"]
    }
  ]
}
```

## Development

### Project Structure

```
restaurant_rag_api/
├── app/
│   ├── main.py          # FastAPI application
│   ├── models.py        # Pydantic models
│   ├── config.py        # Configuration management
│   ├── auth.py          # API key authentication
│   ├── store.py         # Data storage management
│   └── rag.py           # RAG pipeline implementation
├── scripts/
│   └── build_index.py   # Restaurant registration script
├── data/                # Data storage directory
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

### Adding New Features

1. **New API endpoints**: Add them to `app/main.py`
2. **Data models**: Update `app/models.py`
3. **Configuration**: Modify `app/config.py`
4. **RAG improvements**: Edit `app/rag.py`

## Troubleshooting

### Common Issues

1. **OpenAI API Key Error**: Ensure your API key is set correctly in `.env`
2. **Port Already in Use**: Change `SERVICE_PORT` in `.env` or stop the conflicting service
3. **Module Import Errors**: Ensure you're running from the correct directory and virtual environment is activated
4. **Vector Database Issues**: Delete `data/chroma_db/` directory and re-register restaurants

### Debug Mode

Run with debug logging:
```bash
LOG_LEVEL=debug python app/main.py
```

## License

This project is part of the mafal-ia chatbot platform.
