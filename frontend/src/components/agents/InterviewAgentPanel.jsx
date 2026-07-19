import { useEffect, useState } from "react";
import { generateInterviewQuestions, evaluateInterviewAnswer } from "../../api";
import { getScoreStatus, getScoreIcon } from "../../utils";

function InterviewAgentPanel({ targetRole, cvText, jobDescription }) {
  const [questions, setQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");
  const [answers, setAnswers] = useState({});

  const loadQuestions = () => {
    setQuestionsLoading(true);
    setQuestionsError("");
    setAnswers({});
    generateInterviewQuestions({
      target_role: targetRole,
      cv_text: cvText,
      job_description: jobDescription,
    })
      .then((data) => setQuestions(data.questions || []))
      .catch((err) => setQuestionsError(err.message))
      .finally(() => setQuestionsLoading(false));
  };

  useEffect(() => {
    loadQuestions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setAnswerText = (id, text) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], text, evaluation: null, error: "" },
    }));
  };

  const submitAnswer = (question) => {
    const current = answers[question.id] || {};
    const answerText = (current.text || "").trim();

    if (!answerText) {
      setAnswers((prev) => ({
        ...prev,
        [question.id]: { ...current, error: "Write an answer before submitting." },
      }));
      return;
    }

    setAnswers((prev) => ({
      ...prev,
      [question.id]: { ...current, evaluating: true, error: "" },
    }));

    evaluateInterviewAnswer({
      target_role: targetRole,
      question: question.question,
      question_type: question.type,
      answer: answerText,
      job_description: jobDescription,
    })
      .then((data) => {
        setAnswers((prev) => ({
          ...prev,
          [question.id]: { ...prev[question.id], evaluating: false, evaluation: data },
        }));
      })
      .catch((err) => {
        setAnswers((prev) => ({
          ...prev,
          [question.id]: { ...prev[question.id], evaluating: false, error: err.message },
        }));
      });
  };

  if (questionsLoading) {
    return <div className="agentLoading">Preparing your mock interview...</div>;
  }

  if (questionsError) {
    return (
      <div className="errorBox">
        {questionsError}
        <button className="miniCopyBtn" onClick={loadQuestions}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="interviewList">
      <div className="reportTitle withAction">
        <div className="titleLeft">
          <span>🎤</span>
          <h3>Mock Interview</h3>
        </div>
        <button className="miniCopyBtn" onClick={loadQuestions}>
          New Questions
        </button>
      </div>

      {questions.map((question) => {
        const state = answers[question.id] || {};

        return (
          <div key={question.id} className="reportCard wide interviewCard">
            <div className="reportTitle">
              <span>{question.type === "technical" ? "🛠️" : "🗣️"}</span>
              <h3>{question.question}</h3>
            </div>

            <textarea
              className="jobInput"
              placeholder="Type your answer here..."
              value={state.text || ""}
              onChange={(e) => setAnswerText(question.id, e.target.value)}
            ></textarea>

            {state.error && <div className="errorBox">{state.error}</div>}

            <button
              className="analyzeBtn"
              onClick={() => submitAnswer(question)}
              disabled={state.evaluating}
            >
              {state.evaluating ? "Evaluating..." : "Submit Answer"}
            </button>

            {state.evaluation && (
              <div className="interviewFeedback">
                <div className={`scoreBox ${getScoreStatus(state.evaluation.score)}`}>
                  <div className="scoreTop">
                    <div className="scoreIcon">{getScoreIcon(state.evaluation.score)}</div>
                    <h3>Answer Score</h3>
                  </div>
                  <strong>{state.evaluation.score}%</strong>
                </div>

                <div className="reportCard">
                  <div className="reportTitle">
                    <span>✅</span>
                    <h3>What Was Good</h3>
                  </div>
                  <ul>
                    {state.evaluation.ai_feedback?.what_was_good?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="reportCard">
                  <div className="reportTitle">
                    <span>⚠️</span>
                    <h3>What to Improve</h3>
                  </div>
                  <ul>
                    {state.evaluation.ai_feedback?.what_to_improve?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="reportCard wide">
                  <div className="reportTitle">
                    <span>✨</span>
                    <h3>Stronger Sample Answer</h3>
                  </div>
                  <p>{state.evaluation.ai_feedback?.sample_answer}</p>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default InterviewAgentPanel;
