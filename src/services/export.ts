import { AppState } from "../storage";

export function exportPlainText(state: AppState) {
  return state.journal
    .map((entry) => {
      return [`Date: ${entry.createdAt}`, `Prompt: ${entry.prompt}`, "Answer:", entry.answer].join("\n");
    })
    .join("\n\n---\n\n");
}

export function exportJson(state: AppState) {
  return JSON.stringify(
    {
      profile: state.profile,
      journal: state.journal
    },
    null,
    2
  );
}
