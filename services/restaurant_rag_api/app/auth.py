import json
import secrets
from typing import Optional
from fastapi import HTTPException, Header
from .config import Config
from .store import DataStore


class APIKeyAuth:
    """API Key authentication handler"""
    
    def __init__(self):
        self.data_store = DataStore()
    
    def generate_api_key(self) -> str:
        """Generate a secure API key"""
        return f"mafal_{secrets.token_urlsafe(32)}"
    
    def create_api_key(self, restaurant_id: str) -> str:
        """Create and store a new API key for a restaurant"""
        api_key = self.generate_api_key()
        
        # Load existing API keys
        api_keys = self.data_store.load_api_keys()
        
        # Store the API key
        api_keys[api_key] = {
            "restaurant_id": restaurant_id,
            "created_at": self.data_store.get_timestamp()
        }
        
        # Save updated API keys
        self.data_store.save_api_keys(api_keys)
        
        return api_key
    
    def validate_api_key(self, api_key: str) -> Optional[str]:
        """Validate API key and return restaurant_id if valid"""
        api_keys = self.data_store.load_api_keys()
        
        if api_key in api_keys:
            return api_keys[api_key]["restaurant_id"]
        
        return None
    
    def get_restaurant_from_api_key(self, api_key: str = Header(..., alias="X-API-Key")) -> str:
        """FastAPI dependency to validate API key and return restaurant_id"""
        restaurant_id = self.validate_api_key(api_key)
        
        if not restaurant_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid API key"
            )
        
        return restaurant_id
    
    def revoke_api_key(self, api_key: str) -> bool:
        """Revoke an API key"""
        api_keys = self.data_store.load_api_keys()
        
        if api_key in api_keys:
            del api_keys[api_key]
            self.data_store.save_api_keys(api_keys)
            return True
        
        return False


# Global instance
auth = APIKeyAuth()
