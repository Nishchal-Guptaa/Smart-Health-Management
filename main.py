from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from app.chatbot import get_response  # Ensure this path is correct

app = FastAPI()

# Enable CORS so frontend can access API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserQuery(BaseModel):
    question: str

@app.get("/")
async def root():
    return {"message": "Medical assistant backend is running. Use POST /chat to interact."}

@app.on_event("startup")
async def clear_chat_history_on_reload():
    history_file = "chat_history.json"
    if os.path.exists(history_file):
        os.remove(history_file)
        print(f"Deleted {history_file} on startup.")

@app.post("/chat")
async def chat_with_bot(query: UserQuery):
    user_input = query.question.strip()
    if user_input.lower() in ["exit", "quit", "stop"]:
        return {"message": "Goodbye! Stay Healthy!"}

    reply = get_response(user_input)
    return {"response": reply}
