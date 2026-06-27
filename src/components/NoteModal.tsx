import React, { useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	TextInput,
} from "react-native";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { colors, radius, spacing } from "../theme";

type NoteModalProps = {
	visible: boolean;
	onClose: () => void;
	onSave: (content: string, selectedText?: string) => void;
	bookTitle: string;
	initialContent?: string;
	initialSelectedText?: string;
};

export function NoteModal({
	visible,
	onClose,
	onSave,
	bookTitle,
	initialContent = "",
	initialSelectedText = "",
}: NoteModalProps) {
	const [content, setContent] = useState(initialContent);
	const [selectedText, setSelectedText] = useState(initialSelectedText);

	const handleSave = () => {
		if (content.trim()) {
			onSave(content.trim(), selectedText.trim() || undefined);
			setContent("");
			setSelectedText("");
		}
	};

	const handleClose = () => {
		setContent(initialContent);
		setSelectedText(initialSelectedText);
		onClose();
	};

	return (
		<Modal
			visible={visible}
			animationType="slide"
			presentationStyle="pageSheet"
			onRequestClose={handleClose}
		>
			<View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.headerButton}
						onPress={handleClose}
						accessibilityRole="button"
					>
						<Text style={styles.headerButtonText}>Cancel</Text>
					</TouchableOpacity>
					<Text style={styles.headerTitle}>New Note</Text>
					<TouchableOpacity
						style={[styles.headerButton, styles.saveButton]}
						onPress={handleSave}
						accessibilityRole="button"
						disabled={!content.trim()}
					>
						<Text
							style={[
								styles.headerButtonText,
								styles.saveButtonText,
								!content.trim() && styles.saveButtonTextDisabled,
							]}
						>
							Save
						</Text>
					</TouchableOpacity>
				</View>

				<ScrollView
					style={styles.content}
					keyboardShouldPersistTaps="handled"
					contentContainerStyle={styles.contentContainer}
				>
					<Card style={styles.bookInfo}>
						<View style={styles.bookInfoRow}>
							<Icon name="library-outline" size={18} color={colors.accent} />
							<Text style={styles.bookInfoText}>{bookTitle}</Text>
						</View>
					</Card>

					{selectedText ? (
						<Card style={styles.selectedTextCard}>
							<Text style={styles.selectedTextLabel}>Selected Text</Text>
							<Text style={styles.selectedText}>{selectedText}</Text>
							<TouchableOpacity
								style={styles.clearButton}
								onPress={() => setSelectedText("")}
							>
								<Text style={styles.clearButtonText}>Clear</Text>
							</TouchableOpacity>
						</Card>
					) : null}

					<Card style={styles.noteCard}>
						<Text style={styles.noteLabel}>Note</Text>
						<TextInput
							style={styles.noteInput}
							placeholder="Write your note here..."
							placeholderTextColor={colors.muted}
							value={content}
							onChangeText={setContent}
							multiline
							textAlignVertical="top"
							autoFocus
						/>
					</Card>

					<Text style={styles.hint}>
						Tips: Write your thoughts, insights, or action items from this book.
					</Text>
				</ScrollView>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.canvas,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: spacing.lg,
		paddingVertical: spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: colors.border,
		backgroundColor: colors.panel,
	},
	headerButton: {
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
	},
	headerButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: colors.muted,
	},
	saveButton: {
		backgroundColor: colors.accentSoft,
		borderRadius: radius.sm,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: "700",
		color: colors.accent,
	},
	saveButtonTextDisabled: {
		color: colors.muted,
	},
	headerTitle: {
		fontSize: 18,
		fontWeight: "900",
		color: colors.ink,
	},
	content: {
		flex: 1,
	},
	contentContainer: {
		padding: spacing.lg,
	},
	bookInfo: {
		marginBottom: spacing.md,
	},
	bookInfoRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: spacing.sm,
	},
	bookInfoText: {
		fontSize: 14,
		fontWeight: "700",
		color: colors.ink,
	},
	selectedTextCard: {
		marginBottom: spacing.md,
		position: "relative",
	},
	selectedTextLabel: {
		fontSize: 12,
		fontWeight: "700",
		color: colors.muted,
		marginBottom: spacing.xs,
		textTransform: "uppercase",
	},
	selectedText: {
		fontSize: 15,
		lineHeight: 22,
		color: colors.ink,
		fontStyle: "italic",
		paddingRight: spacing.xl,
	},
	clearButton: {
		position: "absolute",
		right: spacing.md,
		top: spacing.md,
	},
	clearButtonText: {
		fontSize: 12,
		fontWeight: "700",
		color: colors.accent,
	},
	noteCard: {
		marginBottom: spacing.md,
	},
	noteLabel: {
		fontSize: 12,
		fontWeight: "700",
		color: colors.muted,
		marginBottom: spacing.xs,
		textTransform: "uppercase",
	},
	noteInput: {
		fontSize: 15,
		lineHeight: 22,
		color: colors.ink,
		minHeight: 200,
		textAlignVertical: "top",
	},
	hint: {
		fontSize: 13,
		color: colors.muted,
		textAlign: "center",
		lineHeight: 18,
	},
});
