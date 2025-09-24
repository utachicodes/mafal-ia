from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class ChatMessage(BaseModel):
    """Message from webhook/chat"""
    message: str
    user_id: Optional[str] = None
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response back to webhook"""
    response: str
    restaurant_id: str
    timestamp: datetime
    session_id: Optional[str] = None


class MenuItemCreate(BaseModel):
    """Model for creating menu items"""
    name: str
    description: str
    price: float
    category: str
    availability: bool = True
    ingredients: Optional[List[str]] = []
    allergens: Optional[List[str]] = []


class RestaurantCreate(BaseModel):
    """Model for creating a restaurant"""
    name: str
    location: str
    delivery_area: str
    delivery_fee: float
    phone: Optional[str] = None
    hours: Optional[Dict[str, str]] = {}
    menu_items: List[MenuItemCreate]


class RestaurantInfo(BaseModel):
    """Restaurant information model"""
    id: str
    name: str
    location: str
    delivery_area: str
    delivery_fee: float
    phone: Optional[str] = None
    hours: Optional[Dict[str, str]] = {}
    api_key: str
    created_at: datetime


class APIKeyResponse(BaseModel):
    """API key response model"""
    api_key: str
    restaurant_id: str
    message: str
