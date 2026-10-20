import React, { useMemo, useState } from "react";
import {
	Alert,
	FlatList,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
	TextInput,
} from "react-native";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { NoteModal } from "../components/NoteModal";
import { recommendedBooks, scoreBook } from "../data/books";
import { fetchFreshGrowthBooks } from "../services/books";
import type { AppState } from "../storage";
import {
	addBookAnswer,
	addBookNote,
	getBookAnswer,
	updateBookAnswer,
	deleteBookNote,
	updateBookNote,
	getBookNotes,
} from "../storage";
import { colors, radius, spacing } from "../theme";
import type { BookSummary } from "../types";

const PAGE_SIZE = 5;

export function BooksScreen({
	state,
	updateState,
}: { state: AppState; updateState: (state: AppState) => void }) {
	const [selectedBook, setSelectedBook] = useState<BookSummary | null>(null);
	const [query, setQuery] = useState("");
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const [freshBooks, setFreshBooks] = useState<BookSummary[]>([]);
	const [refreshingBooks, setRefreshingBooks] = useState(false);
	const [answerText, setAnswerText] = useState("");
	const [isSaving, setIsSaving] = useState(false);
	const [noteModalVisible, setNoteModalVisible] = useState(false);
	const [noteBookTitle, setNoteBookTitle] = useState("");

	// New states for notes feature
	const [activeSubTab, setActiveSubTab] = useState<"library" | "notes">("library");
	const [selectedFilterBookId, setSelectedFilterBookId] = useState<string | null>(null);
	const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
	const [editingContent, setEditingContent] = useState("");

	const matchedBooks = useMemo(() => {
		const lower = query.trim().toLowerCase();
		const recommended = mergeBooks(
			recommendedBooks(state.profile.goals),
			freshBooks,
		);
		if (!lower) return recommended;
		return recommended.filter((book) =>
			[
				book.title,
				book.author,
				book.bestFor,
				book.reference,
				...book.goals,
				...book.keyIdeas,
			]
				.join(" ")
				.toLowerCase()
				.includes(lower),
		);
	}, [freshBooks, query, state.profile.goals]);

	// Load existing answer when book is selected
	React.useEffect(() => {
		if (selectedBook) {
			const existingAnswer = getBookAnswer(state, selectedBook.id);
			setAnswerText(existingAnswer?.answer || "");
		}
	}, [selectedBook, state]);

	const saveAnswer = () => {
		if (!selectedBook) return;
		setIsSaving(true);
		
		const existingAnswer = getBookAnswer(state, selectedBook.id);
		let nextState;
		
		if (existingAnswer) {
			nextState = updateBookAnswer(state, existingAnswer.id, answerText);
		} else {
			nextState = addBookAnswer(state, {
				bookId: selectedBook.id,
				bookTitle: selectedBook.title,
				prompt: selectedBook.reflectionPrompt,
				answer: answerText,
			});
		}
		
		updateState(nextState);
		setIsSaving(false);
	};

	const handleSaveNote = (content: string, selectedText?: string) => {
		if (!selectedBook) return;
		const nextState = addBookNote(state, {
			bookId: selectedBook.id,
			bookTitle: selectedBook.title,
			content,
			selectedText,
		});
		updateState(nextState);
		setNoteModalVisible(false);
	};

	const handleDeleteNote = (noteId: string) => {
		const nextState = deleteBookNote(state, noteId);
		updateState(nextState);
	};

	const handleEditNote = (noteId: string, content: string) => {
		const nextState = updateBookNote(state, noteId, content);
		updateState(nextState);
	};

	const handleSaveEdit = (noteId: string) => {
		if (editingContent.trim()) {
			handleEditNote(noteId, editingContent.trim());
			setEditingNoteId(null);
			setEditingContent("");
		}
	};

	const handleDeletePrompt = (noteId: string) => {
		Alert.alert(
			"Delete Note",
			"Are you sure you want to delete this note?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => handleDeleteNote(noteId),
				},
			]
		);
	};

	const handleNavigateToBook = (bookId: string) => {
		const allBooks = mergeBooks(
			recommendedBooks(state.profile.goals),
			freshBooks,
		);
		const book = allBooks.find((b) => b.id === bookId);
		if (book) {
			setSelectedBook(book);
		} else {
			Alert.alert("Book Not Found", "This book summary is not available in recommendations.");
		}
	};

	const booksFilterList = useMemo(() => {
		const map = new Map<string, string>(); // bookId -> bookTitle
		state.bookNotes.forEach((note) => {
			map.set(note.bookId, note.bookTitle);
		});
		return Array.from(map.entries()).map(([id, title]) => ({ id, title }));
	}, [state.bookNotes]);

	const filteredNotes = useMemo(() => {
		const notes = state.bookNotes;
		const sorted = [...notes].sort(
			(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
		);
		if (selectedFilterBookId === null) return sorted;
		return sorted.filter((n) => n.bookId === selectedFilterBookId);
	}, [state.bookNotes, selectedFilterBookId]);

	const visibleBooks = matchedBooks.slice(0, visibleCount);

	const refreshBooks = async () => {
		setRefreshingBooks(true);
		try {
			const nextBooks = await fetchFreshGrowthBooks(state.profile.goals);
			setFreshBooks(nextBooks);
			setVisibleCount(PAGE_SIZE);
			Alert.alert(
				"Books refreshed",
				`${nextBooks.length} fresh book suggestions were added.`,
			);
		} catch (error) {
			Alert.alert(
				"Books",
				error instanceof Error
					? error.message
					: "Could not fetch fresh books right now.",
			);
		} finally {
			setRefreshingBooks(false);
		}
	};

	if (selectedBook) {
		const currentBookNotes = getBookNotes(state, selectedBook.id);
		const hasNotes = currentBookNotes.length > 0;
		const fabIconName = hasNotes ? "document-text" : "create-outline";

		return (
			<View style={styles.container}>
				<ScrollView
					showsVerticalScrollIndicator={false}
					contentContainerStyle={styles.detailContent}
					keyboardShouldPersistTaps="handled"
				>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => setSelectedBook(null)}
						accessibilityRole="button"
					>
						<Icon name="chevron-back" size={22} color={colors.ink} />
						<Text style={styles.backText}>Books</Text>
					</TouchableOpacity>
					<View style={styles.detailHero}>
						<View style={styles.detailGlow} />
						<View style={styles.detailAccent} />
						<Text style={styles.detailMeta}>
							{selectedBook.author} · {selectedBook.year}
						</Text>
						<Text style={styles.detailTitle}>{selectedBook.title}</Text>
						<Text style={styles.detailSubtitle}>{selectedBook.bestFor}</Text>
					</View>
					<Card style={styles.notice}>
						<Text style={styles.noticeText}>
							Original learning summary. It references the book but avoids copying
							copyrighted text.
						</Text>
					</Card>
					<Card style={styles.section}>
						<Text style={styles.sectionTitle}>Reference</Text>
						<Text style={styles.body}>{selectedBook.reference}</Text>
					</Card>
					<Card style={styles.section}>
						<Text style={styles.sectionTitle}>Summary</Text>
						{selectedBook.summary.map((paragraph) => (
							<Text key={paragraph} style={styles.body}>
								{paragraph}
							</Text>
						))}
					</Card>
					<Card style={styles.section}>
						<Text style={styles.sectionTitle}>Key Ideas</Text>
						{selectedBook.keyIdeas.map((idea) => (
							<View key={idea} style={styles.ideaRow}>
								<View style={styles.dot} />
								<Text style={styles.ideaText}>{idea}</Text>
							</View>
						))}
					</Card>
					<Card style={styles.section}>
						<Text style={styles.sectionTitle}>Use It Today</Text>
						{selectedBook.actionSteps.map((step, index) => (
							<View key={step} style={styles.stepRow}>
								<Text style={styles.stepNumber}>{index + 1}</Text>
								<Text style={styles.ideaText}>{step}</Text>
							</View>
						))}
						<View style={styles.divider} />
						<Text style={styles.prompt}>{selectedBook.reflectionPrompt}</Text>
					</Card>
					<Card style={styles.section}>
						<Text style={styles.sectionTitle}>Your Answer</Text>
						<TextInput
							style={styles.answerInput}
							placeholder="Write your reflection here..."
							placeholderTextColor={colors.muted}
							value={answerText}
							onChangeText={setAnswerText}
							onEndEditing={saveAnswer}
							multiline
							numberOfLines={4}
							textAlignVertical="top"
						/>
						{isSaving ? (
							<Text style={styles.saveStatus}>Saving...</Text>
						) : answerText ? (
							<Text style={styles.saveStatus}>✓ Saved</Text>
						) : null}
					</Card>
				</ScrollView>
				<TouchableOpacity
					style={styles.fab}
					onPress={() => {
						if (selectedBook) {
							setNoteBookTitle(selectedBook.title);
							setNoteModalVisible(true);
						}
					}}
					accessibilityRole="button"
					accessibilityLabel="Add note"
				>
					<Icon name={fabIconName} size={24} color={colors.canvas} />
					{hasNotes ? (
						<View style={styles.fabBadge}>
							<Text style={styles.fabBadgeText}>{currentBookNotes.length}</Text>
						</View>
					) : null}
				</TouchableOpacity>
				<NoteModal
					visible={noteModalVisible}
					onClose={() => setNoteModalVisible(false)}
					onSave={handleSaveNote}
					bookTitle={noteBookTitle}
					notes={currentBookNotes}
					onDeleteNote={handleDeleteNote}
					onEditNote={handleEditNote}
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<Header
				eyebrow="Books"
				title="Recommended reading."
				subtitle="Search or browse original summaries matched to your growth goals."
			/>
			
			<View style={styles.tabContainer}>
				<TouchableOpacity
					style={[
						styles.subTabButton,
						activeSubTab === "library" && styles.subTabButtonActive,
					]}
					onPress={() => setActiveSubTab("library")}
					accessibilityRole="button"
				>
					<Text
						style={[
							styles.subTabText,
							activeSubTab === "library" && styles.subTabTextActive,
						]}
					>
						Library
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.subTabButton,
						activeSubTab === "notes" && styles.subTabButtonActive,
					]}
					onPress={() => setActiveSubTab("notes")}
					accessibilityRole="button"
				>
					<Text
						style={[
							styles.subTabText,
							activeSubTab === "notes" && styles.subTabTextActive,
						]}
					>
						My Notes ({state.bookNotes.length})
					</Text>
				</TouchableOpacity>
			</View>

			{activeSubTab === "library" ? (
				<FlatList
					data={visibleBooks}
					keyExtractor={(book) => book.id}
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					onEndReached={() =>
						setVisibleCount((current) =>
							Math.min(current + PAGE_SIZE, matchedBooks.length),
						)
					}
					onEndReachedThreshold={0.25}
					contentContainerStyle={styles.listContent}
					ListHeaderComponent={
						<View>
							<Card style={styles.libraryCard}>
								<View style={styles.libraryAccent} />
								<View style={styles.libraryTop}>
									<View>
										<Text style={styles.libraryTitle}>
											{matchedBooks.length} books
										</Text>
										<Text style={styles.libraryCaption}>
											Sorted by your selected interests
										</Text>
									</View>
									<View style={styles.libraryIcon}>
										<Icon name="library-outline" size={24} color={colors.accent} />
									</View>
								</View>
								<TouchableOpacity
									style={styles.refreshButton}
									onPress={refreshBooks}
									disabled={refreshingBooks}
								>
									<Icon name="refresh" size={17} color={colors.accent} />
									<Text style={styles.refreshText}>
										{refreshingBooks
											? "Fetching new books..."
											: "Refresh book suggestions"}
									</Text>
								</TouchableOpacity>
								<View style={styles.goalRow}>
									{state.profile.goals.map((goal) => (
										<View key={goal} style={styles.goalPill}>
											<Text style={styles.goalText}>{goal}</Text>
										</View>
									))}
								</View>
							</Card>
							<View style={styles.searchWrap}>
								<Icon
									name="search"
									size={19}
									color={colors.muted}
									style={styles.searchIcon}
								/>
								<Field
									value={query}
									onChangeText={(value) => {
										setQuery(value);
										setVisibleCount(PAGE_SIZE);
									}}
									placeholder="Search title, author, topic..."
									style={styles.searchField}
								/>
							</View>
						</View>
					}
					renderItem={({ item }) => {
						const score = scoreBook(item, state.profile.goals);
						return (
							<TouchableOpacity
								style={styles.bookPressable}
								onPress={() => setSelectedBook(item)}
								activeOpacity={0.78}
							>
								<Card style={styles.bookCard}>
									<View style={styles.bookTop}>
										<View
											style={[
												styles.bookMark,
												{ backgroundColor: bookCoverColor(item.id) },
											]}
										>
											<Text style={styles.bookInitial}>
												{item.title.slice(0, 1)}
											</Text>
										</View>
										<View style={styles.bookTitleBlock}>
											<Text style={styles.bookTitle}>{item.title}</Text>
											<Text style={styles.author}>
												{item.author} · {item.year}
											</Text>
										</View>
										<Icon
											name="chevron-forward"
											size={21}
											color={colors.softText}
										/>
									</View>
									<Text style={styles.body}>{item.bestFor}</Text>
									<View style={styles.cardFooter}>
										<View style={styles.tagRow}>
											{item.goals.slice(0, 3).map((goal) => (
												<Text key={goal} style={styles.tag}>
													{goal}
												</Text>
											))}
										</View>
										{score > 0 ? (
											<View style={styles.matchBadge}>
												<Text style={styles.matchText}>
													{score} match{score > 1 ? "es" : ""}
												</Text>
											</View>
										) : null}
									</View>
								</Card>
							</TouchableOpacity>
						);
					}}
					ListFooterComponent={
						<View style={styles.footer}>
							<Text style={styles.footerText}>
								{visibleCount < matchedBooks.length
									? "Loading more recommendations..."
									: matchedBooks.length
										? "End of library"
										: "No books found"}
							</Text>
						</View>
					}
				/>
			) : (
				<View style={{ flex: 1 }}>
					<View style={styles.filterContainer}>
						<ScrollView
							horizontal
							showsHorizontalScrollIndicator={false}
							style={styles.filterScroll}
							contentContainerStyle={styles.filterScrollContent}
						>
							<TouchableOpacity
								style={[
									styles.filterPill,
									selectedFilterBookId === null && styles.filterPillActive,
								]}
								onPress={() => setSelectedFilterBookId(null)}
								accessibilityRole="button"
							>
								<Text
									style={[
										styles.filterPillText,
										selectedFilterBookId === null && styles.filterPillTextActive,
									]}
								>
									All Books ({state.bookNotes.length})
								</Text>
							</TouchableOpacity>
							{booksFilterList.map((book) => {
								const count = state.bookNotes.filter((n) => n.bookId === book.id).length;
								return (
									<TouchableOpacity
										key={book.id}
										style={[
											styles.filterPill,
											selectedFilterBookId === book.id && styles.filterPillActive,
										]}
										onPress={() => setSelectedFilterBookId(book.id)}
										accessibilityRole="button"
									>
										<Text
											style={[
												styles.filterPillText,
												selectedFilterBookId === book.id &&
													styles.filterPillTextActive,
											]}
											numberOfLines={1}
										>
											{book.title} ({count})
										</Text>
									</TouchableOpacity>
								);
							})}
						</ScrollView>
					</View>

					{filteredNotes.length === 0 ? (
						<View style={styles.emptyNotesContainer}>
							<Icon name="document-text" size={48} color={colors.border} />
							<Text style={styles.emptyNotesText}>No notes found</Text>
							<Text style={styles.emptyNotesSubtext}>
								{selectedFilterBookId === null
									? "Start reading a book and tap the note button to create your first note."
									: "You haven't written any notes for this book yet."}
							</Text>
						</View>
					) : (
						<FlatList
							data={filteredNotes}
							keyExtractor={(note) => note.id}
							contentContainerStyle={styles.notesListContent}
							showsVerticalScrollIndicator={false}
							renderItem={({ item: note }) => (
								<Card key={note.id} style={styles.noteItemCard}>
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
													accessibilityRole="button"
												>
													<Text style={styles.actionBtnText}>Cancel</Text>
												</TouchableOpacity>
												<TouchableOpacity
													style={[styles.actionBtn, styles.saveBtnInline]}
													onPress={() => handleSaveEdit(note.id)}
													disabled={!editingContent.trim()}
													accessibilityRole="button"
												>
													<Text style={[styles.actionBtnText, styles.saveBtnInlineText]}>
														Save
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									) : (
										<View>
											<View style={styles.noteItemHeader}>
												<TouchableOpacity
													style={styles.noteItemBookLink}
													onPress={() => handleNavigateToBook(note.bookId)}
													accessibilityRole="button"
													accessibilityLabel={`Read ${note.bookTitle}`}
												>
													<Text style={styles.noteItemBookTitle}>
														{note.bookTitle} ›
													</Text>
												</TouchableOpacity>
												<View style={styles.noteItemActions}>
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
														onPress={() => handleDeletePrompt(note.id)}
														style={styles.iconButton}
														accessibilityRole="button"
														accessibilityLabel="Delete note"
													>
														<Icon name="trash-outline" size={16} color={colors.danger} />
													</TouchableOpacity>
												</View>
											</View>
											<Text style={styles.noteItemDate}>
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
											{note.selectedText ? (
												<View style={styles.noteItemQuoteContainer}>
													<Text style={styles.noteItemQuote}>
														"{note.selectedText}"
													</Text>
												</View>
											) : null}
											<Text style={styles.noteItemContent}>{note.content}</Text>
										</View>
									)}
								</Card>
							)}
						/>
					)}
				</View>
			)}
		</View>
	);
}

function mergeBooks(localBooks: BookSummary[], freshBooks: BookSummary[]) {
	const seen = new Set<string>();
	return [...freshBooks, ...localBooks].filter((book) => {
		const key = `${book.title}-${book.author}`.toLowerCase();
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

function bookCoverColor(id: string) {
	const colorsByIndex = [
		colors.blueSoft,
		colors.accentSoft,
		colors.lavenderSoft,
		"#F2E5D4",
	];
	const index = id.length % colorsByIndex.length;
	return colorsByIndex[index];
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	listContent: { paddingBottom: 24 },
	detailContent: { paddingBottom: 24 },
	backButton: {
		minHeight: 46,
		alignSelf: "flex-start",
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		paddingRight: spacing.md,
		marginBottom: spacing.md,
		borderRadius: radius.sm,
		backgroundColor: colors.panel,
		borderWidth: 1,
		borderColor: colors.border,
	},
	backText: {
		color: colors.ink,
		fontSize: 15,
		fontWeight: "800",
		paddingRight: spacing.sm,
	},
	detailHero: {
		overflow: "hidden",
		backgroundColor: colors.midnight,
		borderRadius: 22,
		padding: spacing.lg,
		marginBottom: spacing.md,
		gap: spacing.xs,
	},
	detailGlow: {
		position: "absolute",
		right: -44,
		top: -38,
		width: 140,
		height: 140,
		borderRadius: 70,
		backgroundColor: "rgba(169, 120, 43, 0.34)",
	},
	detailAccent: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: 7,
		backgroundColor: colors.ember,
	},
	detailMeta: {
		color: "#D8B981",
		fontSize: 12,
		fontWeight: "800",
		textTransform: "uppercase",
	},
	detailTitle: {
		color: "#FFFDF8",
		fontSize: 30,
		lineHeight: 36,
		fontWeight: "900",
	},
	detailSubtitle: { color: "#D9E4DD", fontSize: 16, lineHeight: 23 },
	libraryCard: {
		overflow: "hidden",
		gap: spacing.md,
		marginBottom: spacing.md,
		backgroundColor: "#FFFCF5",
	},
	libraryAccent: {
		position: "absolute",
		left: 0,
		top: 0,
		bottom: 0,
		width: 5,
		backgroundColor: colors.ember,
	},
	libraryTop: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		gap: spacing.md,
	},
	libraryTitle: { color: colors.ink, fontSize: 22, fontWeight: "900" },
	libraryCaption: { color: colors.muted, marginTop: 2 },
	libraryIcon: {
		width: 48,
		height: 48,
		borderRadius: 14,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: colors.accentSoft,
	},
	refreshButton: {
		minHeight: 44,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: spacing.xs,
		borderRadius: radius.sm,
		backgroundColor: colors.accentSoft,
	},
	refreshText: {
		color: colors.accent,
		fontWeight: "900",
	},
	searchWrap: { marginBottom: spacing.md },
	searchIcon: { position: "absolute", zIndex: 2, left: spacing.md, top: 15 },
	searchField: { paddingLeft: 42, backgroundColor: colors.panel },
	bookPressable: { marginBottom: spacing.md },
	bookCard: { gap: spacing.sm, borderLeftWidth: 0, backgroundColor: "#FFFDF8" },
	bookTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
	bookMark: {
		width: 42,
		height: 54,
		borderRadius: 10,
		borderWidth: 1,
		borderColor: "rgba(31,38,35,0.08)",
		alignItems: "center",
		justifyContent: "center",
	},
	bookInitial: { color: colors.ink, fontSize: 20, fontWeight: "900" },
	bookTitleBlock: { flex: 1, gap: 3 },
	bookTitle: {
		color: colors.ink,
		fontSize: 19,
		lineHeight: 24,
		fontWeight: "900",
	},
	author: { color: colors.gold, fontSize: 13, fontWeight: "800" },
	body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
	cardFooter: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.sm,
	},
	matchBadge: {
		alignSelf: "flex-start",
		backgroundColor: colors.accentSoft,
		borderRadius: radius.sm,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
	},
	matchText: { color: colors.accent, fontSize: 12, fontWeight: "800" },
	tagRow: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
	tag: {
		overflow: "hidden",
		color: colors.softText,
		fontSize: 12,
		fontWeight: "800",
		backgroundColor: "#F4EFE6",
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 8,
	},
	goalRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
	goalPill: {
		backgroundColor: colors.panelAlt,
		borderRadius: radius.sm,
		borderWidth: 1,
		borderColor: colors.border,
		paddingHorizontal: spacing.sm,
		paddingVertical: spacing.xs,
	},
	goalText: { color: colors.ink, fontWeight: "700", fontSize: 12 },
	notice: { backgroundColor: colors.panelAlt, marginBottom: spacing.md },
	noticeText: { color: colors.ink, fontWeight: "700", lineHeight: 20 },
	section: { gap: spacing.sm, marginBottom: spacing.md },
	sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: "900" },
	ideaRow: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
	dot: {
		width: 7,
		height: 7,
		borderRadius: 4,
		backgroundColor: colors.gold,
		marginTop: 8,
	},
	ideaText: { flex: 1, color: colors.muted, fontSize: 15, lineHeight: 22 },
	stepRow: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
	stepNumber: {
		overflow: "hidden",
		width: 24,
		height: 24,
		borderRadius: 12,
		backgroundColor: colors.accentSoft,
		color: colors.accent,
		textAlign: "center",
		lineHeight: 24,
		fontWeight: "900",
	},
	divider: {
		height: 1,
		backgroundColor: colors.border,
		marginVertical: spacing.xs,
	},
	prompt: {
		color: colors.ink,
		fontSize: 17,
		lineHeight: 24,
		fontWeight: "900",
	},
	answerInput: {
		backgroundColor: colors.panel,
		borderWidth: 1,
		borderColor: colors.border,
		borderRadius: radius.sm,
		padding: spacing.md,
		fontSize: 15,
		lineHeight: 22,
		color: colors.ink,
		minHeight: 100,
	},
	saveStatus: {
		color: colors.accent,
		fontSize: 12,
		fontWeight: "700",
		marginTop: spacing.xs,
	},
	fab: {
		position: "absolute",
		right: spacing.lg,
		bottom: spacing.lg,
		width: 56,
		height: 56,
		borderRadius: 28,
		backgroundColor: colors.accent,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
	},
	footer: { minHeight: 56, alignItems: "center", justifyContent: "center" },
	footerText: { color: colors.muted, fontWeight: "700" },

	// Sub-tab Navigation
	tabContainer: {
		flexDirection: "row",
		backgroundColor: colors.panel,
		borderRadius: radius.md,
		borderWidth: 1,
		borderColor: colors.border,
		padding: 4,
		marginBottom: spacing.md,
	},
	subTabButton: {
		flex: 1,
		paddingVertical: spacing.sm,
		alignItems: "center",
		borderRadius: radius.sm,
	},
	subTabButtonActive: {
		backgroundColor: colors.accentSoft,
	},
	subTabText: {
		fontSize: 14,
		fontWeight: "700",
		color: colors.muted,
	},
	subTabTextActive: {
		color: colors.accent,
	},

	// Filter scroll list
	filterContainer: {
		marginBottom: spacing.md,
	},
	filterScroll: {
		flexDirection: "row",
	},
	filterScrollContent: {
		paddingRight: spacing.lg,
		gap: spacing.sm,
	},
	filterPill: {
		backgroundColor: colors.panel,
		borderRadius: radius.sm,
		borderWidth: 1,
		borderColor: colors.border,
		paddingHorizontal: spacing.md,
		paddingVertical: spacing.xs,
		minHeight: 32,
		justifyContent: "center",
	},
	filterPillActive: {
		backgroundColor: colors.accent,
		borderColor: colors.accent,
	},
	filterPillText: {
		fontSize: 13,
		fontWeight: "700",
		color: colors.muted,
	},
	filterPillTextActive: {
		color: colors.panel,
	},

	// Notes item components
	notesListContent: {
		paddingBottom: 24,
	},
	noteItemCard: {
		backgroundColor: colors.panel,
		padding: spacing.md,
		marginBottom: spacing.md,
	},
	noteItemHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: spacing.xs,
	},
	noteItemBookLink: {
		flex: 1,
		marginRight: spacing.sm,
	},
	noteItemBookTitle: {
		fontSize: 14,
		fontWeight: "900",
		color: colors.gold,
	},
	noteItemActions: {
		flexDirection: "row",
		gap: spacing.sm,
		alignItems: "center",
	},
	iconButton: {
		padding: spacing.xs,
	},
	noteItemDate: {
		fontSize: 11,
		fontWeight: "600",
		color: colors.muted,
		marginBottom: spacing.sm,
	},
	noteItemQuoteContainer: {
		backgroundColor: colors.panelAlt,
		borderLeftWidth: 3,
		borderLeftColor: colors.accent,
		padding: spacing.sm,
		marginBottom: spacing.sm,
		borderRadius: radius.sm,
	},
	noteItemQuote: {
		fontSize: 13,
		color: colors.muted,
		fontStyle: "italic",
	},
	noteItemContent: {
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

	// Empty note component
	emptyNotesContainer: {
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 60,
		paddingHorizontal: spacing.lg,
	},
	emptyNotesText: {
		fontSize: 16,
		fontWeight: "900",
		color: colors.ink,
		marginTop: spacing.md,
		marginBottom: spacing.xs,
	},
	emptyNotesSubtext: {
		fontSize: 13,
		color: colors.muted,
		textAlign: "center",
		lineHeight: 18,
	},

	// FAB dynamic badge
	fabBadge: {
		position: "absolute",
		top: -4,
		right: -4,
		backgroundColor: colors.ember,
		borderRadius: 10,
		minWidth: 20,
		height: 20,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 4,
		borderWidth: 1.5,
		borderColor: colors.accent,
	},
	fabBadgeText: {
		color: colors.panel,
		fontSize: 10,
		fontWeight: "900",
	},
});
