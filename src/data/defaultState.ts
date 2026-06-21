import { AppState } from "../storage";
import { monthKey } from "../utils/date";

export const defaultState: AppState = {
  profile: {
    name: "",
    goals: [],
    isOnboarded: false
  },
  settings: {
    aiApiKey: "",
    aiModel: "gpt-5-nano",
    monthlyBudgetUsd: 5,
    estimatedMonthlySpendUsd: 0,
    currentSpendMonth: monthKey(),
    notificationTime: "08:00",
    notificationsEnabled: false
  },
  journal: [],
  coach: []
};
