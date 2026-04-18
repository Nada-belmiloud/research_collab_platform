"""
cv_extractor.py
================
Extracts text from a PDF CV (text-based or scanned) and uses the
Groq API (LLaMA 3.3 70b) to parse it into structured JSON.

REQUIREMENTS — install once:
    pip install pdfplumber pytesseract pdf2image groq

SYSTEM DEPENDENCIES:
    macOS:   brew install tesseract poppler
    Ubuntu:  sudo apt-get install -y tesseract-ocr poppler-utils
    Windows: install Tesseract from https://github.com/UB-Mannheim/tesseract/wiki
             install poppler from https://github.com/oschwartz10612/poppler-windows

USAGE:
    python cv_extractor.py path/to/your_cv.pdf
"""

import sys
import json
import re
import os

# ── 1. PDF TEXT EXTRACTION ──────────────────────────────────────────────────

def extract_text_pdfplumber(pdf_path: str) -> str:
    """
    Primary extractor: uses pdfplumber to pull text from a text-based PDF.
    Returns the extracted text or an empty string if nothing is found.
    """
    import pdfplumber

    text = ""
    with pdfplumber.open(pdf_path) as pdf:
        for i, page in enumerate(pdf.pages):
            page_text = page.extract_text() or ""
            text += f"\n--- Page {i + 1} ---\n{page_text}"
    return text.strip()


def extract_text_ocr(pdf_path: str) -> str:
    """
    Fallback extractor: converts each PDF page to a high-DPI image,
    cleans it with OpenCV, then runs Tesseract OCR.
    Used when the PDF is a scanned image (no embedded text).
    """
    import pytesseract
    from pdf2image import convert_from_path
    import cv2
    import numpy as np

    # Convert PDF pages to PIL Images at 300 DPI for best OCR quality
    pages = convert_from_path(pdf_path, dpi=300)

    full_text = ""
    for i, page in enumerate(pages):
        # PIL Image → NumPy array (RGB)
        img = np.array(page)

        # Convert to greyscale
        gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

        # Otsu binarisation: removes noise and improves OCR accuracy
        _, cleaned = cv2.threshold(gray, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)

        # Run Tesseract (English + French since many ENSIA CVs are bilingual)
        text = pytesseract.image_to_string(cleaned, lang="eng+fra")
        full_text += f"\n--- Page {i + 1} ---\n{text}"

    return full_text.strip()


def extract_text(pdf_path: str) -> str:
    """
    Smart dispatcher: tries pdfplumber first.
    If the extracted text is too short (likely a scanned PDF), falls back to OCR.
    """
    print(f"[1/3] Reading PDF: {pdf_path}")
    text = extract_text_pdfplumber(pdf_path)

    if len(text) < 200:
        print("      → Text too short, switching to OCR fallback...")
        text = extract_text_ocr(pdf_path)

    if not text:
        raise ValueError("Could not extract any text from the PDF.")

    print(f"      → Extracted {len(text)} characters.")
    return text


# ── 2. STRUCTURED EXTRACTION WITH GROQ / LLAMA 3.3 ─────────────────────────

GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "YOUR_GROQ_API_KEY_HERE")
# Tip: set it as an environment variable instead of hardcoding:
#   export GROQ_API_KEY="gsk_..."   (Linux/macOS)
#   set    GROQ_API_KEY=gsk_...     (Windows CMD)


def extract_with_llama(raw_text: str) -> dict | None:
    """
    Sends the raw CV text to LLaMA 3.3 70b via Groq and returns a
    structured Python dict that matches the frontend form schema.
    """
    from groq import Groq

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
  "technical_skills": ["list", "of", "technical", "skills"],
  "soft_skills": ["list", "of", "soft", "skills"],
  "languages": ["spoken languages the person knows"],
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
- If a field is not found, use null for strings or [] for lists
- Do NOT invent information that is not present in the CV
- Return ONLY the JSON

CV TEXT:
{raw_text}"""

    print("[2/3] Sending to LLaMA 3.3-70b via Groq...")

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,        # deterministic — best for structured extraction
        max_tokens=2000,
    )

    raw_response = response.choices[0].message.content.strip()

    # Strip accidental markdown fences
    raw_response = re.sub(r"^```json\s*", "", raw_response)
    raw_response = re.sub(r"^```\s*",     "", raw_response)
    raw_response = re.sub(r"\s*```$",     "", raw_response)

    try:
        parsed = json.loads(raw_response)
        print("[3/3] Parsing successful.")
        return parsed
    except json.JSONDecodeError as e:
        print(f"[!] JSON decode error: {e}")
        print("    Raw response was:\n", raw_response)
        return None


# ── 3. MAIN ─────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) < 2:
        print("Usage:  python cv_extractor.py path/to/cv.pdf")
        print("        python cv_extractor.py path/to/cv.pdf --save output.json")
        sys.exit(1)

    pdf_path = sys.argv[1]

    if not os.path.isfile(pdf_path):
        print(f"[!] File not found: {pdf_path}")
        sys.exit(1)

    # Extract raw text
    raw_text = extract_text(pdf_path)

    # Parse with LLaMA
    profile = extract_with_llama(raw_text)

    if profile is None:
        print("[!] Extraction failed. No output saved.")
        sys.exit(1)

    # Pretty-print to console
    print("\n" + "=" * 60)
    print("EXTRACTED PROFILE")
    print("=" * 60)
    print(json.dumps(profile, indent=2, ensure_ascii=False))

    # Optionally save to JSON file
    if "--save" in sys.argv:
        save_idx = sys.argv.index("--save")
        if save_idx + 1 < len(sys.argv):
            out_path = sys.argv[save_idx + 1]
        else:
            out_path = pdf_path.replace(".pdf", "_profile.json")

        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(profile, f, indent=2, ensure_ascii=False)
        print(f"\n[✓] Profile saved to: {out_path}")

    return profile


if __name__ == "__main__":
    main()


# ── BONUS: Flask API wrapper ─────────────────────────────────────────────────
# Uncomment and run with: python cv_extractor.py --server
# Then POST a PDF to http://localhost:5000/extract
#
# if "--server" in sys.argv:
#     from flask import Flask, request, jsonify
#     app = Flask(__name__)
#
#     @app.route("/extract", methods=["POST"])
#     def extract_endpoint():
#         if "file" not in request.files:
#             return jsonify({"error": "No file uploaded"}), 400
#         f = request.files["file"]
#         tmp = f"/tmp/{f.filename}"
#         f.save(tmp)
#         try:
#             text    = extract_text(tmp)
#             profile = extract_with_llama(text)
#             return jsonify(profile)
#         except Exception as e:
#             return jsonify({"error": str(e)}), 500
#
#     app.run(port=5000, debug=False)
