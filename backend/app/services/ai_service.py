import os
from google import genai
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from app.repositories import catalog_repo
from sqlalchemy.orm import Session
from app.models.catalog import Product

class SearchCriteria(BaseModel):
    category: Optional[str] = Field(None, description="Product category like Cotton, Denim, Silk")
    material: Optional[str] = Field(None, description="Material composition like 100% Cotton")
    color: Optional[str] = Field(None, description="Color of the fabric")
    max_price: Optional[float] = Field(None, description="Maximum price acceptable")
    quantity: Optional[int] = Field(None, description="Quantity required")
    quantity_unit: Optional[str] = Field(None, description="Unit of quantity like meter, kg")

class AIIntent(BaseModel):
    intent: str = Field(description="One of: PRODUCT_SEARCH, GENERAL_MARKETPLACE_HELP, CLARIFICATION")
    criteria: Optional[SearchCriteria] = Field(None, description="Structured criteria if intent is PRODUCT_SEARCH")
    clarification_question: Optional[str] = Field(None, description="Question to ask if intent is CLARIFICATION")

class AIProvider:
    def __init__(self):
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            print("WARNING: GEMINI_API_KEY not found in environment.")
            api_key = "dummy"
            
        self.client = genai.Client(api_key=api_key)
        self.model_name = "gemini-2.5-flash"

    def extract_intent(self, user_message: str) -> AIIntent:
        prompt = f"""
        You are an AI Shopping Assistant for a Textile Marketplace.
        Extract the intent from this user message: "{user_message}"
        If they want products, use intent PRODUCT_SEARCH and fill criteria.
        If vague, use CLARIFICATION and ask a clarifying question.
        Otherwise, use GENERAL_MARKETPLACE_HELP.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config={
                    "response_mime_type": "application/json",
                    "response_schema": AIIntent,
                    "temperature": 0.1
                }
            )
            return response.parsed
        except Exception as e:
            print(f"Error calling LLM: {e}")
            # Fallback
            return AIIntent(intent="GENERAL_MARKETPLACE_HELP")

    def search_products(self, db: Session, criteria: SearchCriteria) -> List[Dict[str, Any]]:
        query = db.query(Product).filter(Product.status == "PUBLISHED")
        
        if criteria.max_price:
            query = query.filter(Product.price <= criteria.max_price)
            
        products = query.limit(5).all()
        
        # Simple Python filtering for other attributes (in a real app, do this in SQL)
        results = []
        for p in products:
            if criteria.quantity and p.specifications:
                moq = p.specifications.get('moq_quantity', 1)
                if criteria.quantity < int(moq):
                    continue
            
            # Additional text filtering can be added here
            
            results.append({
                "id": p.id,
                "name": p.name,
                "price": p.price,
                "currency": p.currency,
                "stock_quantity": p.stock_quantity,
                "supplier_name": p.supplier.name if p.supplier else "Unknown",
                "primary_image_url": p.primary_image_url
            })
            
        return results

    def generate_response(self, user_message: str, intent: AIIntent, products: List[Dict[str, Any]], user_context: str = "") -> str:
        if intent.intent == "CLARIFICATION":
            return intent.clarification_question or "Could you please clarify your request?"
            
        if intent.intent == "PRODUCT_SEARCH":
            if not products:
                prompt = f"""
                The user asked: '{user_message}'.
                You searched the catalog but found NO products matching their criteria.
                Context: {user_context}
                Politely inform the user that no exact matches were found and ask if they would like to adjust their criteria (e.g. price, color).
                Keep it brief and conversational.
                """
            else:
                prompt = f"""
                The user asked: '{user_message}'.
                You found {len(products)} products that match.
                Context: {user_context}
                Briefly summarize why these products are a good fit for their request. Do not invent details. Keep it under 2 sentences.
                """
        else:
            prompt = f"""
            The user asked: '{user_message}'. 
            Context: {user_context}
            You are a helpful textile marketplace assistant. Respond briefly and politely.
            """
            
        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            return response.text
        except:
            if intent.intent == "PRODUCT_SEARCH" and not products:
                return "I couldn't find any exact matches for your request. Could you try adjusting your requirements?"
            elif intent.intent == "PRODUCT_SEARCH":
                return f"I found {len(products)} products that match your requirements."
            return "I am a marketplace assistant. I can help you find products."

ai_provider = AIProvider()
