import AsyncStorage from "@react-native-async-storage/async-storage";
import { CoachMessage, GrowthGoal, JournalEntry } from "./types";

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
