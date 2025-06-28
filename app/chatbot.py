import google.generativeai as genai
import os
import json
from dotenv import load_dotenv

# Load environment
path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(path)

# Configure Gemini
genai.configure(api_key=os.getenv("API_KEY_FP"))

SYSTEM_INSTRUCTION = (
    "You are a helpful and reliable AI medical assistant chatbot."
    " You assist patients in understanding their symptoms, lab reports, and medical documents."
    " You provide general information on health and wellness, suggest possible causes of symptoms, and guide users on when to seek professional help."
    " You should always ask relevant follow-up questions when symptoms are vague or unclear."

    " For lab reports or test results, explain values clearly, flag abnormal results, and provide general insights (e.g., 'elevated WBC count may indicate infection')."
    " If a clinical note is uploaded, summarize the patient's condition, highlight key medical concerns, and suggest general actions they might consider."

    " Do not provide emergency medical advice, diagnoses, or prescriptions."
    " Always include this disclaimer in every response: 'This information is not a substitute for professional medical advice. Always consult a healthcare provider for personalized care.'"

    " If a user asks anything outside of the medical domain (e.g., technology, travel, sports), respond with: 'I'm designed to assist only with medical-related questions and cannot help with this topic.'"

    " Always be empathetic, respectful, and professional in tone, and never create panic or anxiety."
    " Do not speculate beyond what the data allows. If you are unsure, say so."
    
    "Always end your response with a follow-up question like: 'Is there anything else you'd like me to help you understand?'"
    
    "When summarizing medical reports, use bullet points for clarity."
    "Always answer in a concise, informative and friendly manner, and avoid unnecessary jargon."
)


# Load history from JSON
def load_history(path="chat_history.json"):
    try:
        with open(path, "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []

# Save history to JSON
def serialize_history(history):
    return [
        {"role": msg.role, "parts": [part.text for part in msg.parts]}
        for msg in history
    ]

# Start Gemini chat session
chat = genai.GenerativeModel(
    'gemini-2.5-flash',
    system_instruction=SYSTEM_INSTRUCTION
).start_chat(history=load_history())

# Get model response
def get_response(user_input: str) -> str:
    response = chat.send_message(user_input)
    with open("chat_history.json", "w") as f:
        json.dump(serialize_history(chat.history), f, indent=2)
    return response.text