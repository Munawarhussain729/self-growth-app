import { BookSummary, GrowthGoal } from "../types";

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  first_publish_year?: number;
  subject?: string[];
};

const goalQueries: Record<GrowthGoal, string> = {
  Discipline: "discipline habits self control",
  Focus: "focus deep work attention",
  Confidence: "confidence self esteem courage",
  "Emotional control": "emotional intelligence mindfulness",
  Communication: "communication relationships conversation",
  Productivity: "productivity effectiveness time management",
  "Health habits": "health habits wellness",
  "Spiritual growth": "meaning mindfulness spiritual growth"
};

function goalFromSubjects(subjects: string[]): GrowthGoal[] {
  const text = subjects.join(" ").toLowerCase();
  const goals: GrowthGoal[] = [];
  if (/habit|discipline|self control/.test(text)) goals.push("Discipline");
  if (/focus|attention|mindfulness|concentration/.test(text)) goals.push("Focus");
  if (/confidence|self esteem|courage/.test(text)) goals.push("Confidence");
  if (/emotion|mindfulness|stress|anxiety/.test(text)) goals.push("Emotional control");
  if (/communication|relationship|conversation|social/.test(text)) goals.push("Communication");
  if (/productivity|management|success|effectiveness/.test(text)) goals.push("Productivity");
  if (/health|wellness|fitness|sleep/.test(text)) goals.push("Health habits");
  if (/meaning|spiritual|meditation|purpose/.test(text)) goals.push("Spiritual growth");
  return goals.length ? goals : ["Discipline", "Focus"];
}

function buildOriginalSummary(title: string, subjects: string[], goals: GrowthGoal[]) {
  const topicText = subjects.slice(0, 5).join(", ") || goals.join(", ");
  return [
    `This is a copyright-safe discovery summary based on public book metadata, not copied text from the book. ${title} appears connected to ${topicText}, so it may be useful for your current growth interests.`,
    "Approach the book as a source of mental models rather than a set of rules to memorize. Look for the main problem it is trying to solve, the behavior it wants you to practice, and the kind of person it invites you to become.",
    "A practical reading strategy is to capture one idea, one personal example, and one action after each reading session. This turns the book from passive inspiration into something you can test in daily life.",
    "Because this summary is generated from metadata, treat it as a starting point. Open the book or preview page when you want the author's full argument, examples, and nuance."
  ];
}

function mapDocToBook(doc: OpenLibraryDoc): BookSummary | null {
  if (!doc.title || !doc.author_name?.length) return null;
  const subjects = doc.subject?.slice(0, 12) ?? [];
  const goals = goalFromSubjects(subjects);

  return {
    id: `openlibrary-${doc.key ?? doc.title}`.replace(/[^a-zA-Z0-9-_]/g, "-"),
    title: doc.title,
    author: doc.author_name[0],
    year: doc.first_publish_year ? String(doc.first_publish_year) : "Year unknown",
    goals,
    bestFor: `Exploring ${goals.slice(0, 2).join(" and ").toLowerCase()} through a new reading source.`,
    reference: `${doc.author_name[0]}. ${doc.title}. Open Library metadata${doc.first_publish_year ? `, first published ${doc.first_publish_year}` : ""}.`,
    summary: buildOriginalSummary(doc.title, subjects, goals),
    keyIdeas: [
      "Read for one principle you can test this week.",
      "Connect the book's topic to one real situation in your life.",
      "Keep a short note on what changes in your behavior after reading."
    ],
    actionSteps: [
      "Read or preview the first chapter and write three lines in your journal.",
      "Choose one idea from the book and turn it into a 10-minute action.",
      "Return after a week and decide whether the book deserves deeper reading."
    ],
    reflectionPrompt: `What would I want ${doc.title} to help me understand or practice right now?`
  };
}

export async function fetchFreshGrowthBooks(goals: GrowthGoal[]): Promise<BookSummary[]> {
  const selectedGoals: GrowthGoal[] = goals.length ? goals : ["Discipline", "Focus", "Productivity"];
  const query = selectedGoals.map((goal) => goalQueries[goal]).join(" ");
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=18&fields=key,title,author_name,first_publish_year,subject`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Could not fetch fresh books right now.");
  }

  const json = await response.json();
  const docs = (json.docs ?? []) as OpenLibraryDoc[];
  const seen = new Set<string>();

  return docs
    .map(mapDocToBook)
    .filter((book): book is BookSummary => Boolean(book))
    .filter((book) => {
      const key = `${book.title}-${book.author}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 12);
}
