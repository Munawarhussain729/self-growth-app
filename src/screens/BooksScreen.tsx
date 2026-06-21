import React, { useMemo, useState } from "react";
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { recommendedBooks, scoreBook } from "../data/books";
import { fetchFreshGrowthBooks } from "../services/books";
import { AppState } from "../storage";
import { colors, radius, spacing } from "../theme";
import { BookSummary } from "../types";

const PAGE_SIZE = 5;

export function BooksScreen({ state }: { state: AppState; updateState: (state: AppState) => void }) {
  const [selectedBook, setSelectedBook] = useState<BookSummary | null>(null);
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [freshBooks, setFreshBooks] = useState<BookSummary[]>([]);
  const [refreshingBooks, setRefreshingBooks] = useState(false);

  const matchedBooks = useMemo(() => {
    const lower = query.trim().toLowerCase();
    const recommended = mergeBooks(recommendedBooks(state.profile.goals), freshBooks);
    if (!lower) return recommended;
    return recommended.filter((book) =>
      [book.title, book.author, book.bestFor, book.reference, ...book.goals, ...book.keyIdeas]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }, [freshBooks, query, state.profile.goals]);

  const visibleBooks = matchedBooks.slice(0, visibleCount);

  const refreshBooks = async () => {
    setRefreshingBooks(true);
    try {
      const nextBooks = await fetchFreshGrowthBooks(state.profile.goals);
      setFreshBooks(nextBooks);
      setVisibleCount(PAGE_SIZE);
      Alert.alert("Books refreshed", `${nextBooks.length} fresh book suggestions were added.`);
    } catch (error) {
      Alert.alert("Books", error instanceof Error ? error.message : "Could not fetch fresh books right now.");
    } finally {
      setRefreshingBooks(false);
    }
  };

  if (selectedBook) {
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailContent} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedBook(null)} accessibilityRole="button">
          <Icon name="chevron-back" size={22} color={colors.ink} />
          <Text style={styles.backText}>Books</Text>
        </TouchableOpacity>
        <View style={styles.detailHero}>
          <View style={styles.detailGlow} />
          <View style={styles.detailAccent} />
          <Text style={styles.detailMeta}>{selectedBook.author} · {selectedBook.year}</Text>
          <Text style={styles.detailTitle}>{selectedBook.title}</Text>
          <Text style={styles.detailSubtitle}>{selectedBook.bestFor}</Text>
        </View>
        <Card style={styles.notice}>
          <Text style={styles.noticeText}>Original learning summary. It references the book but avoids copying copyrighted text.</Text>
        </Card>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Reference</Text>
          <Text style={styles.body}>{selectedBook.reference}</Text>
        </Card>
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          {selectedBook.summary.map((paragraph) => (
            <Text key={paragraph} style={styles.body}>{paragraph}</Text>
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
      </ScrollView>
    );
  }

  return (
    <FlatList
      data={visibleBooks}
      keyExtractor={(book) => book.id}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onEndReached={() => setVisibleCount((current) => Math.min(current + PAGE_SIZE, matchedBooks.length))}
      onEndReachedThreshold={0.25}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View>
          <Header eyebrow="Books" title="Recommended reading." subtitle="Search or browse original summaries matched to your growth goals." />
          <Card style={styles.libraryCard}>
            <View style={styles.libraryAccent} />
            <View style={styles.libraryTop}>
              <View>
                <Text style={styles.libraryTitle}>{matchedBooks.length} books</Text>
                <Text style={styles.libraryCaption}>Sorted by your selected interests</Text>
              </View>
              <View style={styles.libraryIcon}>
                <Icon name="library-outline" size={24} color={colors.accent} />
              </View>
            </View>
            <TouchableOpacity style={styles.refreshButton} onPress={refreshBooks} disabled={refreshingBooks}>
              <Icon name="refresh" size={17} color={colors.accent} />
              <Text style={styles.refreshText}>{refreshingBooks ? "Fetching new books..." : "Refresh book suggestions"}</Text>
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
            <Icon name="search" size={19} color={colors.muted} style={styles.searchIcon} />
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
          <TouchableOpacity style={styles.bookPressable} onPress={() => setSelectedBook(item)} activeOpacity={0.78}>
            <Card style={styles.bookCard}>
              <View style={styles.bookTop}>
                <View style={[styles.bookMark, { backgroundColor: bookCoverColor(item.id) }]}>
                  <Text style={styles.bookInitial}>{item.title.slice(0, 1)}</Text>
                </View>
                <View style={styles.bookTitleBlock}>
                  <Text style={styles.bookTitle}>{item.title}</Text>
                  <Text style={styles.author}>{item.author} · {item.year}</Text>
                </View>
                <Icon name="chevron-forward" size={21} color={colors.softText} />
              </View>
              <Text style={styles.body}>{item.bestFor}</Text>
              <View style={styles.cardFooter}>
                <View style={styles.tagRow}>
                  {item.goals.slice(0, 3).map((goal) => (
                    <Text key={goal} style={styles.tag}>{goal}</Text>
                  ))}
                </View>
                {score > 0 ? (
                  <View style={styles.matchBadge}>
                    <Text style={styles.matchText}>{score} match{score > 1 ? "es" : ""}</Text>
                  </View>
                ) : null}
              </View>
            </Card>
          </TouchableOpacity>
        );
      }}
      ListFooterComponent={
        <View style={styles.footer}>
          <Text style={styles.footerText}>{visibleCount < matchedBooks.length ? "Loading more recommendations..." : matchedBooks.length ? "End of library" : "No books found"}</Text>
        </View>
      }
    />
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
  const colorsByIndex = [colors.blueSoft, colors.accentSoft, colors.lavenderSoft, "#F2E5D4"];
  const index = id.length % colorsByIndex.length;
  return colorsByIndex[index];
}

const styles = StyleSheet.create({
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
    borderColor: colors.border
  },
  backText: { color: colors.ink, fontSize: 15, fontWeight: "800", paddingRight: spacing.sm },
  detailHero: { overflow: "hidden", backgroundColor: colors.midnight, borderRadius: 22, padding: spacing.lg, marginBottom: spacing.md, gap: spacing.xs },
  detailGlow: { position: "absolute", right: -44, top: -38, width: 140, height: 140, borderRadius: 70, backgroundColor: "rgba(169, 120, 43, 0.34)" },
  detailAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 7, backgroundColor: colors.ember },
  detailMeta: { color: "#D8B981", fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  detailTitle: { color: "#FFFDF8", fontSize: 30, lineHeight: 36, fontWeight: "900" },
  detailSubtitle: { color: "#D9E4DD", fontSize: 16, lineHeight: 23 },
  libraryCard: { overflow: "hidden", gap: spacing.md, marginBottom: spacing.md, backgroundColor: "#FFFCF5" },
  libraryAccent: { position: "absolute", left: 0, top: 0, bottom: 0, width: 5, backgroundColor: colors.ember },
  libraryTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  libraryTitle: { color: colors.ink, fontSize: 22, fontWeight: "900" },
  libraryCaption: { color: colors.muted, marginTop: 2 },
  libraryIcon: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: colors.accentSoft },
  refreshButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft
  },
  refreshText: {
    color: colors.accent,
    fontWeight: "900"
  },
  searchWrap: { marginBottom: spacing.md },
  searchIcon: { position: "absolute", zIndex: 2, left: spacing.md, top: 15 },
  searchField: { paddingLeft: 42, backgroundColor: colors.panel },
  bookPressable: { marginBottom: spacing.md },
  bookCard: { gap: spacing.sm, borderLeftWidth: 0, backgroundColor: "#FFFDF8" },
  bookTop: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  bookMark: { width: 42, height: 54, borderRadius: 10, borderWidth: 1, borderColor: "rgba(31,38,35,0.08)", alignItems: "center", justifyContent: "center" },
  bookInitial: { color: colors.ink, fontSize: 20, fontWeight: "900" },
  bookTitleBlock: { flex: 1, gap: 3 },
  bookTitle: { color: colors.ink, fontSize: 19, lineHeight: 24, fontWeight: "900" },
  author: { color: colors.gold, fontSize: 13, fontWeight: "800" },
  body: { color: colors.muted, fontSize: 15, lineHeight: 22 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  matchBadge: { alignSelf: "flex-start", backgroundColor: colors.accentSoft, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  matchText: { color: colors.accent, fontSize: 12, fontWeight: "800" },
  tagRow: { flex: 1, flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  tag: { overflow: "hidden", color: colors.softText, fontSize: 12, fontWeight: "800", backgroundColor: "#F4EFE6", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  goalRow: { flexDirection: "row", flexWrap: "wrap", gap: spacing.xs },
  goalPill: { backgroundColor: colors.panelAlt, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs },
  goalText: { color: colors.ink, fontWeight: "700", fontSize: 12 },
  notice: { backgroundColor: colors.panelAlt, marginBottom: spacing.md },
  noticeText: { color: colors.ink, fontWeight: "700", lineHeight: 20 },
  section: { gap: spacing.sm, marginBottom: spacing.md },
  sectionTitle: { color: colors.ink, fontSize: 18, fontWeight: "900" },
  ideaRow: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.gold, marginTop: 8 },
  ideaText: { flex: 1, color: colors.muted, fontSize: 15, lineHeight: 22 },
  stepRow: { flexDirection: "row", gap: spacing.sm, alignItems: "flex-start" },
  stepNumber: { overflow: "hidden", width: 24, height: 24, borderRadius: 12, backgroundColor: colors.accentSoft, color: colors.accent, textAlign: "center", lineHeight: 24, fontWeight: "900" },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.xs },
  prompt: { color: colors.ink, fontSize: 17, lineHeight: 24, fontWeight: "900" },
  footer: { minHeight: 56, alignItems: "center", justifyContent: "center" },
  footerText: { color: colors.muted, fontWeight: "700" }
});
