import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Linking, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Field } from "../components/Field";
import { Header } from "../components/Header";
import { Icon } from "../components/Icon";
import { fetchPakistanHackathons } from "../services/hackathons";
import { colors, radius, spacing } from "../theme";
import { HackathonEvent } from "../types";

const fallbackLinks = [
  { label: "Devpost Pakistan", url: "https://devpost.com/hackathons?search=pakistan" },
  { label: "Devpost Online", url: "https://devpost.com/hackathons?challenge_type[]=online" },
  { label: "MLH Events", url: "https://mlh.io/seasons" }
];

export function HackathonsScreen() {
  const [events, setEvents] = useState<HackathonEvent[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState("");

  const filteredEvents = useMemo(() => {
    const lower = query.trim().toLowerCase();
    if (!lower) return events;
    return events.filter((event) =>
      [event.title, event.location, event.dates, event.timeLeft, event.source, ...event.themes]
        .join(" ")
        .toLowerCase()
        .includes(lower)
    );
  }, [events, query]);

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const nextEvents = await fetchPakistanHackathons();
      setEvents(nextEvents);
      setLastUpdated(
        new Intl.DateTimeFormat(undefined, {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit"
        }).format(new Date())
      );
    } catch {
      setError("Could not refresh hackathons right now. Try again, or open one of the source links.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <FlatList
      data={filteredEvents}
      keyExtractor={(event) => event.id}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={loading} onRefresh={loadEvents} tintColor={colors.accent} />}
      contentContainerStyle={styles.listContent}
      ListHeaderComponent={
        <View>
          <Header
            eyebrow="Hackathons"
            title="Pakistan-ready events."
            subtitle="Fresh open hackathons you can join from Pakistan, with online events included."
          />

          <Card style={styles.hero}>
            <View style={styles.heroGlow} />
            <View style={styles.heroTop}>
              <View>
                <Text style={styles.heroTitle}>{events.length}</Text>
                <Text style={styles.heroLabel}>open opportunities</Text>
              </View>
              <View style={styles.heroIcon}>
                <Icon name="trophy-outline" size={26} color={colors.accent} />
              </View>
            </View>
            <Text style={styles.heroCopy}>
              Pull to refresh each day. Pakistan matches appear first, followed by online hackathons.
            </Text>
            {lastUpdated ? <Text style={styles.updated}>Updated {lastUpdated}</Text> : null}
          </Card>

          <View style={styles.searchWrap}>
            <Icon name="search" size={19} color={colors.muted} style={styles.searchIcon} />
            <Field value={query} onChangeText={setQuery} placeholder="Search AI, web3, beginner..." style={styles.searchField} />
          </View>

          {error ? (
            <Card style={styles.errorCard}>
              <Text style={styles.errorText}>{error}</Text>
              <Button label="Retry" variant="secondary" onPress={loadEvents} />
            </Card>
          ) : null}
        </View>
      }
      renderItem={({ item }) => (
        <TouchableOpacity activeOpacity={0.78} onPress={() => Linking.openURL(item.url)}>
          <Card style={styles.eventCard}>
            <View style={styles.eventTop}>
              <View style={styles.eventMark}>
                <Icon name={item.isPakistanMatch ? "pin-outline" : "globe-outline"} size={20} color={colors.accent} />
              </View>
              <View style={styles.eventTitleBlock}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventMeta}>{item.source} · {item.location}</Text>
              </View>
              <Icon name="chevron-forward" size={21} color={colors.softText} />
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoPill}>
                <Text style={styles.infoText}>{item.timeLeft}</Text>
              </View>
              <View style={styles.infoPillAlt}>
                <Text style={styles.infoText}>{item.dates}</Text>
              </View>
            </View>

            <View style={styles.tagRow}>
              {(item.themes.length ? item.themes : [item.isOnline ? "Online" : "Pakistan"]).map((theme) => (
                <Text key={theme} style={styles.tag}>{theme}</Text>
              ))}
            </View>
          </Card>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        !loading ? (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No matches loaded.</Text>
            <Text style={styles.emptyText}>Use the links below to search directly while sources refresh.</Text>
            <View style={styles.linkRow}>
              {fallbackLinks.map((link) => (
                <TouchableOpacity key={link.url} style={styles.sourceLink} onPress={() => Linking.openURL(link.url)}>
                  <Text style={styles.sourceLinkText}>{link.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Card>
        ) : null
      }
      ListFooterComponent={
        filteredEvents.length ? (
          <View style={styles.footer}>
            {fallbackLinks.map((link) => (
              <TouchableOpacity key={link.url} onPress={() => Linking.openURL(link.url)}>
                <Text style={styles.footerLink}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24
  },
  hero: {
    overflow: "hidden",
    backgroundColor: colors.midnight,
    gap: spacing.md,
    marginBottom: spacing.md
  },
  heroGlow: {
    position: "absolute",
    right: -44,
    top: -40,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(192,122,69,0.34)"
  },
  heroTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  heroTitle: {
    color: "#FFFDF8",
    fontSize: 38,
    fontWeight: "900"
  },
  heroLabel: {
    color: "#D9E4DD",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase"
  },
  heroIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5EAD8"
  },
  heroCopy: {
    color: "#D9E4DD",
    fontSize: 15,
    lineHeight: 22
  },
  updated: {
    color: "#D8B981",
    fontWeight: "800",
    fontSize: 12
  },
  searchWrap: {
    marginBottom: spacing.md
  },
  searchIcon: {
    position: "absolute",
    zIndex: 2,
    left: spacing.md,
    top: 15
  },
  searchField: {
    paddingLeft: 42,
    backgroundColor: colors.panel
  },
  errorCard: {
    gap: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: "#F7E4DF"
  },
  errorText: {
    color: colors.danger,
    lineHeight: 21,
    fontWeight: "700"
  },
  eventCard: {
    gap: spacing.md,
    marginBottom: spacing.md
  },
  eventTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm
  },
  eventMark: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accentSoft
  },
  eventTitleBlock: {
    flex: 1,
    gap: 3
  },
  eventTitle: {
    color: colors.ink,
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900"
  },
  eventMeta: {
    color: colors.gold,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "800"
  },
  infoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  infoPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  infoPillAlt: {
    backgroundColor: colors.blueSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs
  },
  infoText: {
    color: colors.ink,
    fontSize: 12,
    fontWeight: "800"
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs
  },
  tag: {
    overflow: "hidden",
    color: colors.softText,
    fontSize: 12,
    fontWeight: "800",
    backgroundColor: "#F4EFE6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  emptyCard: {
    gap: spacing.md
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: "900"
  },
  emptyText: {
    color: colors.muted,
    lineHeight: 21
  },
  linkRow: {
    gap: spacing.sm
  },
  sourceLink: {
    minHeight: 42,
    justifyContent: "center",
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: spacing.md
  },
  sourceLinkText: {
    color: colors.accent,
    fontWeight: "900"
  },
  footer: {
    gap: spacing.sm,
    alignItems: "center",
    paddingTop: spacing.md,
    paddingBottom: spacing.md
  },
  footerLink: {
    color: colors.accent,
    fontWeight: "900"
  }
});
