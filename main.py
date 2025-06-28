from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from app.chatbot import get_response
from app.parse_clinical_note import parse_clinical_report
from app.pdf_parser import extract_medical_data_to_json
import json
from fastapi.responses import HTMLResponse

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Clear history on reload
@app.on_event("startup")
async def clear_chat_history_on_reload():
    history_file = "chat_history.json"
    if os.path.exists(history_file):
        os.remove(history_file)
        print(f"Deleted {history_file} on startup.")

# Request model
class UserQuery(BaseModel):
    question: str

@app.get("/", tags=["Root"])
async def root():
    return {
        "message": "Medical assistant backend is running.",
        "chat_url": "/chat",
        "upload_url": "/analyze-report"
    }

@app.post("/chat", tags=["Chat"])
async def chat_with_bot(query: UserQuery):
    user_input = query.question.strip()
    if user_input.lower() in ["exit", "quit", "stop"]:
        return {"message": "Goodbye! Stay Healthy!"}
    reply = get_response(user_input)
    return {"response": reply}

@app.post("/analyze-report", tags=["Medical Report"])
async def analyze_pdf_report(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        return {"error": "Only PDF files are supported."}

    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    # First try structured parser (lab reports)
    report_data = extract_medical_data_to_json(temp_path)
    
    if not report_data:  # If no structured data, try parsing as clinical note
        parsed_sections = parse_clinical_report(temp_path)
        report_data = parsed_sections
        prompt = (
            "I have uploaded a clinical note. Please analyze the following:\n\n"
            f"{json.dumps(parsed_sections, indent=2)}\n\n"
            "Summarize the patient's condition, key concerns, and suggest general advice."
        )
    else:
        prompt = (
            "Here is a patient's lab report in JSON format:\n\n"
            f"{json.dumps(report_data, indent=2)}\n\n"
            "Please analyze it and summarize any abnormal values, concerns, or conditions it may suggest."
        )

    os.remove(temp_path)  # ✅ Delete file at the end

    response = get_response(prompt)

    return {
        "extracted_data": report_data,
        "ai_analysis": response
    }


@app.get("/ui", response_class=HTMLResponse, tags=["Frontend"])
async def ui():
    return """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Smart Medical Assistant</title>
        <style>
            body { font-family: Arial; padding: 20px; max-width: 800px; margin: auto; }
            h2 { color: darkblue; }
            textarea, input[type=file] { width: 100%; margin-bottom: 10px; }
            button { padding: 10px 15px; margin-right: 10px; }
            pre { background: #f4f4f4; padding: 10px; }
        </style>
    </head>
    <body>
        <h2>🤖 Smart Medical Assistant</h2>

        <h3>💬 Chat</h3>
        <textarea id="chatInput" rows="3" placeholder="Describe your symptoms..."></textarea><br>
        <button onclick="sendChat()">Send</button>
        <pre id="chatResponse"></pre>

        <hr>

        <h3>📄 Analyze Medical Report (PDF)</h3>
        <input type="file" id="pdfFile" accept=".pdf"/><br>
        <button onclick="uploadPDF()">Upload & Analyze</button>
        <pre id="pdfResponse"></pre>

        <script>
            async function sendChat() {
                const input = document.getElementById('chatInput').value;
                const response = await fetch('/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question: input })
                });
                const data = await response.json();
                document.getElementById('chatResponse').innerText = data.response || data.message;
            }

            async function uploadPDF() {
                const fileInput = document.getElementById('pdfFile');
                if (!fileInput.files.length) return alert("Please select a PDF file.");
                
                const formData = new FormData();
                formData.append("file", fileInput.files[0]);

                const response = await fetch('/analyze-report', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                const readable = Object.entries(data.extracted_data || {}).map(([key, val]) => `${key}: ${val}`).join("\\n");
                document.getElementById('pdfResponse').innerText = "\\n\\nAI Analysis:\\n" + (data.ai_analysis || '');


            }
        </script>
    </body>
    </html>
    """