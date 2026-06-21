export type GrowthGoal =
  | "Discipline"
  | "Focus"
  | "Confidence"
  | "Emotional control"
  | "Communication"
  | "Productivity"
  | "Health habits"
  | "Spiritual growth";

export type JournalEntry = {
  id: string;
  prompt: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
  lessonId?: string;
};

export type Lesson = {
  id: string;
  title: string;
  theme: GrowthGoal | "General";
  body: string[];
  keyIdea: string;
  actionStep: string;
};

export type BookSummary = {
  id: string;
  title: string;
  author: string;
  year: string;
  goals: GrowthGoal[];
  bestFor: string;
  reference: string;
  summary: string[];
  keyIdeas: string[];
  actionSteps: string[];
  reflectionPrompt: string;
};

export type HackathonEvent = {
  id: string;
  title: string;
  location: string;
  url: string;
  timeLeft: string;
  dates: string;
  source: string;
  themes: string[];
  isOnline: boolean;
  isPakistanMatch: boolean;
};

export type CoachMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};
