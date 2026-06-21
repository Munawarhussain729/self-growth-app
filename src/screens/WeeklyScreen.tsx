import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Header } from "../components/Header";
import { addEstimatedSpend, summarizeWeek } from "../services/ai";
import { AppState } from "../storage";
import { colors, spacing } from "../theme";
import { isWithinLastDays } from "../utils/date";

function templateReview(entryCount: number) {
  return [
    "Main themes\nLook for the ideas that keep repeating in your entries. Repetition is a signal, not a failure.",
    "Wins\nName at least one moment where you kept a promise, returned to focus, or acted with courage.",
    "Recurring struggles\nChoose one pattern that deserves support rather than self-criticism.",
    `Focus for next week\nPick one small practice for the next seven days. You have ${entryCount} recent entries to learn from.`
  ].join("\n\n");
}

export function WeeklyScreen({ state, updateState }: { state: AppState; updateState: (state: AppState) => void }) {
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const entries = useMemo(() => state.journal.filter((entry) => isWithinLastDays(entry.createdAt, 7)), [state.journal]);

  const createAiReview = async () => {
    if (!entries.length) {
      Alert.alert("Weekly review", "Add a few journal entries first.");
      return;
    }
    setLoading(true);
    try {
      const result = await summarizeWeek(state, entries);
      updateState(addEstimatedSpend(state, result.estimatedCostUsd));
      setReview(result.text);
    } catch (error) {
      Alert.alert("Weekly review", error instanceof Error ? error.message : "Could not create an AI review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Header eyebrow="Weekly Review" title="Turn your week into signal." subtitle={`${entries.length} reflections from the last seven days.`} />
      <View style={styles.row}>
        <Button label="Template" variant="secondary" style={styles.rowButton} onPress={() => setReview(templateReview(entries.length))} />
        <Button label={loading ? "Reviewing..." : "AI Review"} style={styles.rowButton} onPress={createAiReview} disabled={loading} />
      </View>
      <Card style={styles.review}>
        <Text style={styles.reviewText}>{review || "Create a weekly review when you are ready."}</Text>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  rowButton: { flex: 1 },
  review: { minHeight: 260 },
  reviewText: { color: colors.ink, fontSize: 16, lineHeight: 24 }
});
