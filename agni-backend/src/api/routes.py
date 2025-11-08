from fastapi import APIRouter
from .models import ChatRequest, ChatResponse
from agents.fire_risk_agent import graph 

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    user_input = request.message
    response_text = ""
    
    try:
        events = graph.stream(
            {"messages": [{"role": "user", "content": user_input}]},
            {"configurable": {"thread_id": "1"}},
            stream_mode="values"
        )
        
        for event in events:
            last_message = event["messages"][-1]
            if hasattr(last_message, "content") and last_message.content:
                response_text = last_message.content
        
        return ChatResponse(response=response_text if response_text else "I'm sorry, I couldn't process that request.")
    
    except Exception as e:
        return ChatResponse(response=f"Error: {str(e)}")