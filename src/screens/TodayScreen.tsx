import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { lessonForDate } from "../data/lessons";
import { promptForDate } from "../data/prompts";
import { AppState } from "../storage";
import { colors, spacing } from "../theme";
import { todayKey } from "../utils/date";

export function TodayScreen({ state, updateState }: { state: AppState; updateState: (state: AppState) => void }) {
  const lesson = lessonForDate();
  const prompt = promptForDate();
  const existing = state.journal.find((entry) => entry.createdAt.slice(0, 10) === todayKey());
  const [answer, setAnswer] = useState(existing?.answer ?? "");

  const savedToday = useMemo(() => {
    return state.journal.some((entry) => entry.createdAt.slice(0, 10) === todayKey());
  }, [state.journal]);

  const save = () => {
    const now = new Date().toISOString();
    const trimmed = answer.trim();
    if (!trimmed) return;

    if (existing) {
      updateState({
        ...state,
        journal: state.journal.map((entry) =>
          entry.id === existing.id ? { ...entry, answer: trimmed, updatedAt: now } : entry
        )
      });
      return;
    }

    updateState({
      ...state,
      journal: [
        {
          id: `${Date.now()}`,
          prompt,
          answer: trimmed,
          lessonId: lesson.id,
          createdAt: now,
          updatedAt: now
        },
        ...state.journal
      ]
    });
  };

  return (
    <View>
      <Header
        eyebrow="Today"
        title={`Good ${new Date().getHours() < 12 ? "morning" : "day"}, ${state.profile.name}.`}
        subtitle="One clear thought, one small action, no performance required."
      />
      <Card style={styles.lesson}>
        <Text style={styles.theme}>{lesson.theme}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        {lesson.body.map((paragraph) => (
          <Text key={paragraph} style={styles.body}>{paragraph}</Text>
        ))}
        <View style={styles.divider} />
        <Text style={styles.label}>Key idea</Text>
        <Text style={styles.body}>{lesson.keyIdea}</Text>
        <Text style={styles.label}>Action step</Text>
        <Text style={styles.body}>{lesson.actionStep}</Text>
      </Card>
      <Card style={styles.promptCard}>
        <Text style={styles.label}>Reflection prompt</Text>
        <Text style={styles.prompt}>{prompt}</Text>
        <Field value={answer} onChangeText={setAnswer} multiline style={styles.answer} placeholder="Write a few honest lines..." />
        <Button label={savedToday ? "Update Reflection" : "Save Reflection"} onPress={save} disabled={!answer.trim()} />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  lesson: { gap: spacing.sm, marginBottom: spacing.md },
  theme: { color: colors.gold, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  lessonTitle: { color: colors.ink, fontSize: 24, fontWeight: "800" },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  label: { color: colors.ink, fontWeight: "800", fontSize: 13 },
  promptCard: { gap: spacing.md },
  prompt: { color: colors.ink, fontSize: 20, lineHeight: 27, fontWeight: "700" },
  answer: { minHeight: 140 }
});
