import functions_framework
import os
import tempfile
import base64
from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials
import openai
from flask import jsonify, make_response
from dotenv import load_dotenv

# Initialize Firebase Admin SDK
load_dotenv()
cred = credentials.Certificate("ai-exam-apeal-live-firebase-adminsdk-fbsvc-28045fc9d1.json")
firebase_admin.initialize_app(cred)
openai.api_key = os.environ.get("OPENAI_API_KEY")

# --- Utility function to call GPT-4 Vision ---
def generate_appeal_from_image(file_path):
    with open(file_path, "rb") as f:
        base64_image = base64.b64encode(f.read()).decode("utf-8")

    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are an expert academic advisor helping students write professional exam appeals."},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Please generate a professional and detailed exam appeal based on this student's exam answer image."},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                ]
            }
        ],
        max_tokens=1000,
    )

    return response.choices[0].message["content"]

# --- Main Function ---
@functions_framework.http
def handle_exam_upload(request):
    # --- CORS Preflight ---
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.set("Access-Control-Allow-Origin", "*")
        response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.set("Access-Control-Max-Age", "3600")
        return response

    # --- CORS headers for actual response ---
    response_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }

    if request.method != "POST":
        return jsonify({"error": "Only POST allowed"}), 405, response_headers

    id_token = request.headers.get("Authorization", "").replace("Bearer ", "")
    file = request.files.get("file")
    appeal_id = request.form.get("appeal_id")

    if not file or not appeal_id:
        return jsonify({"error": "Missing file or appeal_id"}), 400, response_headers

    if not file.content_type.startswith("image/"):
        return jsonify({"error": "Only image files are supported"}), 400, response_headers

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        file.save(tmp.name)
        appeal_text = generate_appeal_from_image(tmp.name)

    db = firestore.Client()
    db.collection("appeals").document(appeal_id).update({
        "original_text": "[Image uploaded – processed with GPT-4 Vision]",
        "appeal": appeal_text,
        "status": "processing",
    })

    return jsonify({"message": "Appeal created", "appeal": appeal_text}), 200, response_headers
