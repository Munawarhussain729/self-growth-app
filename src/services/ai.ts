import { AppState } from "../storage";
import { JournalEntry } from "../types";
import { monthKey } from "../utils/date";

const INPUT_PRICE_PER_MILLION: Record<string, number> = {
  "gpt-5-nano": 0.05,
  "gpt-5-mini": 0.25
};

const OUTPUT_PRICE_PER_MILLION: Record<string, number> = {
  "gpt-5-nano": 0.4,
  "gpt-5-mini": 2
};

type AiResult = {
  text: string;
  estimatedCostUsd: number;
};

function estimateTokens(text: string) {
  return Math.max(1, Math.ceil(text.length / 4));
}

function extractResponseText(json: any) {
  if (typeof json.output_text === "string" && json.output_text.trim()) {
    return json.output_text.trim();
  }

  const parts: string[] = [];
  const output = Array.isArray(json.output) ? json.output : [];

  for (const item of output) {
    if (typeof item?.text === "string") parts.push(item.text);
    if (typeof item?.content === "string") parts.push(item.content);

    const content = Array.isArray(item?.content) ? item.content : [];
    for (const contentItem of content) {
      if (typeof contentItem === "string") parts.push(contentItem);
      if (typeof contentItem?.text === "string") parts.push(contentItem.text);
      if (typeof contentItem?.content === "string") parts.push(contentItem.content);
      if (typeof contentItem?.output_text === "string") parts.push(contentItem.output_text);
    }
  }

  const choiceText = json.choices?.[0]?.message?.content;
  if (typeof choiceText === "string") parts.push(choiceText);

  return parts.join("\n").trim();
}

export function resetSpendIfNewMonth(state: AppState): AppState {
  const current = monthKey();
  if (state.settings.currentSpendMonth === current) return state;
  return {
    ...state,
    settings: {
      ...state.settings,
      currentSpendMonth: current,
      estimatedMonthlySpendUsd: 0
    }
  };
}

export function canSpend(state: AppState) {
  const fresh = resetSpendIfNewMonth(state);
  return fresh.settings.estimatedMonthlySpendUsd < fresh.settings.monthlyBudgetUsd;
}

export function addEstimatedSpend(state: AppState, amount: number): AppState {
  const fresh = resetSpendIfNewMonth(state);
  return {
    ...fresh,
    settings: {
      ...fresh.settings,
      estimatedMonthlySpendUsd: Number((fresh.settings.estimatedMonthlySpendUsd + amount).toFixed(5))
    }
  };
}

async function callOpenAi(apiKey: string, model: string, instructions: string, input: string): Promise<AiResult> {
  const isGpt5Family = model.startsWith("gpt-5");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      instructions,
      input,
      max_output_tokens: 2500,
      ...(isGpt5Family ? { reasoning: { effort: "minimal" } } : {}),
      text: { verbosity: "low" }
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || "AI request failed.");
  }

  const json = await response.json();
  const text = extractResponseText(json);

  if (!text) {
    const incompleteReason = json.incomplete_details?.reason;
    const status = json.status ? ` Status: ${json.status}.` : "";
    const reason = incompleteReason ? ` Reason: ${incompleteReason}.` : "";
    throw new Error(`The AI returned an empty message.${status}${reason} Try again, or switch the model to gpt-5-mini.`);
  }

  const inputTokens = json.usage?.input_tokens ?? estimateTokens(`${instructions}\n${input}`);
  const outputTokens = json.usage?.output_tokens ?? estimateTokens(text);
  const inputCost = (inputTokens / 1_000_000) * (INPUT_PRICE_PER_MILLION[model] ?? 0.05);
  const outputCost = (outputTokens / 1_000_000) * (OUTPUT_PRICE_PER_MILLION[model] ?? 0.4);

  return {
    text,
    estimatedCostUsd: inputCost + outputCost
  };
}

export async function askCoach(state: AppState, question: string): Promise<AiResult> {
  if (!state.settings.aiApiKey.trim()) {
    throw new Error("Add your API key in Settings first.");
  }
  if (!canSpend(state)) {
    throw new Error("Your monthly AI budget limit has been reached.");
  }

  const recentEntries = state.journal
    .slice(0, 8)
    .map((entry) => `Prompt: ${entry.prompt}\nAnswer: ${entry.answer}`)
    .join("\n\n");

  return callOpenAi(
    state.settings.aiApiKey.trim(),
    state.settings.aiModel,
    "You are a private self-growth coach. Be grounded, concise, kind, and practical. Do not diagnose. Ask one useful follow-up question when helpful.",
    `User name: ${state.profile.name}\nGoals: ${state.profile.goals.join(", ")}\nRecent journal:\n${recentEntries || "No entries yet."}\n\nUser question: ${question}`
  );
}

export async function summarizeWeek(state: AppState, entries: JournalEntry[]): Promise<AiResult> {
  if (!state.settings.aiApiKey.trim()) {
    throw new Error("Add your API key in Settings first.");
  }
  if (!canSpend(state)) {
    throw new Error("Your monthly AI budget limit has been reached.");
  }

  const journalText = entries.map((entry) => `${entry.createdAt}\n${entry.prompt}\n${entry.answer}`).join("\n\n");

  return callOpenAi(
    state.settings.aiApiKey.trim(),
    state.settings.aiModel,
    "You create short weekly self-growth reviews. Use headings: Main themes, Wins, Recurring struggles, Focus for next week. Stay practical and warm.",
    `Name: ${state.profile.name}\nGoals: ${state.profile.goals.join(", ")}\nJournal entries:\n${journalText}`
  );
}
