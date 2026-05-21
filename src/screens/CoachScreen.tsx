import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
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
      <Header
        eyebrow="AI Coach"
        title="Ask for a useful next step."
        subtitle={
          state.settings.aiApiKey
            ? `Using ${state.settings.aiModel}. Estimated spend: $${state.settings.estimatedMonthlySpendUsd.toFixed(3)} / $${state.settings.monthlyBudgetUsd}.`
            : "Add an API key in Settings to enable coaching."
        }
      />
      <Card style={styles.ask}>
        <Field value={question} onChangeText={setQuestion} multiline style={styles.question} placeholder="What are you working through?" />
        <Button label={loading ? "Thinking..." : "Ask Coach"} onPress={send} disabled={loading || !question.trim()} />
      </Card>
      <View style={styles.messages}>
        {state.coach.map((message) => (
          <Card key={message.id} style={[styles.message, message.role === "user" && styles.userMessage]}>
            <Text style={styles.role}>{message.role === "user" ? "You" : "Coach"}</Text>
            <Text style={styles.content}>{message.content}</Text>
          </Card>
        ))}
        {!state.coach.length ? <Text style={styles.empty}>When you ask something, your coaching thread will appear here.</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ask: { gap: spacing.md },
  question: { minHeight: 120 },
  messages: { gap: spacing.md, marginTop: spacing.md },
  message: { gap: spacing.xs },
  userMessage: { backgroundColor: colors.panelAlt },
  role: { color: colors.gold, fontWeight: "800", fontSize: 12, textTransform: "uppercase" },
  content: { color: colors.ink, fontSize: 15, lineHeight: 22 },
  empty: { color: colors.muted, textAlign: "center", marginTop: spacing.xl }
});
