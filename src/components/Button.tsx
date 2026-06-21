import React from "react";
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { colors, radius, spacing } from "../theme";

type Props = TouchableOpacityProps & {
  label: string;
  variant?: "primary" | "secondary" | "danger";
};

export function Button({ label, variant = "primary", style, disabled, ...props }: Props) {
  return (
    <TouchableOpacity
      style={[styles.base, styles[variant], disabled && styles.disabled, style]}
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, variant !== "primary" && styles.secondaryText]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    alignItems: "center",
    justifyContent: "center"
  },
  primary: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 2
  },
  secondary: {
    backgroundColor: colors.accentSoft,
    borderWidth: 1,
    borderColor: colors.border
  },
  danger: {
    backgroundColor: "#F5DDD9",
    borderWidth: 1,
    borderColor: "#E2A39A"
  },
  disabled: {
    opacity: 0.5
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15
  },
  secondaryText: {
    color: colors.ink
  }
});
