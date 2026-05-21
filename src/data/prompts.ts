export const dailyPrompts = [
  "What is one small action that would make today meaningful?",
  "What habit do I want to strengthen today?",
  "What am I avoiding that deserves my attention?",
  "Where can I choose patience instead of pressure today?",
  "What would a focused version of me do in the next hour?",
  "What is one promise to myself I can keep today?",
  "What conversation, task, or decision needs more courage from me?",
  "What is one thing I can remove today to protect my energy?",
  "How do I want to feel at the end of today, and what would support that?",
  "What is the simplest next step toward the person I am becoming?"
];

export function promptForDate(date = new Date()) {
  const dayNumber = Math.floor(date.getTime() / 86400000);
  return dailyPrompts[dayNumber % dailyPrompts.length];
}
