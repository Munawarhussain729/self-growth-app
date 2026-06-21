import React, { useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { BooksScreen } from "./src/screens/BooksScreen";
import { CoachScreen } from "./src/screens/CoachScreen";
import { HackathonsScreen } from "./src/screens/HackathonsScreen";
import { JournalScreen } from "./src/screens/JournalScreen";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";
import { TodayScreen } from "./src/screens/TodayScreen";
import { WeeklyScreen } from "./src/screens/WeeklyScreen";
import { defaultState } from "./src/data/defaultState";
import { AppState, loadAppState, saveAppState } from "./src/storage";
import { colors, spacing } from "./src/theme";
import { Icon } from "./src/components/Icon";

type TabKey = "today" | "books" | "hackathons" | "journal" | "coach" | "weekly" | "settings";

const tabs: Array<{ key: TabKey; label: string; icon: string }> = [
  { key: "today", label: "Today", icon: "sunny-outline" },
  { key: "books", label: "Books", icon: "library-outline" },
  { key: "hackathons", label: "Events", icon: "trophy-outline" },
  { key: "journal", label: "Journal", icon: "book-outline" },
  { key: "coach", label: "Coach", icon: "sparkles-outline" },
  { key: "weekly", label: "Review", icon: "analytics-outline" },
  { key: "settings", label: "Settings", icon: "settings-outline" }
];

export default function App() {
  const [state, setState] = useState<AppState | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("today");
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    loadAppState().then((stored) => setState(stored ?? defaultState));
  }, []);

  useEffect(() => {
    if (!state) return;
    saveAppState(state);
  }, [state]);

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const screen = useMemo(() => {
    if (!state) return null;
    const updateState = (next: AppState) => setState(next);
    const props = { state, updateState };

    switch (activeTab) {
      case "books":
        return <BooksScreen {...props} />;
      case "hackathons":
        return <HackathonsScreen />;
      case "journal":
        return <JournalScreen {...props} />;
      case "coach":
        return <CoachScreen {...props} />;
      case "weekly":
        return <WeeklyScreen {...props} />;
      case "settings":
        return <SettingsScreen {...props} />;
      default:
        return <TodayScreen {...props} />;
    }
  }, [activeTab, state]);

  if (!state) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Opening your private space...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!state.profile.isOnboarded) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.canvas} />
        <OnboardingScreen state={state} updateState={setState} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.canvas} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.shell}>
        {activeTab === "books" || activeTab === "hackathons" ? (
          <View style={[styles.contentFrame, keyboardVisible && styles.contentFrameTyping]}>{screen}</View>
        ) : (
          <ScrollView
            contentContainerStyle={[styles.content, keyboardVisible && styles.contentTyping]}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {screen}
          </ScrollView>
        )}
        {!keyboardVisible ? (
          <View style={styles.tabBar}>
            {tabs.map((tab) => {
              const selected = activeTab === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  style={[styles.tab, selected && styles.tabActive]}
                  onPress={() => setActiveTab(tab.key)}
                >
                  <Icon name={tab.icon} size={20} color={selected ? colors.ink : colors.muted} />
                  <Text style={[styles.tabText, selected && styles.tabTextActive]}>{tab.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0
  },
  shell: { flex: 1 },
  content: { padding: spacing.lg, paddingBottom: 112 },
  contentTyping: { paddingBottom: spacing.xl },
  contentFrame: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 96 },
  contentFrameTyping: { paddingBottom: spacing.md },
  loading: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { color: colors.muted, fontSize: 16 },
  tabBar: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: "row",
    borderRadius: 20,
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 7,
    shadowColor: "#1F2933",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8
  },
  tab: { flex: 1, minHeight: 54, alignItems: "center", justifyContent: "center", borderRadius: 14, gap: 4 },
  tabActive: { backgroundColor: colors.accentSoft },
  tabText: { fontSize: 9, color: colors.muted, fontWeight: "600" },
  tabTextActive: { color: colors.ink }
});
