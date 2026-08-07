from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.database import get_db
from app.api.deps import get_current_user, get_optional_current_user
from app.models.user import User
from pydantic import BaseModel
from app.models.catalog import Product
import random

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any] = {}

class ChatResponse(BaseModel):
    response: str
    actions: List[Dict[str, str]] = []

@router.post("/chat", response_model=ChatResponse)
def ai_chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_optional_current_user)
):
    msg = request.message.lower()
    role = current_user.role if current_user else "guest"
    
    if "recommend" in msg or "suggest" in msg:
        if role == "buyer" or role == "guest":
            return ChatResponse(
                response="Based on your preferences, I recommend these high-quality fabrics. They match your category and have great reviews from other buyers.",
                actions=[{"type": "navigate", "target": "/marketplace"}]
            )
        else:
            return ChatResponse(
                response="You are a supplier. I can help you check your low stock items or pending orders."
            )
            
    if "stock" in msg or "inventory" in msg:
        if role == "supplier":
            return ChatResponse(
                response="I can take you to your inventory overview where you can see all your stock levels and update them as needed.",
                actions=[{"type": "navigate", "target": "/dashboard/supplier/inventory"}]
            )
        else:
            return ChatResponse(
                response="You don't have access to supplier inventory."
            )

    if "orders" in msg:
        return ChatResponse(
            response="Let me take you to your orders page.",
            actions=[{"type": "navigate", "target": "/orders"}]
        )
        
    return ChatResponse(
        response=f"I'm the FabricHub AI Assistant. You said: '{request.message}'. I can help you find products, check your dashboard, or navigate the marketplace."
    )
