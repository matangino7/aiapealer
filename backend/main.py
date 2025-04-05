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


# Initialize Firebase Admin SDK
cred = credentials.Certificate("ai-exam-apeal-live-firebase-adminsdk-fbsvc-28045fc9d1.json")
firebase_admin.initialize_app(cred)
openai.api_key = os.environ.get("OPENAI_API_KEY")

# --- Utility functions ---
def extract_text_from_file(file_path, content_type):
    extracted_text = ""
    if content_type == "application/pdf":
        reader = PdfReader(file_path)
        # Limit to 30 pages
        for page in reader.pages[:30]:
            extracted_text += page.extract_text() or ""
    elif content_type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        doc = Document(file_path)
        extracted_text = "\n".join(p.text for p in doc.paragraphs)
    elif content_type.startswith("image/"):
        image = Image.open(file_path)
        extracted_text = pytesseract.image_to_string(image)
    return extracted_text

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
    files = request.files.getlist('file')
    appeal_id = request.form.get('appeal_id')
    print(files)

    if not files or not appeal_id:
        return jsonify({"error": "Missing file or appeal_id"}), 400, response_headers

    # Make sure the number of files is within the limit (30 files or 30 pages for PDFs)
    if len(files) > 30:
        return jsonify({"error": "Too many files. Max 30 files are allowed."}), 400, response_headers

    extracted_text = ""
    for file in files:
        with tempfile.NamedTemporaryFile(delete=False) as tmp:
            file.save(tmp.name)
            content_type = file.content_type
            extracted_text += extract_text_from_file(tmp.name, content_type)

    # appeal = generate_appeal(extracted_text)

    # Save to Firestore
    db = firestore.Client()
    db.collection("appeals").document(appeal_id).update({
        "original_text": extracted_text,
        "appeal": 'works',
        "status": 'processing',
    })

    return jsonify({"message": "Appeal created", "appeal": "appeal"}), 200, response_headers
