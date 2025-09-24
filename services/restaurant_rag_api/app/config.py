import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


class Config:
    """Configuration class for the RAG API service"""
    
    # OpenAI Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    
    # Service Configuration
    SERVICE_PORT = int(os.getenv("SERVICE_PORT", 8000))
    LOG_LEVEL = os.getenv("LOG_LEVEL", "info")
    
    # Data Directory
    DATA_DIR = os.getenv("DATA_DIR", "./data")
    
    # Vector Database Configuration
    CHROMA_PERSIST_DIRECTORY = os.getenv("CHROMA_PERSIST_DIRECTORY", "./data/chroma_db")
    
    # Storage Files
    API_KEYS_FILE = os.getenv("API_KEYS_FILE", "./data/api_keys.json")
    RESTAURANTS_FILE = os.getenv("RESTAURANTS_FILE", "./data/restaurants.json")
    
    # RAG Configuration
    CHUNK_SIZE = 1000
    CHUNK_OVERLAP = 200
    TOP_K_RESULTS = 5
    TEMPERATURE = 0.7
    
    # Embedding Model
    EMBEDDING_MODEL = "text-embedding-ada-002"
    
    # Chat Model
    CHAT_MODEL = "gpt-3.5-turbo"
    
    @classmethod
    def validate(cls):
        """Validate required configuration"""
        if not cls.OPENAI_API_KEY:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        
        # Ensure data directory exists
        os.makedirs(cls.DATA_DIR, exist_ok=True)
        os.makedirs(cls.CHROMA_PERSIST_DIRECTORY, exist_ok=True)


# Validate configuration on import
Config.validate()
