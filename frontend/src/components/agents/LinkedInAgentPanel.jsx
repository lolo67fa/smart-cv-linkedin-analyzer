import { useState } from "react";
import { getScoreStatus, getScoreIcon } from "../../utils";

function LinkedInAgentPanel({ result, loading, error, onRegenerate }) {
  const [copyMessage, setCopyMessage] = useState("");

  const copyAbout = async () => {
    const text = result?.ai_feedback?.improved_linkedin_about;

    if (!text) {
      setCopyMessage("No LinkedIn About available to copy.");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyMessage("LinkedIn About copied successfully!");
    } catch {
      setCopyMessage("Could not copy the text.");
    }

    setTimeout(() => setCopyMessage(""), 3000);
  };

  if (loading) {
    return <div className="agentLoading">Analyzing your LinkedIn profile...</div>;
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
      <div className={`scoreBox ${getScoreStatus(result.linkedin_score)}`}>
        <div className="scoreTop">
          <div className="scoreIcon">{getScoreIcon(result.linkedin_score)}</div>
          <h3>LinkedIn Score</h3>
        </div>
        <strong>{result.linkedin_score}%</strong>
        <p>LinkedIn About quality</p>
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

      <div className="reportCard wide">
        <div className="reportTitle">
          <span>💼</span>
          <h3>Suggested LinkedIn Headline</h3>
        </div>
        <p>{feedback.suggested_headline}</p>
      </div>

      <div className="reportCard wide">
        <div className="reportTitle withAction">
          <div className="titleLeft">
            <span>✨</span>
            <h3>Improved LinkedIn About</h3>
          </div>
          <button className="miniCopyBtn" onClick={copyAbout}>
            Copy
          </button>
        </div>
        <p>{feedback.improved_linkedin_about}</p>
        {copyMessage && <div className="copyMessage">{copyMessage}</div>}
      </div>
    </div>
  );
}

export default LinkedInAgentPanel;
