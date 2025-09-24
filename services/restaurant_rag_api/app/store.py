import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional, Any
from .config import Config


class DataStore:
    """Data storage and management"""
    
    def __init__(self):
        self.api_keys_file = Config.API_KEYS_FILE
        self.restaurants_file = Config.RESTAURANTS_FILE
        
        # Initialize files if they don't exist
        self._init_storage_files()
    
    def _init_storage_files(self):
        """Initialize storage files with empty data if they don't exist"""
        for file_path in [self.api_keys_file, self.restaurants_file]:
            try:
                with open(file_path, 'r') as f:
                    json.load(f)
            except (FileNotFoundError, json.JSONDecodeError):
                with open(file_path, 'w') as f:
                    json.dump({}, f)
    
    def get_timestamp(self) -> str:
        """Get current timestamp"""
        return datetime.utcnow().isoformat()
    
    def generate_id(self) -> str:
        """Generate a unique ID"""
        return str(uuid.uuid4())
    
    # API Keys Management
    def load_api_keys(self) -> Dict[str, Any]:
        """Load API keys from storage"""
        try:
            with open(self.api_keys_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def save_api_keys(self, api_keys: Dict[str, Any]):
        """Save API keys to storage"""
        with open(self.api_keys_file, 'w') as f:
            json.dump(api_keys, f, indent=2)
    
    # Restaurant Management
    def load_restaurants(self) -> Dict[str, Any]:
        """Load restaurants from storage"""
        try:
            with open(self.restaurants_file, 'r') as f:
                return json.load(f)
        except (FileNotFoundError, json.JSONDecodeError):
            return {}
    
    def save_restaurants(self, restaurants: Dict[str, Any]):
        """Save restaurants to storage"""
        with open(self.restaurants_file, 'w') as f:
            json.dump(restaurants, f, indent=2)
    
    def save_restaurant(self, restaurant_data: Dict[str, Any]) -> str:
        """Save a single restaurant and return its ID"""
        restaurant_id = self.generate_id()
        restaurants = self.load_restaurants()
        
        restaurant_data.update({
            "id": restaurant_id,
            "created_at": self.get_timestamp()
        })
        
        restaurants[restaurant_id] = restaurant_data
        self.save_restaurants(restaurants)
        
        return restaurant_id
    
    def get_restaurant(self, restaurant_id: str) -> Optional[Dict[str, Any]]:
        """Get a restaurant by ID"""
        restaurants = self.load_restaurants()
        return restaurants.get(restaurant_id)
    
    def update_restaurant(self, restaurant_id: str, update_data: Dict[str, Any]) -> bool:
        """Update a restaurant"""
        restaurants = self.load_restaurants()
        
        if restaurant_id in restaurants:
            restaurants[restaurant_id].update(update_data)
            restaurants[restaurant_id]["updated_at"] = self.get_timestamp()
            self.save_restaurants(restaurants)
            return True
        
        return False
    
    def delete_restaurant(self, restaurant_id: str) -> bool:
        """Delete a restaurant"""
        restaurants = self.load_restaurants()
        
        if restaurant_id in restaurants:
            del restaurants[restaurant_id]
            self.save_restaurants(restaurants)
            return True
        
        return False
    
    def list_restaurants(self) -> List[Dict[str, Any]]:
        """List all restaurants"""
        restaurants = self.load_restaurants()
        return list(restaurants.values())
