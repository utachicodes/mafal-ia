#!/usr/bin/env python3
\"\"\"
Restaurant Index Builder Script

This script allows you to register restaurants, build their vector indices,
and provision API keys for the RAG chatbot system.
\"\"\"

import sys
import os
import json
import argparse
from typing import Dict, Any, List

# Add the app directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'app'))

from models import RestaurantCreate, MenuItemCreate
from auth import auth
from rag import rag
from store import DataStore


def load_restaurant_from_file(file_path: str) -> Dict[str, Any]:
    \"\"\"Load restaurant data from JSON file\"\"\"
    with open(file_path, 'r', encoding='utf-8') as f:
        return json.load(f)


def create_sample_restaurant() -> Dict[str, Any]:
    \"\"\"Create sample restaurant data for testing\"\"\"
    return {
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
                \"availability\": True,
                \"ingredients\": [\"mozzarella\", \"tomatoes\", \"basil\", \"pizza dough\"],
                \"allergens\": [\"gluten\", \"dairy\"]
            },
            {
                \"name\": \"Pepperoni Pizza\",
                \"description\": \"Traditional pepperoni pizza with mozzarella cheese\",
                \"price\": 16.99,
                \"category\": \"Pizza\",
                \"availability\": True,
                \"ingredients\": [\"pepperoni\", \"mozzarella\", \"tomato sauce\", \"pizza dough\"],
                \"allergens\": [\"gluten\", \"dairy\"]
            },
            {
                \"name\": \"Caesar Salad\",
                \"description\": \"Fresh romaine lettuce with Caesar dressing, croutons, and parmesan\",
                \"price\": 9.99,
                \"category\": \"Salads\",
                \"availability\": True,
                \"ingredients\": [\"romaine lettuce\", \"caesar dressing\", \"croutons\", \"parmesan\"],
                \"allergens\": [\"dairy\", \"gluten\"]
            },
            {
                \"name\": \"Spaghetti Carbonara\",
                \"description\": \"Classic pasta dish with eggs, cheese, and pancetta\",
                \"price\": 18.99,
                \"category\": \"Pasta\",
                \"availability\": True,
                \"ingredients\": [\"spaghetti\", \"eggs\", \"parmesan\", \"pancetta\", \"black pepper\"],
                \"allergens\": [\"gluten\", \"dairy\", \"eggs\"]
            },
            {
                \"name\": \"Tiramisu\",
                \"description\": \"Traditional Italian dessert with coffee and mascarpone\",
                \"price\": 7.99,
                \"category\": \"Desserts\",
                \"availability\": True,
                \"ingredients\": [\"mascarpone\", \"coffee\", \"ladyfingers\", \"cocoa\"],
                \"allergens\": [\"dairy\", \"eggs\", \"gluten\"]
            }
        ]
    }


def register_restaurant(restaurant_data: Dict[str, Any], verbose: bool = True) -> tuple[str, str]:
    \"\"\"Register a restaurant and return restaurant_id and api_key\"\"\"
    data_store = DataStore()
    
    # Validate restaurant data
    try:
        # Convert dict to Pydantic model for validation
        menu_items = [MenuItemCreate(**item) for item in restaurant_data['menu_items']]
        restaurant_model = RestaurantCreate(
            name=restaurant_data['name'],
            location=restaurant_data['location'],
            delivery_area=restaurant_data['delivery_area'],
            delivery_fee=restaurant_data['delivery_fee'],
            phone=restaurant_data.get('phone'),
            hours=restaurant_data.get('hours', {}),
            menu_items=menu_items
        )
    except Exception as e:
        raise ValueError(f\"Invalid restaurant data: {e}\")
    
    if verbose:
        print(f\"Registering restaurant: {restaurant_data['name']}\")
    
    # Save restaurant
    restaurant_id = data_store.save_restaurant(restaurant_data)
    if verbose:
        print(f\"Restaurant saved with ID: {restaurant_id}\")
    
    # Generate API key
    api_key = auth.create_api_key(restaurant_id)
    if verbose:
        print(f\"API key generated: {api_key}\")
    
    # Index restaurant in RAG system
    if verbose:
        print(\"Building vector index...\")
    rag.index_restaurant(restaurant_id, restaurant_data)
    if verbose:
        print(\"Vector index built successfully\")
    
    return restaurant_id, api_key


def main():
    parser = argparse.ArgumentParser(description=\"Restaurant Index Builder\")
    parser.add_argument(\"--file\", \"-f\", help=\"JSON file containing restaurant data\")
    parser.add_argument(\"--sample\", action=\"store_true\", help=\"Create a sample restaurant\")
    parser.add_argument(\"--list\", action=\"store_true\", help=\"List all registered restaurants\")
    parser.add_argument(\"--delete\", help=\"Delete a restaurant by ID\")
    parser.add_argument(\"--verbose\", \"-v\", action=\"store_true\", default=True, help=\"Verbose output\")
    
    args = parser.parse_args()
    
    if args.list:
        data_store = DataStore()
        restaurants = data_store.list_restaurants()
        api_keys = data_store.load_api_keys()
        
        # Create mapping of restaurant_id to api_key
        restaurant_api_keys = {}
        for api_key, key_data in api_keys.items():
            restaurant_api_keys[key_data[\"restaurant_id\"]] = api_key
        
        print(\"\\n=== Registered Restaurants ===\")
        if not restaurants:
            print(\"No restaurants registered yet.\")
        else:
            for restaurant in restaurants:
                print(f\"\\nID: {restaurant['id']}\")
                print(f\"Name: {restaurant['name']}\")
                print(f\"Location: {restaurant['location']}\")
                print(f\"API Key: {restaurant_api_keys.get(restaurant['id'], 'Not found')}\")
                print(f\"Menu Items: {len(restaurant.get('menu_items', []))}\")
                print(f\"Created: {restaurant['created_at']}\")
                print(\"-\" * 50)
        return
    
    if args.delete:
        data_store = DataStore()
        restaurant = data_store.get_restaurant(args.delete)
        
        if not restaurant:
            print(f\"Restaurant with ID {args.delete} not found.\")
            return
        
        print(f\"Deleting restaurant: {restaurant['name']}\")
        
        # Delete from vector store
        rag.delete_restaurant_data(args.delete)
        
        # Delete restaurant data
        data_store.delete_restaurant(args.delete)
        
        # Revoke API key
        api_keys = data_store.load_api_keys()
        for api_key, key_data in api_keys.items():
            if key_data[\"restaurant_id\"] == args.delete:
                auth.revoke_api_key(api_key)
                break
        
        print(\"Restaurant deleted successfully.\")
        return
    
    # Register restaurant
    if args.file:
        if not os.path.exists(args.file):
            print(f\"Error: File {args.file} not found.\")
            sys.exit(1)
        
        try:
            restaurant_data = load_restaurant_from_file(args.file)
        except Exception as e:
            print(f\"Error loading restaurant data from file: {e}\")
            sys.exit(1)
    elif args.sample:
        restaurant_data = create_sample_restaurant()
        print(\"Creating sample restaurant...\")
    else:
        print(\"Error: Please specify either --file or --sample option.\")
        parser.print_help()
        sys.exit(1)
    
    try:
        restaurant_id, api_key = register_restaurant(restaurant_data, args.verbose)
        
        print(\"\\n\" + \"=\" * 60)
        print(\"RESTAURANT REGISTRATION COMPLETE\")
        print(\"=\" * 60)
        print(f\"Restaurant ID: {restaurant_id}\")
        print(f\"API Key: {api_key}\")
        print(f\"Name: {restaurant_data['name']}\")
        print(f\"Location: {restaurant_data['location']}\")
        print(f\"Menu Items: {len(restaurant_data['menu_items'])}\")
        print(\"\\nYou can now use this API key to send chat requests to the /chat endpoint.\")
        print(\"\\nExample curl command:\")
        print(f'curl -X POST \"http://localhost:8000/chat\" \\\\')
        print(f'  -H \"Content-Type: application/json\" \\\\')
        print(f'  -H \"X-API-Key: {api_key}\" \\\\')
        print(f'  -d \\'{{\"message\": \"What pizzas do you have?\", \"user_id\": \"user123\"}}\\'')
        print(\"\\n\" + \"=\" * 60)
        
    except Exception as e:
        print(f\"Error registering restaurant: {e}\")
        sys.exit(1)


if __name__ == \"__main__\":
    main()
