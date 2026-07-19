import { useEffect, useState } from "react";
import { runCoachAgent } from "../../api";

function CareerCoachPanel({
  cvText,
  targetRole,
  jobDescription,
  certificates,
  experience,
  cvScore,
  linkedinScore,
  missingKeywords,
  cachedResult,
  onResult,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    runCoachAgent({
      cv_text: cvText,
      target_role: targetRole,
      job_description: jobDescription,
      certificates,
      experience,
      cv_score: cvScore,
      linkedin_score: linkedinScore,
      missing_keywords: missingKeywords,
    })
      .then(onResult)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!cachedResult) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="agentLoading">Building your career roadmap...</div>;
  }

  if (error) {
    return (
      <div className="errorBox">
        {error}
        <button className="miniCopyBtn" onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  if (!cachedResult) return null;

  const feedback = cachedResult.ai_feedback || {};
  const plan = feedback.action_plan || {};

  return (
    <div className="reportCardsGrid">
      <div className="reportCard wide">
        <div className="reportTitle withAction">
          <div className="titleLeft">
            <span>🧭</span>
            <h3>Gap Analysis</h3>
          </div>
          <button className="miniCopyBtn" onClick={load}>
            Regenerate
          </button>
        </div>
        <p>{feedback.gap_analysis}</p>
      </div>

      <div className="reportCard">
        <div className="reportTitle">
          <span>✅</span>
          <h3>Strengths to Leverage</h3>
        </div>
        <ul>
          {feedback.strengths_to_leverage?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="reportCard">
        <div className="reportTitle">
          <span>⚠️</span>
          <h3>Key Gaps</h3>
        </div>
        <ul>
          {feedback.key_gaps?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="reportCard wide">
        <div className="reportTitle">
          <span>📅</span>
          <h3>Action Plan</h3>
        </div>
        <div className="steps">
          <div className="step">
            <span>30</span>
            <h3>Days</h3>
            <ul>
              {plan["30_days"]?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="step">
            <span>60</span>
            <h3>Days</h3>
            <ul>
              {plan["60_days"]?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="step">
            <span>90</span>
            <h3>Days</h3>
            <ul>
              {plan["90_days"]?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="reportCard">
        <div className="reportTitle">
          <span>🚀</span>
          <h3>Next Role Suggestions</h3>
        </div>
        <div className="tags">
          {feedback.next_role_suggestions?.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>

      <div className="reportCard">
        <div className="reportTitle">
          <span>🌱</span>
          <h3>Long-Term Path</h3>
        </div>
        <p>{feedback.long_term_path}</p>
      </div>
    </div>
  );
}

export default CareerCoachPanel;
