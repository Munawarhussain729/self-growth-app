import React from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors, radius, spacing } from "../theme";

type Props = TextInputProps & {
  label?: string;
};

export function Field({ label, style, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={colors.softText}
        style={[styles.input, style]}
        textAlignVertical={props.multiline ? "top" : "center"}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.xs
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "700"
  },
  input: {
    minHeight: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFCF6",
    color: colors.ink,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: 16
  }
});
