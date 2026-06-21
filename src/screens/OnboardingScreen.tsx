import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Button";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { AppState } from "../storage";
import { colors, radius, spacing } from "../theme";
import { GrowthGoal } from "../types";

const goals: GrowthGoal[] = [
  "Discipline",
  "Focus",
  "Confidence",
  "Emotional control",
  "Communication",
  "Productivity",
  "Health habits",
  "Spiritual growth"
];

export function OnboardingScreen({ state, updateState }: { state: AppState; updateState: (state: AppState) => void }) {
  const [name, setName] = useState(state.profile.name);
  const [selectedGoals, setSelectedGoals] = useState<GrowthGoal[]>(state.profile.goals);

  const toggleGoal = (goal: GrowthGoal) => {
    setSelectedGoals((current) =>
      current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]
    );
  };

  const complete = () => {
    updateState({
      ...state,
      profile: {
        name: name.trim() || "Friend",
        goals: selectedGoals.length ? selectedGoals : ["Discipline", "Focus"],
        isOnboarded: true
      }
    });
  };

  return (
    <View style={styles.wrap}>
      <Header
        eyebrow="Growth Compass"
        title="Build your private daily practice."
        subtitle="Choose the areas you want the app to gently keep in view."
      />
      <Field label="Name" value={name} onChangeText={setName} placeholder="What should the app call you?" />
      <View style={styles.goalGrid}>
        {goals.map((goal) => {
          const selected = selectedGoals.includes(goal);
          return (
            <TouchableOpacity key={goal} style={[styles.goal, selected && styles.goalSelected]} onPress={() => toggleGoal(goal)}>
              <Text style={[styles.goalText, selected && styles.goalTextSelected]}>{goal}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Button label="Start" onPress={complete} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    gap: spacing.lg
  },
  goalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm
  },
  goal: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  goalSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent
  },
  goalText: {
    color: colors.ink,
    fontWeight: "700"
  },
  goalTextSelected: {
    color: "#FFFFFF"
  }
});
