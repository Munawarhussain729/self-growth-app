import React, { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
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
  const streakLabel = savedToday ? "Checked in" : "Open";
  const latestEntry = state.journal[0];

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
      <View style={styles.hero}>
        <View style={styles.heroGlow} />
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.heroEyebrow}>Growth Compass</Text>
            <Text style={styles.heroTitle}>Good {new Date().getHours() < 12 ? "morning" : "day"}, {state.profile.name}.</Text>
          </View>
          <View style={styles.statusPill}>
            <Icon name={savedToday ? "checkmark-circle" : "ellipse-outline"} size={16} color="#FFFFFF" />
            <Text style={styles.statusText}>{streakLabel}</Text>
          </View>
        </View>
        <Text style={styles.heroSubtitle}>One focused idea, one honest reflection, one small action.</Text>
        <View style={styles.metricRow}>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{state.journal.length}</Text>
            <Text style={styles.metricLabel}>Reflections</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{state.profile.goals.length}</Text>
            <Text style={styles.metricLabel}>Goals</Text>
          </View>
          <View style={styles.metric}>
            <Text style={styles.metricValue}>{latestEntry ? "1" : "0"}</Text>
            <Text style={styles.metricLabel}>Latest win</Text>
          </View>
        </View>
      </View>

      <Card style={styles.focusCard}>
        <View style={styles.focusIcon}>
          <Icon name="compass-outline" size={22} color={colors.accent} />
        </View>
        <View style={styles.focusCopy}>
          <Text style={styles.label}>Today’s focus</Text>
          <Text style={styles.focusText}>{lesson.actionStep}</Text>
        </View>
      </Card>

      <Card style={styles.lesson}>
        <View style={styles.sectionTop}>
          <Text style={styles.theme}>{lesson.theme}</Text>
          <Icon name="sparkles-outline" size={18} color={colors.gold} />
        </View>
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
  hero: {
    overflow: "hidden",
    backgroundColor: colors.midnight,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.md,
    shadowColor: colors.midnight,
    shadowOpacity: 0.22,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 8
  },
  heroGlow: {
    position: "absolute",
    right: -42,
    top: -34,
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: "rgba(192, 122, 69, 0.32)"
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: spacing.md
  },
  heroEyebrow: { color: "#D8B981", fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  heroTitle: { color: "#FFFDF8", fontSize: 30, lineHeight: 36, fontWeight: "900", maxWidth: 230 },
  heroSubtitle: { color: "#D9E4DD", fontSize: 15, lineHeight: 22 },
  statusPill: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.sm,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.16)"
  },
  statusText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
  metricRow: { flexDirection: "row", gap: spacing.sm },
  metric: { flex: 1, borderRadius: 16, padding: spacing.sm, backgroundColor: "rgba(255,255,255,0.11)" },
  metricValue: { color: "#FFFFFF", fontSize: 22, fontWeight: "900" },
  metricLabel: { color: "#D9E4DD", fontSize: 11, fontWeight: "700" },
  focusCard: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    marginBottom: spacing.md,
    backgroundColor: "#FFFCF5"
  },
  focusIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSoft
  },
  focusCopy: { flex: 1, gap: 3 },
  focusText: { color: colors.ink, fontSize: 16, lineHeight: 22, fontWeight: "800" },
  lesson: { gap: spacing.sm, marginBottom: spacing.md },
  sectionTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  theme: { color: colors.gold, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  lessonTitle: { color: colors.ink, fontSize: 24, fontWeight: "800" },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  label: { color: colors.ink, fontWeight: "800", fontSize: 13 },
  promptCard: { gap: spacing.md },
  prompt: { color: colors.ink, fontSize: 20, lineHeight: 27, fontWeight: "700" },
  answer: { minHeight: 140 }
});
