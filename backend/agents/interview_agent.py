from scoring import text_quality_score
from gemini_client import call_gemini

FALLBACK_QUESTIONS = [
    {"id": 1, "type": "behavioral", "question": "Tell me about yourself."},
    {"id": 2, "type": "behavioral", "question": "Describe a challenge you overcame."},
    {"id": 3, "type": "behavioral", "question": "Why are you interested in this role?"}
]


def generate_questions(target_role="", cv_text="", job_description=""):
    prompt = f"""
You are the Interview Agent, preparing a candidate for a real interview.

Target Role:
{target_role}

Job Description:
{job_description}

CV Text:
{cv_text}

Instructions:
- Generate 6-7 interview questions for this candidate and target role.
- Roughly half should be behavioral questions and half should be role-specific technical questions for {target_role}.
- Base technical questions on skills that are plausible for this role and, where relevant, the candidate's CV.
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

Return ONLY valid JSON in this exact structure:
{{
  "questions": [
    {{"type": "behavioral", "question": "question text"}},
    {{"type": "technical", "question": "question text"}}
  ]
}}
"""

    result = call_gemini(prompt)

    if result["ok"] and result["data"].get("questions"):
        questions = result["data"]["questions"]
        numbered = []
        for index, item in enumerate(questions, start=1):
            numbered.append({
                "id": index,
                "type": item.get("type", "behavioral"),
                "question": item.get("question", "")
            })
        return {"questions": numbered}

    return {"questions": FALLBACK_QUESTIONS}


def evaluate_answer(target_role="", question="", question_type="", answer="", job_description=""):
    prompt = f"""
You are the Interview Agent, evaluating a candidate's spoken/written interview answer.

Target Role:
{target_role}

Job Description:
{job_description}

Question ({question_type}):
{question}

Candidate's Answer:
{answer}

Instructions:
- Evaluate the answer honestly and constructively for a candidate applying to {target_role}.
- Score from 0 to 100, where 80+ is excellent, 60-79 is good, 40-59 is fair, below 40 is weak.
- Do not invent facts about the candidate that are not in their answer.
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

Return ONLY valid JSON in this exact structure:
{{
  "score": 72,
  "what_was_good": ["point 1", "point 2"],
  "what_to_improve": ["point 1", "point 2"],
  "stronger_answer_points": ["point 1", "point 2"],
  "sample_answer": "a stronger model answer"
}}
"""

    result = call_gemini(prompt)

    if result["ok"]:
        data = result["data"]
        return {
            "score": data.get("score", 0),
            "ai_feedback": {
                "what_was_good": data.get("what_was_good", []),
                "what_to_improve": data.get("what_to_improve", []),
                "stronger_answer_points": data.get("stronger_answer_points", []),
                "sample_answer": data.get("sample_answer", "")
            }
        }

    heuristic_score = text_quality_score(answer, minimum_length=150)
    return {
        "score": heuristic_score,
        "ai_feedback": {
            "what_was_good": [],
            "what_to_improve": [],
            "stronger_answer_points": [],
            "sample_answer": "AI feedback unavailable — this is a length-based heuristic score only."
        }
    }
