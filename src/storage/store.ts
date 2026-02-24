import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { clearWebAvatar } from "./webAvatar";

export type Challenge = {
  id: string;
  title: string;
  points: number;
  dateRange: string;
  label: string;
  yourProgress: number;
  overallProgress: number;
  description: string;
  organizer: string;
  participants: number;
  tags: string[];
  shortDescription: string;
  durationDays: number;
  dailyMinutes: number;
  benefits: string[];
  steps: { title: string; detail: string }[];
};

export type MeditationSession = {
  id: string;
  date: string;
  minutes: number;
  note: string;
};

const K_CHALLENGES = "app_challenges_v1";
const K_SESSIONS = "app_meditation_sessions_v1";
const K_PROFILE = "app_profile_v1";
const K_BOOKMARKS = "app_bookmarks_v1";
const K_SEED = "app_seed_version_v1";
const K_VERSION = "app_seed_version_v1";
const SEED_VERSION = 3;

export function uuid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

async function getJson<T>(key: string, fallback: T): Promise<T> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function setJson<T>(key: string, value: T) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function seedIfNeeded() {
  const seed = await getJson<number>(K_SEED, 0);
  const existing = await getJson<Challenge[]>(K_CHALLENGES, []);
  if (seed >= 4 && existing.length >= 10) return;

  const base: Challenge[] = [
    {
      id: "c1",
      title: "7‑Day Calm Reset",
      points: 10,
      dateRange: "Mon – Sun",
      label: "Calming",
      yourProgress: 0.10,
      overallProgress: 0.30,
      description:
        "A gentle 7‑day reset designed to lower stress and help you feel steady. Each day is a short practice that builds on the last: breath awareness, body scan, and simple grounding. Ideal if your mind feels noisy or your week feels heavy.",
      organizer: "Habitly Studio",
      participants: 2400,
      shortDescription: "A week of calm, tiny sessions that steady your mind.",
      tags: ["Calming", "Beginner‑friendly"],
      durationDays: 7,
      dailyMinutes: 7,
      benefits: ["Lower stress", "Steadier mood", "Better sleep", "Gentle focus"],
      steps: [
        { title: "Day 1–2: Ground", detail: "Breath awareness + simple body scan to settle your nervous system." },
        { title: "Day 3–5: Release", detail: "Label thoughts, soften tension, and practice a longer exhale." },
        { title: "Day 6–7: Integrate", detail: "Short gratitude + intention to carry calm into the day." },
      ],
    },
    {
      id: "c2",
      title: "Breathwork Basics",
      points: 120,
      dateRange: "2 weeks",
      label: "Focus",
      yourProgress: 0.0,
      overallProgress: 0.0,
      description:
        "Learn 3 practical breathing patterns you can use anywhere: down‑shift breathing (to relax), box breathing (to focus), and extended exhale (to calm the nervous system). You’ll practice for a few minutes daily and track consistency, not perfection.",
      organizer: "Breath Club",
      participants: 1200,
      shortDescription: "Three breathing patterns for focus, stress, and fast resets.",
      tags: ["Focus", "Breathing"],
      durationDays: 14,
      dailyMinutes: 8,
      benefits: ["More focus", "Less overwhelm", "Faster reset"],
      steps: [
        { title: "Pattern 1", detail: "Down‑shift breathing for stress spikes and busy days." },
        { title: "Pattern 2", detail: "Box breathing for concentration and steady energy." },
        { title: "Pattern 3", detail: "Extended exhale to calm the body quickly." },
      ],
    },
    {
      id: "c3",
      title: "Sleep Wind‑Down Ritual",
      points: 120,
      dateRange: "10 days",
      label: "Sleep",
      yourProgress: 0.0,
      overallProgress: 0.0,
      description:
        "A short evening routine to help you fall asleep faster and wake up feeling less groggy. You’ll combine light relaxation, a body scan, and a quick reflection prompt. Great if your brain starts thinking loudly the moment you hit the pillow.",
      organizer: "Sleep Lab",
      participants: 980,
      shortDescription: "A simple night routine to quiet the mind and sleep easier.",
      tags: ["Sleep", "Relaxing"],
      durationDays: 10,
      dailyMinutes: 10,
      benefits: ["Faster sleep", "Less racing mind", "Smoother mornings"],
      steps: [
        { title: "Dim & breathe", detail: "A slow breath pattern to signal your body it’s safe to rest." },
        { title: "Body scan", detail: "Release tension from jaw, shoulders, belly, and hips." },
        { title: "Reflection", detail: "A 60‑second prompt to close the day without spiraling." },
      ],
    },
    {
      id: "c4",
      title: "Anxiety Soother Mini‑Sessions",
      points: 80,
      dateRange: "14 days",
      label: "Relaxing",
      yourProgress: 0.0,
      overallProgress: 0.0,
      description:
        "Micro‑meditations for anxious moments: 2–5 minute sessions built around grounding, labeling thoughts, and slowing the breath. Perfect for busy days when long sessions feel impossible but you still want real relief.",
      organizer: "Mindful Group",
      participants: 1750,
      shortDescription: "2–5 minute micro sessions for anxious moments.",
      tags: ["Relaxing", "Micro‑sessions"],
      durationDays: 14,
      dailyMinutes: 5,
      benefits: ["Quick relief", "More control", "Grounding"],
      steps: [
        { title: "2‑minute reset", detail: "Name 3 things you feel, 2 you hear, 1 you see." },
        { title: "Breath anchor", detail: "Count the exhale to slow down your system." },
        { title: "Kind self‑talk", detail: "A short phrase to stop the panic loop." },
      ],
    },
    {
      id: "c5",
      title: "Deep Focus (No‑Distraction)",
      points: 150,
      dateRange: "21 days",
      label: "Productivity",
      yourProgress: 0.0,
      overallProgress: 0.0,
      description:
        "Train attention like a muscle. This challenge uses simple concentration objects (breath, sound, counting) to reduce mind‑wandering. Designed for studying and deep work: shorter sessions at first, slowly increasing as your focus improves.",
      organizer: "Focus Lab",
      participants: 860,
      shortDescription: "Build deep focus and reduce mind‑wandering over 21 days.",
      tags: ["Productivity", "Concentration"],
      durationDays: 21,
      dailyMinutes: 12,
      benefits: ["Less scrolling", "Sharper focus", "More deep work"],
      steps: [
        { title: "Week 1", detail: "Short sessions + gentle resets when you drift." },
        { title: "Week 2", detail: "Longer holds on a single anchor (breath or sound)." },
        { title: "Week 3", detail: "Distraction training: notice, label, return—faster." },
      ],
    },


{
  id: "c6",
  title: "Morning Energy Spark",
  points: 90,
  dateRange: "7 days",
  label: "Energy",
  yourProgress: 0.0,
  overallProgress: 0.0,
  description:
    "A bright, short morning practice to wake up your body and clear the sleepy fog. You’ll combine breath, posture, and a quick intention so your day starts with momentum instead of dread.",
  organizer: "Habitly Studio",
  participants: 640,
  shortDescription: "A 6‑minute morning reset to wake up your mind and body.",
  tags: ["Energy", "Morning"],
  durationDays: 7,
  dailyMinutes: 6,
  benefits: ["More energy", "Less grogginess", "Better mood"],
  steps: [
    { title: "Minute 1–2", detail: "Open posture + slow inhale to wake the body." },
    { title: "Minute 3–4", detail: "Energizing breath pattern to raise alertness." },
    { title: "Minute 5–6", detail: "One intention for the day (simple + doable)." },
  ],
},
{
  id: "c7",
  title: "Confidence Builder",
  points: 110,
  dateRange: "14 days",
  label: "Confidence",
  yourProgress: 0.0,
  overallProgress: 0.0,
  description:
    "A two‑week practice for steadier self‑trust. You’ll learn to notice harsh self‑talk, soften it, and anchor into a calmer inner voice. Great before presentations, interviews, or social days.",
  organizer: "Focus Lab",
  participants: 520,
  shortDescription: "Build self‑trust with gentle reframes and calm focus.",
  tags: ["Confidence", "Self‑talk"],
  durationDays: 14,
  dailyMinutes: 9,
  benefits: ["Less self‑doubt", "Calmer nerves", "Stronger presence"],
  steps: [
    { title: "Notice", detail: "Catch the thought pattern without fighting it." },
    { title: "Reframe", detail: "Swap to a neutral, supportive phrase." },
    { title: "Anchor", detail: "Return to breath and posture to ground it." },
  ],
},
{
  id: "c8",
  title: "Gratitude & Joy",
  points: 70,
  dateRange: "10 days",
  label: "Gratitude",
  yourProgress: 0.0,
  overallProgress: 0.0,
  description:
    "A simple practice to train your brain to notice what’s working. Not toxic positivity — just a realistic shift toward appreciation. Helps mood, sleep, and relationships over time.",
  organizer: "Mindful Group",
  participants: 910,
  shortDescription: "A realistic gratitude practice to lift mood and soften stress.",
  tags: ["Gratitude", "Mood"],
  durationDays: 10,
  dailyMinutes: 5,
  benefits: ["Better mood", "More optimism", "Less rumination"],
  steps: [
    { title: "3 good things", detail: "Name three small wins or comforts." },
    { title: "Feel it", detail: "Stay with the feeling for 20 seconds." },
    { title: "Share", detail: "Optional: message one appreciation to someone." },
  ],
},
{
  id: "c9",
  title: "Mental Clarity Clean‑Up",
  points: 130,
  dateRange: "21 days",
  label: "Clarity",
  yourProgress: 0.0,
  overallProgress: 0.0,
  description:
    "Declutter your mind with a repeatable clarity routine. You’ll practice labeling thoughts, releasing tension, and choosing one priority. Perfect when everything feels urgent and your brain won’t settle.",
  organizer: "Habitly Studio",
  participants: 410,
  shortDescription: "A calm clarity routine: label, release, choose one priority.",
  tags: ["Clarity", "Overwhelm"],
  durationDays: 21,
  dailyMinutes: 10,
  benefits: ["Clearer thinking", "Less overwhelm", "Better decisions"],
  steps: [
    { title: "Label", detail: "Name what’s showing up: worry, planning, replaying." },
    { title: "Release", detail: "Relax shoulders + jaw, slow the exhale." },
    { title: "Choose", detail: "Pick one priority for today — and let the rest wait." },
  ],
},
{
  id: "c10",
  title: "Stress Downshift",
  points: 95,
  dateRange: "7 days",
  label: "Stress",
  yourProgress: 0.0,
  overallProgress: 0.0,
  description:
    "A short week-long toolkit for stress. You’ll learn a calming breath, a quick body scan, and a reset phrase you can use at work or school. Designed for real life, not perfect life.",
  organizer: "Breath Club",
  participants: 780,
  shortDescription: "A 7‑day toolkit to calm stress fast — breath, scan, reset.",
  tags: ["Stress", "Calming"],
  durationDays: 7,
  dailyMinutes: 7,
  benefits: ["Less stress", "Quicker calm", "Better recovery"],
  steps: [
    { title: "Breath", detail: "Extended exhale to calm the nervous system." },
    { title: "Scan", detail: "Release tension from head to toes." },
    { title: "Reset", detail: "A phrase to stop spiraling and return to now." },
  ],
},
  ];

  await setJson(K_CHALLENGES, base);
  const prof = await getProfile();
  await setJson(K_PROFILE, { name: prof?.name || "User", avatarUri: prof?.avatarUri || "" });
  const b = await getJson<string[]>(K_BOOKMARKS, []);
  await setJson(K_BOOKMARKS, b);
  await setJson(K_SESSIONS, await listSessions());
  await setJson(K_SEED, 4);
}


export type UserPrefs = {
  defaultMinutes: number;
  breathingCues: boolean;
  weeklyRhythm: boolean;
  compactCards: boolean;
};

const PREFS_KEY = "habitly:prefs";

export async function getPrefs(): Promise<UserPrefs> {
  const raw = await AsyncStorage.getItem(PREFS_KEY);
  if (raw) {
    try {
      const v = JSON.parse(raw);
      return {
        defaultMinutes: typeof v.defaultMinutes === "number" ? v.defaultMinutes : 10,
        breathingCues: typeof v.breathingCues === "boolean" ? v.breathingCues : true,
        weeklyRhythm: typeof v.weeklyRhythm === "boolean" ? v.weeklyRhythm : true,
        compactCards: typeof v.compactCards === "boolean" ? v.compactCards : false,
      };
    } catch {}
  }
  return { defaultMinutes: 10, breathingCues: true, weeklyRhythm: true, compactCards: false };
}

export async function setPrefs(p: UserPrefs) {
  await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(p));
}

export async function resetAllData() {
  const keys = [PROFILE_KEY, PREFS_KEY, CHALLENGES_KEY, BOOKMARKS_KEY, SESSIONS_KEY];
  await AsyncStorage.multiRemove(keys);
  if (Platform.OS === "web") {
    try { await clearWebAvatar(); } catch {}
  }
}

export async function getProfile() {
  const p = await getJson(K_PROFILE, { name: "User", avatarUri: "", avatarRef: "" });
  if (Platform.OS === "web" && typeof p.avatarUri === "string" && p.avatarUri.startsWith("blob:")) {
    const fixed = { ...p, avatarUri: "" };
    await setJson(K_PROFILE, fixed);
    return fixed;
  }
  return p;
}

export async function setProfileName(name: string) {
  const p = await getProfile();
  await setJson(K_PROFILE, { ...p, name });
}

export async function setProfileAvatar(avatarUri: string) {
  const p = await getProfile();
  await setJson(K_PROFILE, { ...p, avatarUri });
}



export async function setProfile(profile: { name: string; avatarUri: string; avatarRef?: { kind: "idb"; key: "avatar_v1" } }) {
  const safeName = (profile.name || "User").trim() || "User";
  if (Platform.OS === "web") {
    await setJson(K_PROFILE, { name: safeName, avatarUri: "", avatarRef: profile.avatarRef });
    return;
  }
  await setJson(K_PROFILE, { name: safeName, avatarUri: profile.avatarUri || "" });
}
export async function listChallenges(): Promise<Challenge[]> {
  return getJson(K_CHALLENGES, []);
}

export async function getChallenge(id: string): Promise<Challenge | null> {
  const all = await listChallenges();
  return all.find((c) => c.id === id) ?? null;
}

export async function updateChallengeProgress(id: string, yourProgress: number) {
  const all = await listChallenges();
  const next = all.map((c) => (c.id === id ? { ...c, yourProgress } : c));
  await setJson(K_CHALLENGES, next);
}

export async function listSessions(): Promise<MeditationSession[]> {
  return getJson(K_SESSIONS, []);
}

export async function addSession(minutes: number, note: string, date: string) {
  const s: MeditationSession = { id: uuid(), minutes, note, date };
  const all = await listSessions();
  await setJson(K_SESSIONS, [s, ...all]);
  return s;
}

export async function listBookmarks(): Promise<string[]> {
  return getJson(K_BOOKMARKS, []);
}

export async function toggleBookmark(id: string) {
  const all = await listBookmarks();
  const next = all.includes(id) ? all.filter((x) => x !== id) : [id, ...all];
  await setJson(K_BOOKMARKS, next);
  return next;
}
