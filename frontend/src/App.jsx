import { useEffect, useState } from "react";
import "./App.css";
import { fetchRoles, analyzeProfile } from "./api";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import AnalyzerForm from "./components/AnalyzerForm";
import IntakeResults from "./components/IntakeResults";
import AgentWorkspace from "./components/AgentWorkspace";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import CareerValue from "./components/CareerValue";

function App() {
  const [roleCategories, setRoleCategories] = useState([]);

  const [cvFile, setCvFile] = useState(null);
  const [linkedinText, setLinkedinText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [certificates, setCertificates] = useState("");
  const [experience, setExperience] = useState("");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRoles()
      .then(setRoleCategories)
      .catch(() => setRoleCategories([]));
  }, []);

  const goToAnalyzer = () => {
    document.getElementById("analyzer").scrollIntoView({ behavior: "smooth" });
  };

  const handleAnalyze = async () => {
    setError("");
    setResult(null);

    if (!cvFile) {
      setError("Please upload your CV first.");
      return;
    }

    if (!targetRole) {
      setError("Please select a target role.");
      return;
    }

    const formData = new FormData();
    formData.append("cv", cvFile);
    formData.append("linkedin", linkedinText);
    formData.append("target_role", targetRole);
    formData.append("job_description", jobDescription);
    formData.append("certificates", certificates);
    formData.append("experience", experience);

    try {
      setLoading(true);
      const data = await analyzeProfile(formData);
      setResult(data);

      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      setError(err.message || "Could not connect to the backend. Make sure Flask is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <Navbar />
      <Hero onGetStarted={goToAnalyzer} />

      <AnalyzerForm
        cvFile={cvFile}
        setCvFile={setCvFile}
        linkedinText={linkedinText}
        setLinkedinText={setLinkedinText}
        certificates={certificates}
        setCertificates={setCertificates}
        targetRole={targetRole}
        setTargetRole={setTargetRole}
        roleCategories={roleCategories}
        experience={experience}
        setExperience={setExperience}
        jobDescription={jobDescription}
        setJobDescription={setJobDescription}
        onAnalyze={handleAnalyze}
        loading={loading}
        error={error}
      />

      <IntakeResults result={result} />

      {result && (
        <AgentWorkspace
          cvText={result.cv_text}
          targetRole={targetRole}
          jobDescription={jobDescription}
          certificates={certificates}
          experience={experience}
          linkedinText={linkedinText}
          intakeScores={{
            overall_score: result.overall_score,
            cv_score: result.cv_score,
            linkedin_score: result.linkedin_score,
          }}
          intakeMissingKeywords={result.missing_keywords}
        />
      )}

      <Features />
      <HowItWorks />
      <CareerValue />
    </div>
  );
}

export default App;
