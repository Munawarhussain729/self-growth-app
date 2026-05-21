import React, { useState } from "react";
import { Alert, StyleSheet, Switch, Text, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { exportJson, exportPlainText } from "../services/export";
import { AppState, clearAppState } from "../storage";
import { colors, spacing } from "../theme";

export function SettingsScreen({ state, updateState }: { state: AppState; updateState: (state: AppState) => void }) {
  const [name, setName] = useState(state.profile.name);
  const [apiKey, setApiKey] = useState(state.settings.aiApiKey);
  const [model, setModel] = useState(state.settings.aiModel);
  const [budget, setBudget] = useState(String(state.settings.monthlyBudgetUsd));
  const [time, setTime] = useState(state.settings.notificationTime);
  const [exportText, setExportText] = useState("");

  const save = () => {
    updateState({
      ...state,
      profile: { ...state.profile, name: name.trim() || state.profile.name },
      settings: {
        ...state.settings,
        aiApiKey: apiKey.trim(),
        aiModel: model.trim() || "gpt-5-nano",
        monthlyBudgetUsd: Number(budget) || 5,
        notificationTime: time.trim() || "08:00"
      }
    });
    Alert.alert("Settings", "Saved.");
  };

  const wipe = () => {
    Alert.alert("Clear all data?", "This removes local settings, journal entries, and coach history.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: async () => {
          await clearAppState();
          updateState({ ...state, profile: { name: "", goals: [], isOnboarded: false }, journal: [], coach: [] });
        }
      }
    ]);
  };

  return (
    <View>
      <Header eyebrow="Settings" title="Keep the app personal." subtitle="Your data stays local unless you use AI." />
      <Card style={styles.card}>
        <Field label="Name" value={name} onChangeText={setName} />
        <Field label="AI API key" value={apiKey} onChangeText={setApiKey} secureTextEntry placeholder="Optional" />
        <Field label="AI model" value={model} onChangeText={setModel} placeholder="gpt-5-nano" />
        <Field label="Monthly AI budget" value={budget} onChangeText={setBudget} keyboardType="decimal-pad" />
        <Text style={styles.caption}>Estimated spend this month: ${state.settings.estimatedMonthlySpendUsd.toFixed(3)}</Text>
        <Field label="Notification time" value={time} onChangeText={setTime} placeholder="08:00" />
        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchTitle}>Daily reminder</Text>
            <Text style={styles.caption}>Saved here for later. Real reminders need a development build.</Text>
          </View>
          <Switch
            value={state.settings.notificationsEnabled}
            onValueChange={(value) =>
              updateState({ ...state, settings: { ...state.settings, notificationsEnabled: value } })
            }
          />
        </View>
        <Button label="Save Settings" onPress={save} />
      </Card>
      <Card style={styles.card}>
        <Text style={styles.cardTitle}>Export</Text>
        <View style={styles.row}>
          <Button label="Plain Text" variant="secondary" style={styles.rowButton} onPress={() => setExportText(exportPlainText(state))} />
          <Button label="JSON" variant="secondary" style={styles.rowButton} onPress={() => setExportText(exportJson(state))} />
        </View>
        {exportText ? <Text style={styles.exportBox}>{exportText}</Text> : null}
      </Card>
      <Button label="Clear All Local Data" variant="danger" onPress={wipe} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, marginBottom: spacing.md },
  caption: { color: colors.muted, fontSize: 13, lineHeight: 19 },
  switchRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  switchTitle: { color: colors.ink, fontWeight: "800", fontSize: 16 },
  cardTitle: { color: colors.ink, fontWeight: "800", fontSize: 18 },
  row: { flexDirection: "row", gap: spacing.sm },
  rowButton: { flex: 1 },
  exportBox: {
    color: colors.ink,
    backgroundColor: "#F7F1E8",
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    lineHeight: 20
  }
});
