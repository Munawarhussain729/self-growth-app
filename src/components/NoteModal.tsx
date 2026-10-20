import React, { useState } from "react";
import {
	Modal,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	TextInput,
	Alert,
} from "react-native";
import { Card } from "./Card";
import { Icon } from "./Icon";
import { colors, radius, spacing } from "../theme";
import { BookNote } from "../types";

type NoteModalProps = {
	visible: boolean;
	onClose: () => void;
	onSave: (content: string, selectedText?: string) => void;
	bookTitle: string;
	notes: BookNote[];
	onDeleteNote: (id: string) => void;
	onEditNote: (id: string, content: string) => void;
	initialContent?: string;
	initialSelectedText?: string;
};

export function NoteModal({
	visible,
	onClose,
	onSave,
	bookTitle,
	notes,
	onDeleteNote,
	onEditNote,
	initialContent = "",
	initialSelectedText = "",
}: NoteModalProps) {
	const [content, setContent] = useState(initialContent);
	const [selectedText, setSelectedText] = useState(initialSelectedText);
	const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
	const [editingContent, setEditingContent] = useState("");

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
		setEditingNoteId(null);
		setEditingContent("");
		onClose();
	};

	const handleDelete = (noteId: string) => {
		Alert.alert(
			"Delete Note",
			"Are you sure you want to delete this note?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => onDeleteNote(noteId),
				},
			]
		);
	};

	const handleSaveEdit = (noteId: string) => {
		if (editingContent.trim()) {
			onEditNote(noteId, editingContent.trim());
			setEditingNoteId(null);
			setEditingContent("");
		}
	};

	const sortedNotes = [...notes].sort(
		(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
	);

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
					<Text style={styles.headerTitle}>Notes</Text>
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
						<Text style={styles.noteLabel}>New Note</Text>
						<TextInput
							style={styles.noteInput}
							placeholder="Write your note here..."
							placeholderTextColor={colors.muted}
							value={content}
							onChangeText={setContent}
							multiline
							textAlignVertical="top"
						/>
					</Card>

					{sortedNotes.length > 0 ? (
						<View style={styles.previousNotesSection}>
							<Text style={styles.sectionTitle}>Previous Notes ({sortedNotes.length})</Text>
							{sortedNotes.map((note) => (
								<Card key={note.id} style={styles.previousNoteCard}>
									{editingNoteId === note.id ? (
										<View style={styles.editNoteContainer}>
											<TextInput
												style={styles.editNoteInput}
												value={editingContent}
												onChangeText={setEditingContent}
												multiline
												textAlignVertical="top"
												autoFocus
											/>
											<View style={styles.editActions}>
												<TouchableOpacity
													style={[styles.actionBtn, styles.cancelBtn]}
													onPress={() => setEditingNoteId(null)}
												>
													<Text style={styles.actionBtnText}>Cancel</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={[styles.actionBtn, styles.saveBtnInline]}
													onPress={() => handleSaveEdit(note.id)}
													disabled={!editingContent.trim()}
												>
													<Text style={[styles.actionBtnText, styles.saveBtnInlineText]}>Save</Text>
												</TouchableOpacity>
											</View>
										</View>
									) : (
										<View>
											<View style={styles.noteHeader}>
												<Text style={styles.noteDate}>
													{new Date(note.updatedAt || note.createdAt).toLocaleDateString(
														undefined,
														{
															month: "short",
															day: "numeric",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
														}
													)}
												</Text>
												<View style={styles.noteActions}>
													<TouchableOpacity
														onPress={() => {
															setEditingNoteId(note.id);
															setEditingContent(note.content);
														}}
														style={styles.iconButton}
														accessibilityRole="button"
														accessibilityLabel="Edit note"
													>
														<Icon name="pencil-outline" size={16} color={colors.accent} />
													</TouchableOpacity>
													<TouchableOpacity
														onPress={() => handleDelete(note.id)}
														style={styles.iconButton}
														accessibilityRole="button"
														accessibilityLabel="Delete note"
													>
														<Icon name="trash-outline" size={16} color={colors.danger} />
													</TouchableOpacity>
												</View>
											</View>
											{note.selectedText ? (
												<View style={styles.noteQuoteContainer}>
													<Text style={styles.noteQuote}>
														"{note.selectedText}"
													</Text>
												</View>
											) : null}
											<Text style={styles.noteText}>{note.content}</Text>
										</View>
									)}
								</Card>
							))}
						</View>
					) : null}
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
		minHeight: 120,
		textAlignVertical: "top",
	},
	previousNotesSection: {
		marginTop: spacing.md,
		gap: spacing.sm,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "900",
		color: colors.ink,
		marginBottom: spacing.xs,
	},
	previousNoteCard: {
		backgroundColor: colors.panel,
		padding: spacing.md,
		marginBottom: spacing.xs,
	},
	noteHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	noteDate: {
		fontSize: 12,
		fontWeight: "600",
		color: colors.muted,
	},
	noteActions: {
		flexDirection: "row",
		gap: spacing.sm,
	},
	iconButton: {
		padding: spacing.xs,
	},
	noteQuoteContainer: {
		backgroundColor: colors.panelAlt,
		borderLeftWidth: 3,
		borderLeftColor: colors.accent,
		padding: spacing.sm,
		marginBottom: spacing.sm,
		borderRadius: radius.sm,
	},
	noteQuote: {
		fontSize: 13,
		color: colors.muted,
		fontStyle: "italic",
	},
	noteText: {
		fontSize: 14,
		lineHeight: 20,
		color: colors.ink,
	},
	editNoteContainer: {
		gap: spacing.sm,
	},
	editNoteInput: {
		fontSize: 14,
		lineHeight: 20,
		color: colors.ink,
		backgroundColor: colors.canvas,
		borderColor: colors.border,
		borderWidth: 1,
		borderRadius: radius.sm,
		padding: spacing.sm,
		minHeight: 100,
	},
	editActions: {
		flexDirection: "row",
		justifyContent: "flex-end",
		gap: spacing.sm,
	},
	actionBtn: {
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		borderRadius: radius.sm,
	},
	cancelBtn: {
		backgroundColor: colors.canvas,
	},
	saveBtnInline: {
		backgroundColor: colors.accent,
	},
	actionBtnText: {
		fontSize: 12,
		fontWeight: "700",
		color: colors.muted,
	},
	saveBtnInlineText: {
		color: colors.panel,
	},
});
