import os
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
import firebase_admin
from firebase_admin import credentials, firestore
from dotenv import load_dotenv
import openai

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "super-secret-key-for-dev")

# Initialize Firebase Admin SDK
# Note: You need a serviceAccountKey.json file in the root directory
try:
    if not firebase_admin._apps:
        cred = credentials.Certificate("serviceAccountKey.json")
        firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase connected successfully.")
except Exception as e:
    print(f"Error initializing Firebase: {e}")
    db = None

# Initialize OpenAI
openai.api_key = os.getenv("OPENAI_API_KEY")

# --- Routes ---

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/register")
def register():
    return render_template("register.html")

@app.route("/dashboard/patient")
def dashboard_patient():
    # In a real app, verify authentication here
    return render_template("dashboard_patient.html")

@app.route("/dashboard/doctor")
def dashboard_doctor():
    return render_template("dashboard_doctor.html")

@app.route("/dashboard/admin")
def dashboard_admin():
    return render_template("dashboard_admin.html")

@app.route("/book_appointment")
def book_appointment():
    return render_template("book_appointment.html")

@app.route("/medical_records")
def medical_records():
    return render_template("medical_records.html")

@app.route("/my_tokens")
def my_tokens():
    return render_template("my_tokens.html")

@app.route("/map")
def hospital_map():
    return render_template("map.html", maps_api_key=os.getenv("GOOGLE_MAPS_API_KEY"))

# --- API Routes for Chatbot ---
@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    
    if not user_message:
        return jsonify({"error": "Message is required"}), 400
        
    try:
        # Check if we have a real API key configured
        api_key = os.getenv("OPENAI_API_KEY")
        
        if not api_key or api_key == "your_openai_api_key_here":
            # Mock behavior if no API Key is provided for demo purposes
            msg_lower = user_message.lower()
            
            # Simple keyword matching heuristic
            if any(word in msg_lower for word in ['bone', 'joint', 'fracture', 'knee']):
                return jsonify({"reply": "Based on those symptoms, I suggest you visit the Orthopedic department."})
            elif any(word in msg_lower for word in ['skin', 'rash', 'itchy', 'acne', 'pimple']):
                return jsonify({"reply": "For those skin issues, you should consult with Dermatology."})
            elif any(word in msg_lower for word in ['stomach', 'fever', 'headache', 'pain', 'cough', 'cold']):
                return jsonify({"reply": "General Medicine would be the best department to evaluate those symptoms."})
            elif any(word in msg_lower for word in ['baby', 'child', 'kid', 'infant']):
                return jsonify({"reply": "Our Pediatrics department specializes in child healthcare."})
            elif any(word in msg_lower for word in ['pregnancy', 'period', 'women']):
                return jsonify({"reply": "You should book an appointment with Gynecology for that."})
            else:
                return jsonify({"reply": "I recommend visiting the general OPD for an initial assessment, as I couldn't precisely match those symptoms to a specific specialty."})

        # Real OpenAI Logic
        system_prompt = """
        You are an AI assistant for a government hospital scheduler.
        Your goal is to analyze the patient's symptoms and suggest ONE of the following departments:
        - OPD
        - Orthopedic
        - Dermatology
        - Gynecology
        - General Medicine
        - Pediatrics
        
        Examples:
        "knee pain" -> Orthopedic
        "skin rash" -> Dermatology
        "stomach pain" -> General Medicine
        "fever" -> General Medicine
        "baby is coughing" -> Pediatrics
        
        Respond with ONLY the name of the department, or a brief polite message suggesting the department if they need more help.
        """
        
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ]
        )
        
        ai_reply = response.choices[0].message.content
        return jsonify({"reply": ai_reply})
        
    except Exception as e:
        print(f"Chatbot error: {e}")
        return jsonify({"error": "Failed to process chat message", "details": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)
