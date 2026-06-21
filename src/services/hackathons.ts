import { HackathonEvent } from "../types";

type DevpostHackathon = {
  id: number;
  title: string;
  displayed_location?: {
    location?: string;
  };
  open_state?: string;
  url: string;
  time_left_to_submission?: string;
  submission_period_dates?: string;
  themes?: Array<{ name: string }>;
};

const DEVPOST_ENDPOINTS = [
  "https://devpost.com/api/hackathons?search=pakistan",
  "https://devpost.com/api/hackathons?challenge_type[]=online"
];

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&gt;/g, ">")
    .replace(/&lt;/g, "<")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .trim();
}

function mapDevpostHackathon(item: DevpostHackathon): HackathonEvent {
  const location = decodeHtml(item.displayed_location?.location ?? "Online");
  const locationLower = location.toLowerCase();
  const titleLower = item.title.toLowerCase();

  return {
    id: `devpost-${item.id}`,
    title: decodeHtml(item.title),
    location,
    url: item.url,
    timeLeft: item.time_left_to_submission ?? "Open now",
    dates: item.submission_period_dates ?? "Dates not listed",
    source: "Devpost",
    themes: item.themes?.map((theme) => theme.name).slice(0, 4) ?? [],
    isOnline: locationLower.includes("online"),
    isPakistanMatch:
      locationLower.includes("pakistan") ||
      locationLower.includes("lahore") ||
      locationLower.includes("karachi") ||
      locationLower.includes("islamabad") ||
      titleLower.includes("pakistan")
  };
}

export async function fetchPakistanHackathons(): Promise<HackathonEvent[]> {
  const responses = await Promise.all(
    DEVPOST_ENDPOINTS.map(async (url) => {
      const response = await fetch(url);
      if (!response.ok) return [];
      const json = await response.json();
      return (json.hackathons ?? []) as DevpostHackathon[];
    })
  );

  const unique = new Map<string, HackathonEvent>();

  responses
    .flat()
    .filter((item) => item.open_state !== "closed")
    .map(mapDevpostHackathon)
    .filter((event) => event.isOnline || event.isPakistanMatch)
    .forEach((event) => unique.set(event.id, event));

  return [...unique.values()].sort((first, second) => {
    if (first.isPakistanMatch !== second.isPakistanMatch) return first.isPakistanMatch ? -1 : 1;
    if (first.isOnline !== second.isOnline) return first.isOnline ? -1 : 1;
    return first.title.localeCompare(second.title);
  });
}
