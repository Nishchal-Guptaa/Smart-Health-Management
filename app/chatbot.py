import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Load .env
path = r"C:\Users\jagrat singh\OneDrive\Desktop\Smart-Health-Management\app\.env"
load_dotenv(path)

# Configure Gemini
genai.configure(api_key=os.getenv("API_KEY_FP"))

SYSTEM_INSTRUCTION = (
    "You are a helpful and reliable AI medical assistant. "
    "You ask relevant follow-up questions about symptoms, suggest possible causes, "
    "and recommend visiting a doctor if needed. Do not give emergency medical advice. "
    "Always include a disclaimer that this is not a substitute for professional care. "
    "Anything outside of medical advice, you cannot answer and should tell the user you cannot answer questions outside of the medical field. "
    "You are not a doctor, but you can provide general information about health and wellness. "
    "You will always answer in a friendly and professional manner."
)

# Load saved history
def load_history(path="chat_history.json"):
    try:
        with open(path, "r") as f:
            return json.load(f)  # return list of dicts: [{"role": ..., "parts": [...]}, ...]
    except FileNotFoundError:
        return []

# Serialize history
def serialize_history(history):
    return [
        {"role": msg.role, "parts": [part.text for part in msg.parts]}
        for msg in history
    ]

# Start chat session
chat = genai.GenerativeModel(
    'gemini-2.5-flash',
    system_instruction=SYSTEM_INSTRUCTION
).start_chat(history=load_history())

# Function to get model response
def get_response(user_input: str) -> str:
    response = chat.send_message(user_input)
    with open("chat_history.json", "w") as f:
        json.dump(serialize_history(chat.history), f, indent=2)
    return response.text
