import { useEffect, useState } from "react";
import { runCvAgent, runLinkedInAgent } from "../api";
import CvAgentPanel from "./agents/CvAgentPanel";
import LinkedInAgentPanel from "./agents/LinkedInAgentPanel";
import CareerCoachPanel from "./agents/CareerCoachPanel";
import LearningAgentPanel from "./agents/LearningAgentPanel";
import InterviewAgentPanel from "./agents/InterviewAgentPanel";

const TABS = [
  { id: "cv", label: "CV Agent", icon: "📄" },
  { id: "linkedin", label: "LinkedIn Agent", icon: "💼" },
  { id: "coach", label: "Career Coach", icon: "🧭" },
  { id: "learning", label: "Learning Agent", icon: "📚" },
  { id: "interview", label: "Interview Agent", icon: "🎤" },
];

function AgentWorkspace({
  cvText,
  targetRole,
  jobDescription,
  certificates,
  experience,
  linkedinText,
  intakeScores,
  intakeMissingKeywords,
}) {
  const [activeTab, setActiveTab] = useState("cv");

  const [cvResult, setCvResult] = useState(null);
  const [cvLoading, setCvLoading] = useState(true);
  const [cvError, setCvError] = useState("");

  const [linkedinResult, setLinkedinResult] = useState(null);
  const [linkedinLoading, setLinkedinLoading] = useState(true);
  const [linkedinError, setLinkedinError] = useState("");

  const [coachResult, setCoachResult] = useState(null);
  const [learningResult, setLearningResult] = useState(null);

  const loadCvAgent = () => {
    setCvLoading(true);
    setCvError("");
    runCvAgent({
      cv_text: cvText,
      linkedin_text: linkedinText,
      target_role: targetRole,
      job_description: jobDescription,
      certificates,
      experience,
    })
      .then(setCvResult)
      .catch((err) => setCvError(err.message))
      .finally(() => setCvLoading(false));
  };

  const loadLinkedInAgent = () => {
    setLinkedinLoading(true);
    setLinkedinError("");
    runLinkedInAgent({
      linkedin_text: linkedinText,
      target_role: targetRole,
      cv_text: cvText,
      certificates,
      experience,
    })
      .then(setLinkedinResult)
      .catch((err) => setLinkedinError(err.message))
      .finally(() => setLinkedinLoading(false));
  };

  useEffect(() => {
    loadCvAgent();
    loadLinkedInAgent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const missingKeywords =
    cvResult?.ai_feedback?.recommended_keywords || intakeMissingKeywords || [];

  return (
    <section className="agentWorkspace" id="agents">
      <div className="sectionHeader">
        <span>Your AI Agents</span>
        <h2>Work With Your Career Agents</h2>
        <p>Switch tabs to get detailed feedback from each specialized agent.</p>
      </div>

      <div className="agentTabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`agentTab ${activeTab === tab.id ? "active" : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      <div className="agentPanel">
        {activeTab === "cv" && (
          <CvAgentPanel
            result={cvResult}
            loading={cvLoading}
            error={cvError}
            onRegenerate={loadCvAgent}
          />
        )}

        {activeTab === "linkedin" && (
          <LinkedInAgentPanel
            result={linkedinResult}
            loading={linkedinLoading}
            error={linkedinError}
            onRegenerate={loadLinkedInAgent}
          />
        )}

        {activeTab === "coach" && (
          <CareerCoachPanel
            cvText={cvText}
            targetRole={targetRole}
            jobDescription={jobDescription}
            certificates={certificates}
            experience={experience}
            cvScore={cvResult?.cv_score ?? intakeScores?.cv_score}
            linkedinScore={linkedinResult?.linkedin_score ?? intakeScores?.linkedin_score}
            missingKeywords={missingKeywords}
            cachedResult={coachResult}
            onResult={setCoachResult}
          />
        )}

        {activeTab === "learning" && (
          <LearningAgentPanel
            targetRole={targetRole}
            cvText={cvText}
            experience={experience}
            missingKeywords={missingKeywords}
            cachedResult={learningResult}
            onResult={setLearningResult}
          />
        )}

        {activeTab === "interview" && (
          <InterviewAgentPanel
            targetRole={targetRole}
            cvText={cvText}
            jobDescription={jobDescription}
          />
        )}
      </div>
    </section>
  );
}

export default AgentWorkspace;
