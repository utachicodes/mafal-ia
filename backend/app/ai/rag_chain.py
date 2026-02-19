from typing import Optional
from langchain_anthropic import ChatAnthropic
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from app.core import database
from app.core.config import settings


llm = ChatAnthropic(
    model="claude-sonnet-4-6",
    anthropic_api_key=settings.ANTHROPIC_API_KEY,
    temperature=0,
)

SYSTEM_PROMPT = """
You are Mafal-IA, an intelligent, multilingual automation agent for {business_name}.
You act as a Digital Alchemist, transforming customer messages into accurate information and smooth experiences.

Knowledge Scope (STRICT):
1. You ONLY know the information provided in the context below.
2. If information is missing, politely ask for clarification.
3. NEVER invent items, prices, or details.
4. NEVER mention internal systems or other businesses.

Language Rules:
1. Detect the user's language automatically (English, French, Arabic).
2. Respond in the SAME language as the user.
3. Keep phrasing natural and culturally appropriate for WhatsApp.

Tone & Style:
- Friendly, polite, and confident.
- Short paragraphs (WhatsApp-friendly).
- No unnecessary verbosity.

Context Information:
{context}
"""


class RAGChain:
    def __init__(self, business_id: Optional[str]):
        self.business_id = business_id
        self.prompt = ChatPromptTemplate.from_messages([
            ("system", SYSTEM_PROMPT),
            ("human", "{question}"),
        ])

    async def get_context(self) -> tuple[str, str]:
        """Return (context_text, business_name)."""
        if not self.business_id:
            return "No specific context available.", "Mafal-IA"

        try:
            restaurant = await database.get_restaurant(self.business_id)
            if not restaurant:
                return "No specific context available.", "the business"

            business_name = restaurant.get("name", "the business")
            context = f"Business Name: {business_name}\n"
            context += f"Description: {restaurant.get('description') or ''}\n\n"

            items = await database.get_menu_items(self.business_id)
            if items:
                context += "Available Items/Services:\n"
                for item in items:
                    price = item.get("price", "")
                    desc = item.get("description", "")
                    context += f"- {item['name']}: {price} ({desc})\n"

            return context, business_name
        except Exception as e:
            print(f"Retrieval error: {e}")
            return "No specific context available.", "the business"

    async def chat(self, question: str) -> str:
        context, business_name = await self.get_context()

        chain = (
            {
                "context": lambda x: context,
                "question": RunnablePassthrough(),
                "business_name": lambda x: business_name,
            }
            | self.prompt
            | llm
            | StrOutputParser()
        )

        return await chain.ainvoke(question)


def get_rag_chain(business_id: Optional[str] = None) -> RAGChain:
    return RAGChain(business_id)
