import { useEffect, useState } from "react";
import { runLearningAgent } from "../../api";

function LearningAgentPanel({
  targetRole,
  cvText,
  experience,
  missingKeywords,
  cachedResult,
  onResult,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    runLearningAgent({
      target_role: targetRole,
      missing_keywords: missingKeywords,
      cv_text: cvText,
      experience,
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
    return <div className="agentLoading">Building your learning plan...</div>;
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

  return (
    <div className="reportCardsGrid">
      <div className="reportCard wide">
        <div className="reportTitle withAction">
          <div className="titleLeft">
            <span>📚</span>
            <h3>Priority Skills to Learn</h3>
          </div>
          <button className="miniCopyBtn" onClick={load}>
            Regenerate
          </button>
        </div>

        <div className="learningSkillsList">
          {feedback.priority_skills?.map((item, index) => (
            <div key={index} className="learningSkillRow">
              <div>
                <strong>{item.skill}</strong>
                <p>{item.why}</p>
              </div>
              <div className="tags">
                <span>{item.resource_type}</span>
                <span>{item.platform}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="reportCard wide">
        <div className="reportTitle">
          <span>🛠️</span>
          <h3>Suggested Projects</h3>
        </div>
        <ul>
          {feedback.suggested_projects?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="reportCard wide">
        <div className="reportTitle">
          <span>💡</span>
          <h3>General Advice</h3>
        </div>
        <p>{feedback.general_advice}</p>
      </div>
    </div>
  );
}

export default LearningAgentPanel;
