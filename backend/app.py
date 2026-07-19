from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename

from cv_parser import extract_text_from_file
from role_data import get_role_list
from scoring import keyword_score, text_quality_score, extra_profile_score
from agents import cv_agent, linkedin_agent, coach_agent, learning_agent, interview_agent

app = Flask(__name__)

allowed_origin = os.getenv("ALLOWED_ORIGIN")
if allowed_origin:
    CORS(app, origins=[allowed_origin])
else:
    CORS(app)

UPLOAD_FOLDER = "uploads"
ALLOWED_EXTENSIONS = {"pdf", "docx"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "AI Career Agent API is running"})


@app.route("/roles", methods=["GET"])
def roles():
    return jsonify({"roles": get_role_list()})


@app.route("/analyze", methods=["POST"])
def analyze():
    try:
        if "cv" not in request.files:
            return jsonify({"error": "No CV file uploaded"}), 400

        cv_file = request.files["cv"]

        if cv_file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        if not allowed_file(cv_file.filename):
            return jsonify({"error": "Only PDF and DOCX files are allowed"}), 400

        linkedin_text = request.form.get("linkedin", "")
        target_role = request.form.get("target_role", "")
        job_description = request.form.get("job_description", "")
        certificates = request.form.get("certificates", "")
        experience = request.form.get("experience", "")

        if not target_role:
            return jsonify({"error": "Target role is required"}), 400

        filename = secure_filename(cv_file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        cv_file.save(file_path)

        try:
            cv_text = extract_text_from_file(file_path)
        finally:
            if os.path.exists(file_path):
                os.remove(file_path)

        if not cv_text:
            return jsonify({"error": "Could not extract text from the CV"}), 400

        cv_score, matched_keywords, missing_keywords = keyword_score(
            cv_text=cv_text,
            linkedin_text=linkedin_text,
            target_role=target_role,
            certificates=certificates,
            experience=experience
        )

        linkedin_score = text_quality_score(linkedin_text, minimum_length=120)
        extra_score = extra_profile_score(certificates, experience)

        overall_score = round(
            (cv_score * 0.45) +
            (linkedin_score * 0.30) +
            (extra_score * 0.25)
        )

        return jsonify({
            "cv_text": cv_text,
            "target_role": target_role,
            "overall_score": overall_score,
            "cv_score": cv_score,
            "linkedin_score": linkedin_score,
            "matched_keywords": matched_keywords,
            "missing_keywords": missing_keywords
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/agents/cv", methods=["POST"])
def agent_cv():
    try:
        data = request.get_json(force=True) or {}

        if not data.get("cv_text") or not data.get("target_role"):
            return jsonify({"error": "cv_text and target_role are required"}), 400

        result = cv_agent.run(
            cv_text=data.get("cv_text", ""),
            linkedin_text=data.get("linkedin_text", ""),
            target_role=data.get("target_role", ""),
            job_description=data.get("job_description", ""),
            certificates=data.get("certificates", ""),
            experience=data.get("experience", "")
        )
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/agents/linkedin", methods=["POST"])
def agent_linkedin():
    try:
        data = request.get_json(force=True) or {}

        if not data.get("linkedin_text") or not data.get("target_role"):
            return jsonify({"error": "linkedin_text and target_role are required"}), 400

        result = linkedin_agent.run(
            linkedin_text=data.get("linkedin_text", ""),
            target_role=data.get("target_role", ""),
            cv_text=data.get("cv_text", ""),
            certificates=data.get("certificates", ""),
            experience=data.get("experience", "")
        )
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/agents/coach", methods=["POST"])
def agent_coach():
    try:
        data = request.get_json(force=True) or {}

        if not data.get("cv_text") or not data.get("target_role"):
            return jsonify({"error": "cv_text and target_role are required"}), 400

        result = coach_agent.run(
            cv_text=data.get("cv_text", ""),
            target_role=data.get("target_role", ""),
            job_description=data.get("job_description", ""),
            certificates=data.get("certificates", ""),
            experience=data.get("experience", ""),
            cv_score=data.get("cv_score"),
            linkedin_score=data.get("linkedin_score"),
            missing_keywords=data.get("missing_keywords", [])
        )
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/agents/learning", methods=["POST"])
def agent_learning():
    try:
        data = request.get_json(force=True) or {}

        if not data.get("target_role"):
            return jsonify({"error": "target_role is required"}), 400

        result = learning_agent.run(
            target_role=data.get("target_role", ""),
            missing_keywords=data.get("missing_keywords", []),
            cv_text=data.get("cv_text", ""),
            experience=data.get("experience", "")
        )
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/agents/interview/questions", methods=["POST"])
def agent_interview_questions():
    try:
        data = request.get_json(force=True) or {}

        if not data.get("target_role") or not data.get("cv_text"):
            return jsonify({"error": "target_role and cv_text are required"}), 400

        result = interview_agent.generate_questions(
            target_role=data.get("target_role", ""),
            cv_text=data.get("cv_text", ""),
            job_description=data.get("job_description", "")
        )
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/agents/interview/evaluate", methods=["POST"])
def agent_interview_evaluate():
    try:
        data = request.get_json(force=True) or {}

        if not data.get("question") or not data.get("answer"):
            return jsonify({"error": "question and answer are required"}), 400

        result = interview_agent.evaluate_answer(
            target_role=data.get("target_role", ""),
            question=data.get("question", ""),
            question_type=data.get("question_type", ""),
            answer=data.get("answer", ""),
            job_description=data.get("job_description", "")
        )
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "true").lower() == "true"
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
