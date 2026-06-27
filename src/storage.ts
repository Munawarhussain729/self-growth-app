import AsyncStorage from "@react-native-async-storage/async-storage";
import { BookAnswer, BookNote, CoachMessage, GrowthGoal, JournalEntry } from "./types";

const STORAGE_KEY = "growth-compass-state-v1";

export type AppState = {
  profile: {
    name: string;
    goals: GrowthGoal[];
    isOnboarded: boolean;
  };
  settings: {
    aiApiKey: string;
    aiModel: string;
    monthlyBudgetUsd: number;
    estimatedMonthlySpendUsd: number;
    currentSpendMonth: string;
    notificationTime: string;
    notificationsEnabled: boolean;
  };
  journal: JournalEntry[];
  coach: CoachMessage[];
  bookAnswers: BookAnswer[];
  bookNotes: BookNote[];
};

export async function loadAppState(): Promise<AppState | null> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AppState;
  } catch {
    return null;
  }
}

export async function saveAppState(state: AppState) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export async function clearAppState() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

// Book Answer CRUD functions
export function addBookAnswer(
  state: AppState,
  answer: Omit<BookAnswer, "id" | "createdAt" | "updatedAt">,
): AppState {
  const newAnswer: BookAnswer = {
    ...answer,
    id: `answer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return {
    ...state,
    bookAnswers: [...state.bookAnswers, newAnswer],
  };
}

export function updateBookAnswer(
  state: AppState,
  answerId: string,
  updatedAnswer: string,
): AppState {
  return {
    ...state,
    bookAnswers: state.bookAnswers.map((answer) =>
      answer.id === answerId
        ? { ...answer, answer: updatedAnswer, updatedAt: new Date().toISOString() }
        : answer,
    ),
  };
}

export function getBookAnswer(state: AppState, bookId: string): BookAnswer | null {
  return state.bookAnswers.find((answer) => answer.bookId === bookId) || null;
}

// Book Note CRUD functions
export function addBookNote(
  state: AppState,
  note: Omit<BookNote, "id" | "createdAt" | "updatedAt">,
): AppState {
  const newNote: BookNote = {
    ...note,
    id: `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return {
    ...state,
    bookNotes: [...state.bookNotes, newNote],
  };
}

export function updateBookNote(
  state: AppState,
  noteId: string,
  updatedContent: string,
): AppState {
  return {
    ...state,
    bookNotes: state.bookNotes.map((note) =>
      note.id === noteId
        ? { ...note, content: updatedContent, updatedAt: new Date().toISOString() }
        : note,
    ),
  };
}

export function deleteBookNote(state: AppState, noteId: string): AppState {
  return {
    ...state,
    bookNotes: state.bookNotes.filter((note) => note.id !== noteId),
  };
}

export function getBookNotes(state: AppState, bookId: string): BookNote[] {
  return state.bookNotes.filter((note) => note.bookId === bookId);
}

// AI Export utilities
export function getBookContent(state: AppState, bookId: string) {
  const answer = getBookAnswer(state, bookId);
  const notes = getBookNotes(state, bookId);
  return {
    answer,
    notes,
  };
}

export function exportForAI(state: AppState) {
  return {
    profile: {
      name: state.profile.name,
      goals: state.profile.goals,
    },
    bookAnswers: state.bookAnswers,
    bookNotes: state.bookNotes,
    journal: state.journal,
    coach: state.coach,
    exportedAt: new Date().toISOString(),
  };
}
