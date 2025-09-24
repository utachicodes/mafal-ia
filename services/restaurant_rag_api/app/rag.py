import os
from typing import List, Dict, Any, Optional
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.chat_models import ChatOpenAI
from langchain.schema import Document
from langchain.prompts import ChatPromptTemplate
from .config import Config
from .store import DataStore


class RestaurantRAG:
    """RAG pipeline for restaurant chatbot"""
    
    def __init__(self):
        self.embeddings = OpenAIEmbeddings(
            openai_api_key=Config.OPENAI_API_KEY,
            model=Config.EMBEDDING_MODEL
        )
        
        self.llm = ChatOpenAI(
            openai_api_key=Config.OPENAI_API_KEY,
            model=Config.CHAT_MODEL,
            temperature=Config.TEMPERATURE
        )
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=Config.CHUNK_SIZE,
            chunk_overlap=Config.CHUNK_OVERLAP
        )
        
        self.data_store = DataStore()
        
        # Initialize vector store
        self.vector_store = Chroma(
            embedding_function=self.embeddings,
            persist_directory=Config.CHROMA_PERSIST_DIRECTORY
        )
    
    def create_restaurant_documents(self, restaurant_id: str, restaurant_data: Dict[str, Any]) -> List[Document]:
        """Create documents from restaurant data for indexing"""
        documents = []
        
        # Restaurant basic info
        basic_info = f\"\"\"
        Restaurant: {restaurant_data['name']}
        Location: {restaurant_data['location']}
        Delivery Area: {restaurant_data['delivery_area']}
        Delivery Fee: ${restaurant_data['delivery_fee']}
        Phone: {restaurant_data.get('phone', 'Not available')}
        Hours: {restaurant_data.get('hours', {})}
        \"\"\"
        
        documents.append(Document(
            page_content=basic_info,
            metadata={
                "restaurant_id": restaurant_id,
                "type": "basic_info",
                "source": "restaurant_data"
            }
        ))
        
        # Menu items
        for item in restaurant_data.get('menu_items', []):
            menu_content = f\"\"\"
            Item: {item['name']}
            Description: {item['description']}
            Price: ${item['price']}
            Category: {item['category']}
            Available: {item.get('availability', True)}
            Ingredients: {', '.join(item.get('ingredients', []))}
            Allergens: {', '.join(item.get('allergens', []))}
            \"\"\"
            
            documents.append(Document(
                page_content=menu_content,
                metadata={
                    "restaurant_id": restaurant_id,
                    "type": "menu_item",
                    "item_name": item['name'],
                    "category": item['category'],
                    "price": item['price'],
                    "source": "menu"
                }
            ))
        
        return documents
    
    def index_restaurant(self, restaurant_id: str, restaurant_data: Dict[str, Any]):
        """Index a restaurant's data in the vector store"""
        # Create documents
        documents = self.create_restaurant_documents(restaurant_id, restaurant_data)
        
        # Split documents if needed
        split_docs = []
        for doc in documents:
            splits = self.text_splitter.split_documents([doc])
            split_docs.extend(splits)
        
        # Add to vector store
        self.vector_store.add_documents(split_docs)
        self.vector_store.persist()
    
    def query_restaurant(self, restaurant_id: str, query: str) -> List[Document]:
        \"\"\"Query the vector store for a specific restaurant\"\"\"
        # Search with restaurant_id filter
        results = self.vector_store.similarity_search(
            query,
            k=Config.TOP_K_RESULTS,
            filter={\"restaurant_id\": restaurant_id}
        )
        
        return results
    
    def generate_response(self, restaurant_id: str, user_message: str, session_id: Optional[str] = None) -> str:
        \"\"\"Generate response using RAG pipeline\"\"\"
        
        # Get restaurant info
        restaurant_data = self.data_store.get_restaurant(restaurant_id)
        if not restaurant_data:
            return \"I'm sorry, but I couldn't find information about this restaurant.\"
        
        # Query relevant documents
        relevant_docs = self.query_restaurant(restaurant_id, user_message)
        
        # Create context from relevant documents
        context = \"\\n\\n\".join([doc.page_content for doc in relevant_docs])
        
        # Create prompt
        prompt_template = ChatPromptTemplate.from_messages([
            (\"system\", \"\"\"You are a helpful customer service assistant for {restaurant_name}. 
            You help customers with their orders, questions about the menu, delivery information, and general inquiries.
            
            Use the following context about the restaurant to answer customer questions:
            
            {context}
            
            Guidelines:
            - Be friendly and helpful
            - Only provide information that is in the context
            - If asked about items not on the menu, politely explain they're not available
            - For orders, guide customers through the process
            - Include prices when mentioning menu items
            - Mention delivery fees and areas when relevant
            - If you don't know something, say so politely
            \"\"\"),
            (\"human\", \"{user_message}\")
        ])
        
        # Generate response
        messages = prompt_template.format_messages(
            restaurant_name=restaurant_data['name'],
            context=context,
            user_message=user_message
        )
        
        response = self.llm(messages)
        return response.content
    
    def delete_restaurant_data(self, restaurant_id: str):
        \"\"\"Delete all data for a restaurant from the vector store\"\"\"
        # Note: ChromaDB doesn't have a direct delete by filter method
        # In production, you might want to use a different vector database
        # or implement a more sophisticated deletion strategy
        
        # For now, we'll recreate the vector store without this restaurant's data
        all_restaurants = self.data_store.list_restaurants()
        
        # Clear current vector store
        if os.path.exists(Config.CHROMA_PERSIST_DIRECTORY):
            import shutil
            shutil.rmtree(Config.CHROMA_PERSIST_DIRECTORY)
        
        # Reinitialize vector store
        self.vector_store = Chroma(
            embedding_function=self.embeddings,
            persist_directory=Config.CHROMA_PERSIST_DIRECTORY
        )
        
        # Re-index all restaurants except the deleted one
        for restaurant in all_restaurants:
            if restaurant['id'] != restaurant_id:
                self.index_restaurant(restaurant['id'], restaurant)


# Global RAG instance
rag = RestaurantRAG()
