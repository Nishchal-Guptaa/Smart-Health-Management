from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import HTMLResponse
from app.chatbot import get_response
import os

app = FastAPI()

class UserQuery(BaseModel):
    question: str
    
@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <head><title>Medical Assistant</title></head>
        <body>
            <h2>Medical assistant is running.</h2>
            <p>👉 Use <strong>POST</strong> to <code>/chat</code> for API access.</p>
            <p>🧑‍⚕️ <a href="/ui">Click here to open the chat UI</a></p>
        </body>
    </html>
    """

@app.on_event("startup")
async def clear_chat_history_on_reload():
    history_file = "chat_history.json"
    if os.path.exists(history_file):
        os.remove(history_file)
        print(f"Deleted {history_file} on startup.")

@app.get("/ui", response_class=HTMLResponse)
async def chat_ui():
    return """
    <html>
        <head><title>Medical Assistant Chat</title></head>
        <body>
            <h2>Talk to the Medical Assistant</h2>
            <form id="chatForm">
                <input type="text" id="question" placeholder="Enter your symptoms..." size="50"/>
                <button type="submit">Ask</button>
            </form>
            <p><strong>Response:</strong></p>
            <pre id="response"></pre>
            <script>
                const form = document.getElementById('chatForm');
                form.onsubmit = async (e) => {
                    e.preventDefault();
                    const question = document.getElementById('question').value;
                    const response = await fetch('/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ question })
                    });
                    const data = await response.json();
                    document.getElementById('response').innerText = data.response || data.message;
                };
            </script>
        </body>
    </html>
    """

@app.post("/chat")
async def chat_with_bot(query: UserQuery):
    user_input = query.question.strip()
    if user_input.lower() in ["exit", "quit", "stop"]:
        return {"message": "Goodbye! Stay Healthy!"}

    reply = get_response(user_input)
    return {"response": reply}
