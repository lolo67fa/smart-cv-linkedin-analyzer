from gemini_client import call_gemini

ALLOWED_PLATFORMS = [
    "Coursera",
    "YouTube",
    "freeCodeCamp",
    "edX",
    "Udemy",
    "LinkedIn Learning",
    "Official Documentation",
    "Practice/Project-based (self-directed)"
]


def run(target_role="", missing_keywords=None, cv_text="", experience=""):
    missing_keywords = missing_keywords or []

    prompt = f"""
You are the Learning Agent, an advisor who recommends what a candidate should learn next.

Target Role:
{target_role}

Missing Keywords/Skills:
{missing_keywords}

CV Text (for context only):
{cv_text}

Experience:
{experience}

Instructions:
- Recommend only the resource TYPE and a well-known platform BY NAME from this allowed list: {ALLOWED_PLATFORMS}.
- Do NOT invent specific course titles, course codes, instructor names, certificate names, or URLs.
- resource_type must be one of: "course", "certification", "project", "practice".
- Prioritize the most impactful skills first.
- Suggested projects should be small, achievable, and directly demonstrate the missing skills.
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

Return ONLY valid JSON in this exact structure:
{{
  "priority_skills": [
    {{"skill": "skill name", "why": "short reason", "resource_type": "course", "platform": "Coursera"}}
  ],
  "suggested_projects": ["project idea 1", "project idea 2"],
  "general_advice": "short paragraph of general learning advice"
}}
"""

    result = call_gemini(prompt)

    if result["ok"]:
        ai_feedback = result["data"]
    else:
        fallback_skills = [
            {"skill": kw, "why": "Frequently required for this role.", "resource_type": "practice", "platform": "Practice/Project-based (self-directed)"}
            for kw in missing_keywords[:5]
        ]
        ai_feedback = {
            "priority_skills": fallback_skills,
            "suggested_projects": [],
            "general_advice": "AI analysis is unavailable right now. Prioritize the skills listed above."
        }

    return {"ai_feedback": ai_feedback}
