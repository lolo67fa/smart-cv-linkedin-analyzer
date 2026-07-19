import { getScoreStatus, getScoreIcon } from "../../utils";

function CvAgentPanel({ result, loading, error, onRegenerate }) {
  if (loading) {
    return <div className="agentLoading">Analyzing your CV...</div>;
  }

  if (error) {
    return (
      <div className="errorBox">
        {error}
        <button className="miniCopyBtn" onClick={onRegenerate}>
          Retry
        </button>
      </div>
    );
  }

  if (!result) return null;

  const feedback = result.ai_feedback || {};

  return (
    <div className="reportCardsGrid">
      <div className={`scoreBox ${getScoreStatus(result.cv_score)}`}>
        <div className="scoreTop">
          <div className="scoreIcon">{getScoreIcon(result.cv_score)}</div>
          <h3>CV Score</h3>
        </div>
        <strong>{result.cv_score}%</strong>
        <p>CV keyword and role matching</p>
      </div>

      <div className="reportCard wide">
        <div className="reportTitle withAction">
          <div className="titleLeft">
            <span>🧠</span>
            <h3>Overall Feedback</h3>
          </div>
          <button className="miniCopyBtn" onClick={onRegenerate}>
            Regenerate
          </button>
        </div>
        <p>{feedback.overall_feedback}</p>
      </div>

      <div className="reportCard">
        <div className="reportTitle">
          <span>✅</span>
          <h3>Strengths</h3>
        </div>
        <ul>
          {feedback.strengths?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="reportCard">
        <div className="reportTitle">
          <span>⚠️</span>
          <h3>Weaknesses</h3>
        </div>
        <ul>
          {feedback.weaknesses?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="reportCard">
        <div className="reportTitle">
          <span>🎯</span>
          <h3>Matched Keywords</h3>
        </div>
        <div className="tags">
          {result.matched_keywords?.length > 0 ? (
            result.matched_keywords.map((item, index) => (
              <span key={index}>{item}</span>
            ))
          ) : (
            <p className="muted">No matched keywords found.</p>
          )}
        </div>
      </div>

      <div className="reportCard">
        <div className="reportTitle">
          <span>🔑</span>
          <h3>Missing Keywords</h3>
        </div>
        <div className="tags missing">
          {result.missing_keywords?.map((item, index) => (
            <span key={index}>{item}</span>
          ))}
        </div>
      </div>

      <div className="reportCard wide">
        <div className="reportTitle">
          <span>📄</span>
          <h3>Improved CV Summary</h3>
        </div>
        <p>{feedback.improved_cv_summary}</p>
      </div>

      <div className="reportCard wide">
        <div className="reportTitle">
          <span>📝</span>
          <h3>Suggested CV Bullet Points</h3>
        </div>
        <ul>
          {feedback.suggested_cv_bullets?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default CvAgentPanel;
