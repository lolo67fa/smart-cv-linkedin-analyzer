import os
import json
from google import genai
from dotenv import load_dotenv

load_dotenv()

MODEL = "gemini-2.5-flash"


def safe_json_parse(text):
    try:
        cleaned = text.strip()
        cleaned = cleaned.replace("```json", "").replace("```", "").strip()
        return json.loads(cleaned)
    except Exception:
        return None


def call_gemini(prompt, model=MODEL):
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        return {"ok": False, "data": None, "error": "missing_api_key"}

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(model=model, contents=prompt)
    except Exception as e:
        return {"ok": False, "data": None, "error": str(e)}

    parsed = safe_json_parse(response.text)

    if parsed is None:
        return {"ok": False, "data": None, "error": "invalid_json", "raw_text": response.text}

    return {"ok": True, "data": parsed, "error": None}
