import functions_framework
import os
import tempfile
from google.cloud import firestore
import firebase_admin
from firebase_admin import credentials
from PyPDF2 import PdfReader
from docx import Document
from PIL import Image
import pytesseract
import openai
from flask import jsonify, make_response
import multiprocessing
multiprocessing.set_start_method('spawn')



# Initialize Firebase Admin SDK
cred = credentials.Certificate("ai-exam-apeal-live-firebase-adminsdk-fbsvc-28045fc9d1.json")
firebase_admin.initialize_app(cred)
openai.api_key = os.environ.get("OPENAI_API_KEY")

# --- Utility functions ---
# def verify_firebase_token(id_token):
#     try:
#         decoded_token = auth.verify_id_token(id_token)
#         return decoded_token["uid"]
#     except Exception as e:
#         print("Token verification failed:", e)
#         return None

def extract_text_from_file(file_path, content_type):
    if content_type == "application/pdf":
        reader = PdfReader(file_path)
        return "\n".join([page.extract_text() or "" for page in reader.pages])

    elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        doc = Document(file_path)
        return "\n".join(p.text for p in doc.paragraphs)

    elif content_type.startswith("image/"):
        image = Image.open(file_path)
        return pytesseract.image_to_string(image)

    return "Unsupported file type."

def generate_appeal(text):
    response = openai.ChatCompletion.create(
        model="gpt-4-turbo",
        messages=[
            {"role": "system", "content": "You are an expert academic advisor helping students write professional exam appeals."},
            {"role": "user", "content": f"Here is the student's answer or exam content:\n{text}\nGenerate a polite, detailed exam appeal."}
        ]
    )
    return response.choices[0].message["content"]

# --- Main Function ---
@functions_framework.http
def handle_exam_upload(request):
    # --- CORS Preflight ---
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.set('Access-Control-Allow-Origin', '*')
        response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS')
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        response.headers.set('Access-Control-Max-Age', '3600')
        return response

    # --- Main Logic ---
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }

    if request.method != 'POST':
        return jsonify({"error": "Only POST allowed"}), 405, response_headers

    id_token = request.headers.get("Authorization", "").replace("Bearer ", "")
    file = request.files.get('file')
    appeal_id = request.form.get('appeal_id')
    if not file or not appeal_id:
        return jsonify({"error": "Missing file"}), 400, response_headers

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        file.save(tmp.name)
        content_type = file.content_type
        extracted_text = extract_text_from_file(tmp.name, content_type)
        appeal = 'works'

    db = firestore.Client()
    db.collection("appeals").document(appeal_id).update({
        "original_text": extracted_text,
        "appeal": appeal,
        "status": 'processing',
    })

    return jsonify({"message": "Appeal created", "appeal": appeal}), 200, response_headers
