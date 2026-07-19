from scoring import keyword_score
from gemini_client import call_gemini


def run(cv_text, linkedin_text="", target_role="", job_description="", certificates="", experience=""):
    cv_score, matched_keywords, missing_keywords = keyword_score(
        cv_text=cv_text,
        linkedin_text=linkedin_text,
        target_role=target_role,
        certificates=certificates,
        experience=experience
    )

    prompt = f"""
You are the CV Agent, a professional resume expert focused only on the candidate's CV content.

Target Role:
{target_role}

Job Description:
{job_description}

CV Text:
{cv_text}

Certificates:
{certificates}

Experience:
{experience}

Matched Keywords:
{matched_keywords}

Missing Keywords:
{missing_keywords}

Instructions:
- Focus only on the CV content, not LinkedIn.
- Write in a professional but natural tone.
- Do not invent fake degrees, companies, jobs, or certifications.
- Use only the information provided by the user.
- The CV summary should be short and professional.
- Suggested CV bullet points should be achievement-oriented.
- Weaknesses should be constructive and specific.
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

Return ONLY valid JSON in this exact structure:
{{
  "overall_feedback": "short professional feedback about the CV and fit for the target role",
  "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "improved_cv_summary": "a concise professional CV summary",
  "suggested_cv_bullets": ["bullet 1", "bullet 2", "bullet 3", "bullet 4"],
  "recommended_keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"]
}}
"""

    result = call_gemini(prompt)

    if result["ok"]:
        ai_feedback = result["data"]
        if not ai_feedback.get("recommended_keywords"):
            ai_feedback["recommended_keywords"] = missing_keywords[:8]
    else:
        ai_feedback = {
            "overall_feedback": "AI analysis is unavailable right now. Keyword analysis was completed only.",
            "strengths": matched_keywords[:5],
            "weaknesses": missing_keywords[:5],
            "improved_cv_summary": "",
            "suggested_cv_bullets": [],
            "recommended_keywords": missing_keywords[:8]
        }

    return {
        "cv_score": cv_score,
        "matched_keywords": matched_keywords,
        "missing_keywords": missing_keywords,
        "ai_feedback": ai_feedback
    }
