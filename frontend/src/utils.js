export function getScoreStatus(score) {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "weak";
}

export function getScoreIcon(score) {
  if (score >= 80) return "✅";
  if (score >= 60) return "🟢";
  if (score >= 40) return "🟡";
  return "🔴";
}
