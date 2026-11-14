import { addEstimatedSpend, canSpend, resetSpendIfNewMonth } from "../src/services/ai";
import { defaultState } from "../src/data/defaultState";
import { monthKey } from "../src/utils/date";

function stateWith(settings: Partial<typeof defaultState.settings>) {
  return { ...defaultState, settings: { ...defaultState.settings, ...settings } };
}

describe("AI spend budget", () => {
  test("allows spending while under the monthly budget", () => {
    const state = stateWith({
      currentSpendMonth: monthKey(),
      estimatedMonthlySpendUsd: 0.5,
      monthlyBudgetUsd: 1,
    });
    expect(canSpend(state)).toBe(true);
  });

  test("blocks spending once the budget is reached", () => {
    const state = stateWith({
      currentSpendMonth: monthKey(),
      estimatedMonthlySpendUsd: 1,
      monthlyBudgetUsd: 1,
    });
    expect(canSpend(state)).toBe(false);
  });

  test("resets the running total when the month changes", () => {
    const state = stateWith({
      currentSpendMonth: "2000-01",
      estimatedMonthlySpendUsd: 99,
      monthlyBudgetUsd: 1,
    });
    const fresh = resetSpendIfNewMonth(state);
    expect(fresh.settings.estimatedMonthlySpendUsd).toBe(0);
    expect(fresh.settings.currentSpendMonth).toBe(monthKey());
    expect(canSpend(state)).toBe(true);
  });

  test("accumulates estimated spend", () => {
    const state = stateWith({
      currentSpendMonth: monthKey(),
      estimatedMonthlySpendUsd: 0.1,
    });
    const next = addEstimatedSpend(addEstimatedSpend(state, 0.02), 0.03);
    expect(next.settings.estimatedMonthlySpendUsd).toBeCloseTo(0.15, 5);
  });
});
