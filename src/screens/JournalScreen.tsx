import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { AppState } from "../storage";
import { colors, spacing } from "../theme";
import { JournalEntry } from "../types";
import { friendlyDate } from "../utils/date";

export function JournalScreen({ state, updateState }: { state: AppState; updateState: (state: AppState) => void }) {
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<JournalEntry | null>(null);
  const [draft, setDraft] = useState("");

  const entries = useMemo(() => {
    const lower = query.toLowerCase();
    return state.journal.filter((entry) => {
      return !lower || entry.answer.toLowerCase().includes(lower) || entry.prompt.toLowerCase().includes(lower);
    });
  }, [query, state.journal]);

  const startEdit = (entry: JournalEntry) => {
    setEditing(entry);
    setDraft(entry.answer);
  };

  const saveEdit = () => {
    if (!editing) return;
    updateState({
      ...state,
      journal: state.journal.map((entry) =>
        entry.id === editing.id ? { ...entry, answer: draft.trim(), updatedAt: new Date().toISOString() } : entry
      )
    });
    setEditing(null);
    setDraft("");
  };

  const remove = (entry: JournalEntry) => {
    Alert.alert("Delete entry?", "This reflection will be removed from your device.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => updateState({ ...state, journal: state.journal.filter((item) => item.id !== entry.id) })
      }
    ]);
  };

  return (
    <View>
      <Header eyebrow="Journal" title="Your saved reflections." subtitle={`${state.journal.length} entries stored locally.`} />
      <Field value={query} onChangeText={setQuery} placeholder="Search your entries..." />
      {editing ? (
        <Card style={styles.editor}>
          <Text style={styles.cardTitle}>Edit reflection</Text>
          <Field value={draft} onChangeText={setDraft} multiline style={styles.editField} />
          <View style={styles.row}>
            <Button label="Cancel" variant="secondary" style={styles.rowButton} onPress={() => setEditing(null)} />
            <Button label="Save" style={styles.rowButton} onPress={saveEdit} disabled={!draft.trim()} />
          </View>
        </Card>
      ) : null}
      <View style={styles.list}>
        {entries.map((entry) => (
          <Card key={entry.id} style={styles.entry}>
            <Text style={styles.date}>{friendlyDate(entry.createdAt)}</Text>
            <Text style={styles.prompt}>{entry.prompt}</Text>
            <Text style={styles.answer}>{entry.answer}</Text>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => startEdit(entry)}>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => remove(entry)}>
                <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </Card>
        ))}
        {!entries.length ? <Text style={styles.empty}>No reflections found yet.</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: spacing.md, marginTop: spacing.md },
  entry: { gap: spacing.sm },
  date: { color: colors.gold, fontSize: 12, fontWeight: "800" },
  prompt: { color: colors.ink, fontWeight: "800", fontSize: 16, lineHeight: 22 },
  answer: { color: colors.muted, lineHeight: 22 },
  actions: { flexDirection: "row", gap: spacing.lg },
  actionText: { color: colors.accent, fontWeight: "800" },
  deleteText: { color: colors.danger },
  empty: { textAlign: "center", color: colors.muted, marginTop: spacing.xl },
  editor: { gap: spacing.md, marginTop: spacing.md },
  cardTitle: { color: colors.ink, fontSize: 18, fontWeight: "800" },
  editField: { minHeight: 130 },
  row: { flexDirection: "row", gap: spacing.sm },
  rowButton: { flex: 1 }
});
