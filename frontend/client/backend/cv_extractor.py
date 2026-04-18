"""
cv_extractor.py  —  Windows-ready CV extraction server
=======================================================

FIRST TIME SETUP (run in CMD, once):
    pip install pdfplumber pytesseract pdf2image groq opencv-python flask flask-cors

SYSTEM DEPENDENCIES (Windows):
    1. Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
       → Install to: C:\\Program Files\\Tesseract-OCR\\
       → During install, tick "Additional language data → French"
    2. Poppler: https://github.com/oschwartz10612/poppler-windows/releases
       → Extract to: C:\\poppler\\
       → Add C:\\poppler\\Library\\bin to your System PATH

TO START THE SERVER (open CMD inside the backend/ folder):
    set GROQ_API_KEY=gsk_your_key_here
    python cv_extractor.py

The server runs at http://localhost:5000
Your React SignUpPage calls it automatically when you upload a CV.

CV FILE RESTRICTIONS:
    - Format : PDF only (.pdf)
    - Max size: no hard limit, but < 10 MB recommended for speed
    - Content : any PDF — text-based or scanned image (OCR handles both)
    - Language: English or French (Tesseract configured for both)
"""

import os
import re
import json
import sys

import pytesseract

# ─── WINDOWS PATH — adjust if you installed Tesseract elsewhere ───────────────
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
# ─────────────────────────────────────────────────────────────────────────────

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allows your React dev server (localhost:3000) to call this

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")


# ═══════════════════════════════════════════════════════════════════════════════
# 1. TEXT EXTRACTION
# ═══════════════════════════════════════════════════════════════════════════════

def extract_text_pdfplumber(pdf_path: str) -> str:
    """Extract text from a text-based (non-scanned) PDF."""
    import pdfplumber

    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            page_text = page.extract_text() or ""
            text += f"\n--- Page {i + 1} ---\n{page_text}"
    return text.strip()


def extract_text_ocr(pdf_path: str) -> str:
    """
    Fallback for scanned PDFs.
    Converts each page to a 300-DPI image, cleans it, then runs Tesseract.
    """
    from pdf2image import convert_from_path
    import cv2
    import numpy as np

    # poppler must be on PATH (see setup instructions above)
    pages = convert_from_path(pdf_path, dpi=300)

    full_text = ""
    for i, page in enumerate(pages):
        img   = np.array(page)
        gray  = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)
        _, bw = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # eng+fra covers most ENSIA CVs; add +ara if you have Arabic Tesseract data
        text  = pytesseract.image_to_string(bw, lang="eng+fra")
        full_text += f"\n--- Page {i + 1} ---\n{text}"

    return full_text.strip()


def extract_text(pdf_path: str) -> str:
    """
    Smart dispatcher: tries pdfplumber first (fast, accurate for digital PDFs).
    Falls back to OCR if the extracted text is suspiciously short (scanned PDF).
    """
    text = extract_text_pdfplumber(pdf_path)
    if len(text) < 200:
        text = extract_text_ocr(pdf_path)
    if not text:
        raise ValueError("Could not extract any text from this PDF.")
    return text


# ═══════════════════════════════════════════════════════════════════════════════
# 2. STRUCTURED PARSING WITH LLAMA 3.3 via GROQ
# ═══════════════════════════════════════════════════════════════════════════════

def parse_with_llama(raw_text: str) -> dict:
    """
    Sends raw CV text to LLaMA 3.3-70b (Groq) and returns a structured dict
    matching the React SignUpPage form schema exactly.
    """
    from groq import Groq

    if not GROQ_API_KEY:
        raise ValueError(
            "GROQ_API_KEY is not set. "
            "Run: set GROQ_API_KEY=gsk_your_key_here  (in CMD before starting the server)"
        )

    client = Groq(api_key=GROQ_API_KEY)

    prompt = f"""You are an expert CV parser. Extract all information from the CV below.

Return ONLY a valid JSON object with exactly this structure — no markdown, no backticks, no explanation:
{{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "linkedin": "linkedin url or null",
  "github": "github url or null",
  "location": "city and country or null",
  "summary": "professional summary in 1-2 sentences or null",
  "technical_skills": ["skill1", "skill2"],
  "soft_skills": ["skill1", "skill2"],
  "languages": ["language1", "language2"],
  "education": [
    {{
      "degree": "degree name",
      "field": "field of study",
      "school": "university or school name",
      "start_year": "year or null",
      "end_year": "year or null",
      "gpa": "gpa if mentioned or null"
    }}
  ],
  "experience": [
    {{
      "role": "job title",
      "company": "company name",
      "start_date": "start date",
      "end_date": "end date or Present",
      "description": "short summary of responsibilities"
    }}
  ],
  "certifications": [
    {{
      "name": "certification name",
      "issuer": "issuing organization",
      "year": "year or null"
    }}
  ],
  "projects": [
    {{
      "name": "project name",
      "description": "short description"
    }}
  ]
}}

Rules:
- Use null for missing strings, [] for missing arrays
- Do NOT invent any information not present in the CV
- Return ONLY the JSON, nothing else

CV TEXT:
{raw_text}"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
        max_tokens=2000,
    )

    raw = response.choices[0].message.content.strip()

    # Strip accidental markdown fences the model sometimes adds
    raw = re.sub(r"^```json\s*", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"^```\s*",     "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\s*```$",     "", raw, flags=re.MULTILINE)

    return json.loads(raw)   # raises json.JSONDecodeError if model misbehaved


# ═══════════════════════════════════════════════════════════════════════════════
# 3. FLASK ROUTES
# ═══════════════════════════════════════════════════════════════════════════════

UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_FOLDER, exist_ok=True)   # creates backend/uploads/ automatically


@app.route("/health", methods=["GET"])
def health():
    """Quick check — open http://localhost:5000/health in your browser to verify."""
    return jsonify({"status": "ok", "groq_key_set": bool(GROQ_API_KEY)})


@app.route("/extract", methods=["POST"])
def extract_endpoint():
    """
    POST /extract
    Body  : multipart/form-data  with field "file" = your PDF
    Returns: JSON profile object  (same shape as the React form state)
    """
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded. Send a PDF in the 'file' field."}), 400

    uploaded = request.files["file"]

    # ── validation ──────────────────────────────────────────────────────────
    if not uploaded.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are accepted."}), 400

    content = uploaded.read()
    uploaded.seek(0)                          # reset pointer after reading

    MB = 1024 * 1024
    if len(content) > 20 * MB:               # 20 MB hard limit
        return jsonify({"error": "File too large. Maximum size is 20 MB."}), 413
    # ────────────────────────────────────────────────────────────────────────

    # Save temporarily so pdfplumber / pdf2image can open it by path
    tmp_path = os.path.join(UPLOAD_FOLDER, uploaded.filename)
    uploaded.save(tmp_path)

    try:
        raw_text = extract_text(tmp_path)
        profile  = parse_with_llama(raw_text)
        return jsonify(profile)

    except json.JSONDecodeError:
        return jsonify({"error": "LLM returned invalid JSON. Try again."}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the temp file whether we succeeded or not
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


# ═══════════════════════════════════════════════════════════════════════════════
# 4. ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    if not GROQ_API_KEY:
        print("\n⚠️  WARNING: GROQ_API_KEY is not set!")
        print("   Run this first:  set GROQ_API_KEY=gsk_your_key_here\n")

    print("=" * 55)
    print("  ResearchAI CV Extractor — Flask Server")
    print("=" * 55)
    print("  Listening on:  http://localhost:5000")
    print("  Health check:  http://localhost:5000/health")
    print("  Extract route: POST http://localhost:5000/extract")
    print("=" * 55 + "\n")

    app.run(host="0.0.0.0", port=5000, debug=False)