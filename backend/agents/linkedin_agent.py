from scoring import text_quality_score
from gemini_client import call_gemini


def run(linkedin_text, target_role="", cv_text="", certificates="", experience=""):
    linkedin_score = text_quality_score(linkedin_text, minimum_length=120)

    prompt = f"""
You are the LinkedIn Agent, a professional LinkedIn profile expert focused only on the candidate's LinkedIn presence.

Target Role:
{target_role}

CV Text (for context only):
{cv_text}

LinkedIn About:
{linkedin_text}

Certificates:
{certificates}

Experience:
{experience}

Instructions:
- Focus only on the LinkedIn About section and headline, not the full CV.
- Write in a professional but natural tone.
- Do not invent fake degrees, companies, jobs, or certifications.
- Use only the information provided by the user.
- If the user has certificates or experience, use them to make the LinkedIn About stronger.
- The improved LinkedIn About should be polished, confident, and suitable for fresh graduates or junior roles, written in first person.
- Weaknesses should be constructive and specific.
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

Return ONLY valid JSON in this exact structure:
{{
  "overall_feedback": "short professional feedback about the LinkedIn presence and fit for the target role",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "improved_linkedin_about": "a polished LinkedIn About section written in first person",
  "suggested_headline": "LinkedIn headline suggestion"
}}
"""

    result = call_gemini(prompt)

    if result["ok"]:
        ai_feedback = result["data"]
    else:
        ai_feedback = {
            "overall_feedback": "AI analysis is unavailable right now.",
            "strengths": [],
            "weaknesses": [],
            "improved_linkedin_about": "",
            "suggested_headline": ""
        }

    return {
        "linkedin_score": linkedin_score,
        "ai_feedback": ai_feedback
    }
