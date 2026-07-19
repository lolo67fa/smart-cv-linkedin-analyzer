from role_data import get_keywords


def keyword_score(cv_text, linkedin_text, target_role, certificates="", experience=""):
    combined_text = f"{cv_text} {linkedin_text} {certificates} {experience}".lower()

    keywords = get_keywords(target_role)
    matched = []
    missing = []

    for keyword in keywords:
        if keyword.lower() in combined_text:
            matched.append(keyword)
        else:
            missing.append(keyword)

    if len(keywords) == 0:
        score = 0
    else:
        score = round((len(matched) / len(keywords)) * 100)

    return score, matched, missing


def text_quality_score(text, minimum_length=100):
    clean_text = text.strip()

    if not clean_text:
        return 0

    if len(clean_text) >= minimum_length:
        return 80

    if len(clean_text) >= 60:
        return 60

    if len(clean_text) >= 30:
        return 45

    return 25


def extra_profile_score(certificates, experience):
    score = 0

    if certificates.strip():
        score += 50

    if experience.strip():
        score += 50

    return score
