import React from "react";
import { StyleProp, StyleSheet, Text, TextStyle } from "react-native";

const iconMap: Record<string, string> = {
  "sunny-outline": "☀",
  "library-outline": "▤",
  "book-outline": "□",
  "sparkles-outline": "✦",
  "analytics-outline": "◒",
  "settings-outline": "⚙",
  "trophy-outline": "★",
  "pin-outline": "⌖",
  "globe-outline": "◎",
  refresh: "↻",
  "chevron-back": "‹",
  "chevron-forward": "›",
  search: "⌕",
  "checkmark-circle": "✓",
  "ellipse-outline": "○",
  "compass-outline": "◇"
};

export function Icon({ name, size = 20, color = "#1F2623", style }: { name: string; size?: number; color?: string; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.icon, { color, fontSize: size, lineHeight: size + 2 }, style]}>{iconMap[name] ?? "•"}</Text>;
}

const styles = StyleSheet.create({
  icon: {
    fontWeight: "900",
    textAlign: "center"
  }
});
