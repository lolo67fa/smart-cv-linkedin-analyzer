from gemini_client import call_gemini


def run(
    cv_text,
    target_role="",
    job_description="",
    certificates="",
    experience="",
    cv_score=None,
    linkedin_score=None,
    missing_keywords=None
):
    missing_keywords = missing_keywords or []

    prompt = f"""
You are the Career Coach Agent, a career strategist who helps candidates plan their path toward a target role.

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

CV Score:
{cv_score}

LinkedIn Score:
{linkedin_score}

Missing Keywords/Skills:
{missing_keywords}

Instructions:
- Give a realistic, honest gap analysis between the candidate's current profile and the target role.
- Do not invent fake degrees, companies, jobs, or certifications.
- Use only the information provided by the user.
- The action plan should be concrete and achievable, split into 30/60/90 day milestones.
- Next role suggestions should be realistic next steps from the candidate's current level, not senior leadership roles.
- Return ONLY valid JSON.
- Do not include markdown.
- Do not include explanations outside JSON.

Return ONLY valid JSON in this exact structure:
{{
  "gap_analysis": "narrative paragraph on gaps vs the target role",
  "strengths_to_leverage": ["strength 1", "strength 2"],
  "key_gaps": ["gap 1", "gap 2", "gap 3"],
  "action_plan": {{
    "30_days": ["action 1", "action 2"],
    "60_days": ["action 1", "action 2"],
    "90_days": ["action 1", "action 2"]
  }},
  "next_role_suggestions": ["role 1", "role 2"],
  "long_term_path": "1-2 sentence narrative of a plausible 2-3 year trajectory"
}}
"""

    result = call_gemini(prompt)

    if result["ok"]:
        ai_feedback = result["data"]
    else:
        fallback_actions = [f"Build a small project demonstrating {kw}" for kw in missing_keywords[:3]]
        ai_feedback = {
            "gap_analysis": "AI analysis is unavailable right now. Focus on closing the missing keyword gaps below.",
            "strengths_to_leverage": [],
            "key_gaps": missing_keywords[:5],
            "action_plan": {
                "30_days": fallback_actions,
                "60_days": [],
                "90_days": []
            },
            "next_role_suggestions": [],
            "long_term_path": ""
        }

    return {"ai_feedback": ai_feedback}
