function AnalyzerForm({
  cvFile,
  setCvFile,
  linkedinText,
  setLinkedinText,
  certificates,
  setCertificates,
  targetRole,
  setTargetRole,
  roleCategories,
  experience,
  setExperience,
  jobDescription,
  setJobDescription,
  onAnalyze,
  loading,
  error,
}) {
  return (
    <section className="analyzer" id="analyzer">
      <div className="sectionHeader">
        <span>Start Your Analysis</span>
        <h2>Upload Your CV</h2>
        <p>
          Upload your CV, add your LinkedIn About section, and select your
          target role to get instant AI-powered feedback.
        </p>
      </div>

      <div className="analyzerCard">
        <div className="uploadSide">
          <label className="formLabel">
            Upload CV <span className="required">*</span>
          </label>

          <div className="uploadBox">
            <div className="uploadIcon">☁️</div>
            <h3>{cvFile ? cvFile.name : "Drop your CV here or browse"}</h3>
            <p>PDF or DOCX only — Max size 5MB</p>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(e) => setCvFile(e.target.files[0])}
            />
          </div>

          <label className="formLabel">LinkedIn About</label>
          <textarea
            className="linkedinInput"
            placeholder="Paste your LinkedIn About section here..."
            value={linkedinText}
            onChange={(e) => setLinkedinText(e.target.value)}
          ></textarea>

          <label className="formLabel">Certificates</label>
          <textarea
            className="smallTextarea"
            placeholder="Example: SDAIA AI Certificate, Tuwaiq PHP Bootcamp, KAUST AI Course..."
            value={certificates}
            onChange={(e) => setCertificates(e.target.value)}
          ></textarea>
        </div>

        <div className="detailsSide">
          <label className="formLabel">
            Target Role <span className="required">*</span>
          </label>

          <select
            className="selectInput"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          >
            <option value="">Select a target role</option>
            {(roleCategories || []).map((group) => (
              <optgroup key={group.category} label={group.category}>
                {(group.roles || []).map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>

          <label className="formLabel">Experience</label>
          <textarea
            className="smallTextarea"
            placeholder="Write your internship, projects, training, or work experience..."
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
          ></textarea>

          <label className="formLabel">Job Description Optional</label>
          <textarea
            className="jobInput"
            placeholder="Paste the job description here if you have one..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          ></textarea>

          <button className="analyzeBtn" onClick={onAnalyze} disabled={loading}>
            {loading ? "Analyzing..." : "Analyze Profile ✦"}
          </button>

          {error && <div className="errorBox">{error}</div>}

          <div className="privacyNote">
            🔒 No account required. Your CV is analyzed instantly and is not
            saved after the session.
          </div>
        </div>
      </div>
    </section>
  );
}

export default AnalyzerForm;
