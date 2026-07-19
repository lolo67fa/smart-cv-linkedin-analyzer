function Hero({ onGetStarted }) {
  return (
    <section className="hero">
      <div className="heroText">
        <div className="badge">AI-Powered Career Growth</div>

        <h1>
          Your AI Career <br />
          Agent for <span>Every Step</span>
        </h1>

        <p>
          Five specialized AI agents — CV, LinkedIn, Career Coach, Learning,
          and Interview — working together to get you hired. No account
          needed, just upload and go.
        </p>

        <button className="startBtn" onClick={onGetStarted}>
          Let’s Get Started <span>→</span>
        </button>

        <p className="smallText">
          Built for students, fresh graduates, and job seekers.
        </p>
      </div>

      <div className="heroVisual">
        <div className="profileCard">
          <h3>Your Profile Overview</h3>

          <div className="scoreCircle">
            <strong>86</strong>
            <span>Overall Score</span>
          </div>

          <div className="scoreItem">
            <p>CV Score</p>
            <div className="bar">
              <div style={{ width: "85%" }}></div>
            </div>
            <span>85/100</span>
          </div>

          <div className="scoreItem">
            <p>LinkedIn Score</p>
            <div className="bar">
              <div style={{ width: "87%" }}></div>
            </div>
            <span>87/100</span>
          </div>

          <div className="scoreItem">
            <p>Keyword Match</p>
            <div className="bar">
              <div style={{ width: "78%" }}></div>
            </div>
            <span>78/100</span>
          </div>
        </div>

        <div className="aiCard">
          <div className="aiIcon">✦</div>
          <h4>AI Agents</h4>
          <p>CV, LinkedIn, Coach, Learning &amp; Interview — all in one place.</p>
        </div>
      </div>
    </section>
  );
}

export default Hero;
