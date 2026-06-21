import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { addEstimatedSpend, askCoach } from "../services/ai";
import { AppState } from "../storage";
import { colors, spacing } from "../theme";

export function CoachScreen({ state, updateState }: { state: AppState; updateState: (state: AppState) => void }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const result = await askCoach(state, trimmed);
      if (!result.text.trim()) {
        Alert.alert("Coach", "The AI replied, but the message was empty. Try again with a shorter question.");
        return;
      }
      const now = new Date().toISOString();
      const withSpend = addEstimatedSpend(state, result.estimatedCostUsd);
      updateState({
        ...withSpend,
        coach: [
          { id: `${Date.now()}-a`, role: "assistant", content: result.text, createdAt: now },
          { id: `${Date.now()}-u`, role: "user", content: trimmed, createdAt: now },
          ...withSpend.coach
        ]
      });
      setQuestion("");
    } catch (error) {
      Alert.alert("Coach", error instanceof Error ? error.message : "Could not reach the AI coach.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <View style={styles.coachHero}>
        <View style={styles.coachIcon}>
          <Icon name="sparkles-outline" size={25} color={colors.accent} />
        </View>
        <View style={styles.coachHeroCopy}>
          <Text style={styles.heroEyebrow}>AI Coach</Text>
          <Text style={styles.heroTitle}>Ask for a useful next step.</Text>
          <Text style={styles.heroSubtitle}>
            {state.settings.aiApiKey
              ? `${state.settings.aiModel} · $${state.settings.estimatedMonthlySpendUsd.toFixed(3)} / $${state.settings.monthlyBudgetUsd}`
              : "Add an API key in Settings to enable coaching."}
          </Text>
        </View>
      </View>
      <Card style={styles.ask}>
        <Field value={question} onChangeText={setQuestion} multiline style={styles.question} placeholder="What are you working through?" />
        <Button label={loading ? "Thinking..." : "Ask Coach"} onPress={send} disabled={loading || !question.trim()} />
      </Card>
      <View style={styles.messages}>
        {state.coach.map((message) => (
          <View key={message.id} style={[styles.bubble, message.role === "user" ? styles.userBubble : styles.coachBubble]}>
            <Text style={styles.role}>{message.role === "user" ? "You" : "Coach"}</Text>
            <Text style={styles.content}>{message.content}</Text>
          </View>
        ))}
        {!state.coach.length ? <Text style={styles.empty}>When you ask something, your coaching thread will appear here.</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coachHero: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
    backgroundColor: colors.midnight,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.midnight,
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 7
  },
  coachIcon: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5EAD8"
  },
  coachHeroCopy: { flex: 1, gap: 3 },
  heroEyebrow: { color: "#D8B981", fontSize: 12, fontWeight: "900", textTransform: "uppercase" },
  heroTitle: { color: "#FFFDF8", fontSize: 25, lineHeight: 30, fontWeight: "900" },
  heroSubtitle: { color: "#D9E4DD", fontSize: 13, lineHeight: 19 },
  ask: { gap: spacing.md },
  question: { minHeight: 120 },
  messages: { gap: spacing.md, marginTop: spacing.md },
  bubble: {
    maxWidth: "92%",
    gap: spacing.xs,
    borderRadius: 18,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border
  },
  coachBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.panel
  },
  userBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.accentSoft
  },
  role: { color: colors.gold, fontWeight: "800", fontSize: 12, textTransform: "uppercase" },
  content: { color: colors.ink, fontSize: 15, lineHeight: 22 },
  empty: { color: colors.muted, textAlign: "center", marginTop: spacing.xl }
});
