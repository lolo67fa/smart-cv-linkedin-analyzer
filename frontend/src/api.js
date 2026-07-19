export const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

async function postJson(path, body) {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

export async function fetchRoles() {
  const response = await fetch(`${API_URL}/roles`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Could not load target roles.");
  }
  return data.roles;
}

export async function analyzeProfile(formData) {
  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

export function runCvAgent(payload) {
  return postJson("/agents/cv", payload);
}

export function runLinkedInAgent(payload) {
  return postJson("/agents/linkedin", payload);
}

export function runCoachAgent(payload) {
  return postJson("/agents/coach", payload);
}

export function runLearningAgent(payload) {
  return postJson("/agents/learning", payload);
}

export function generateInterviewQuestions(payload) {
  return postJson("/agents/interview/questions", payload);
}

export function evaluateInterviewAnswer(payload) {
  return postJson("/agents/interview/evaluate", payload);
}
