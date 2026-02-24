import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { CalmHeader } from "../components/CalmHeader";
import { ChallengeArt } from "../components/ChallengeArt";
import { SunIcon, FlameIcon, CheckCircle, SparkleGold } from "../components/HomeIcons";
import { listChallenges, seedIfNeeded, Challenge, listSessions, listBookmarks, getPrefs } from "../storage/store";
import { useProfile } from "../hooks/useProfile";
import { todayISO } from "../utils/date";

function isoToDate(s: string) {
  const [y, m, d] = s.split("-").map((x) => parseInt(x, 10));
  return new Date(Date.UTC(y, (m || 1) - 1, d || 1));
}

function shiftISO(iso: string, delta: number) {
  const dt = isoToDate(iso);
  dt.setUTCDate(dt.getUTCDate() + delta);
  return dt.toISOString().slice(0, 10);
}

function computeStreak(dates: string[]) {
  const uniq = Array.from(new Set(dates)).sort((a, b) => (a < b ? 1 : -1));
  if (!uniq.length) return 0;
  let streak = 0;
  let cursor = todayISO();
  const set = new Set(uniq);
  while (set.has(cursor)) {
    streak += 1;
    cursor = shiftISO(cursor, -1);
  }
  return streak;
}

function sumWeek(sessions: { date: string; minutes: number }[]) {
  const t = todayISO();
  return sessions.reduce((acc, s) => {
    const dt = isoToDate(t).getTime() - isoToDate(s.date).getTime();
    const d = Math.round(Math.abs(dt) / (1000 * 60 * 60 * 24));
    if (d <= 6) return acc + (s.minutes || 0);
    return acc;
  }, 0);
}

function weekSeries(sessions: { date: string; minutes: number }[]) {
  const t = todayISO();
  const days = Array.from({ length: 7 }, (_, i) => shiftISO(t, -(6 - i)));
  const map = new Map<string, number>();
  for (const s of sessions) map.set(s.date, (map.get(s.date) || 0) + (s.minutes || 0));
  const vals = days.map((d) => ({ date: d, minutes: map.get(d) || 0 }));
  const max = Math.max(1, ...vals.map((v) => v.minutes));
  return { days: vals, max };
}

export default function HomeScreen({ navigation }: any) {
  const { colors, spacing, typography } = useTheme();
  const { name, avatarUri, refresh: refreshProfile } = useProfile();
  const [challenges, setChallenges] = React.useState<Challenge[]>([]);
  const [sessions, setSessions] = React.useState<any[]>([]);
  const [bookmarks, setBookmarks] = React.useState<string[]>([]);
  const [weeklyRhythmOn, setWeeklyRhythmOn] = React.useState(true);

  const load = React.useCallback(async () => {
    await seedIfNeeded();
    const [c, s, b, pr] = await Promise.all([listChallenges(), listSessions(), listBookmarks(), getPrefs()]);
    await refreshProfile();

    setChallenges(c);
    setSessions(s);
    setBookmarks(b);
    setWeeklyRhythmOn(pr?.weeklyRhythm !== false);
  }, []);

  React.useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [navigation, load]);

  const featured = challenges[0];
  const pick = challenges[1] || challenges[0];
  const t = todayISO();
  const didToday = sessions.some((s) => s.date === t);
  const streak = computeStreak(sessions.map((s) => s.date));
  const weekMinutes = sumWeek(sessions);
  const todayMinutes = sessions.filter((s) => s.date === t).reduce((a, s) => a + (s.minutes || 0), 0);
  const savedChallenges = challenges.filter((c) => bookmarks.includes(c.id)).slice(0, 8);
  const ws = weekSeries(sessions);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.tabBarGutter }}>
        <CalmHeader
          title="Home"
          subtitle="A calm start. One small practice at a time."
          name={name}
          avatarUri={avatarUri}
          rightBadge={<SparkleGold size={18} />}
          onPressRight={() => navigation.navigate("Search")}
        />

        <View style={{ paddingHorizontal: spacing.md, marginTop: -26, gap: spacing.md }}>
          <Card>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <SunIcon />
                <Text style={typography.title}>Today</Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {didToday ? <CheckCircle /> : <FlameIcon />}
                <Text style={[typography.sub, { color: colors.subtext }]}>{didToday ? "Logged" : "Not yet"}</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
              <View style={{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: "rgba(201,168,76,0.10)", borderWidth: 1, borderColor: "rgba(201,168,76,0.18)" }}>
                <Text style={[typography.sub, { color: colors.subtext }]}>Streak</Text>
                <Text style={[typography.title, { marginTop: 6 }]}>{streak} days</Text>
              </View>

              <View style={{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border }}>
                <Text style={[typography.sub, { color: colors.subtext }]}>This week</Text>
                <Text style={[typography.title, { marginTop: 6 }]}>{weekMinutes} min</Text>
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              {[5, 10, 15].map((m) => (
                <Pressable
                  key={m}
                  onPress={() => navigation.navigate("Play", { presetMinutes: m })}
                  style={{ flex: 1, height: 44, borderRadius: 18, backgroundColor: m === 10 ? colors.teal : "rgba(14,43,43,0.06)", borderWidth: m === 10 ? 0 : 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}
                >
                  <Text style={[typography.body, { color: m === 10 ? "#fff" : colors.text, fontWeight: "900" }]}>{m} min</Text>
                </Pressable>
              ))}
            </View>

            <Text style={[typography.sub, { marginTop: 10 }]}>Tip: even 5 minutes counts. Momentum beats perfection.</Text>
          </Card>

          {weeklyRhythmOn ? (
          <Card>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={typography.title}>Weekly rhythm</Text>
              <Text style={[typography.sub, { color: colors.accent }]}>{todayMinutes} min today</Text>
            </View>
            <Text style={[typography.sub, { marginTop: 6 }]}>A gentle view of consistency — no guilt, just feedback.</Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 14, alignItems: "flex-end" }}>
              {ws.days.map((d) => {
                const isToday = d.date === t;
                const h = Math.max(10, Math.round((d.minutes / ws.max) * 56));
                return (
                  <View key={d.date} style={{ flex: 1, alignItems: "center" }}>
                    <View
                      style={{
                        width: "100%",
                        height: h,
                        borderRadius: 14,
                        backgroundColor: isToday ? "rgba(201,168,76,0.42)" : "rgba(14,43,43,0.08)",
                        borderWidth: 1,
                        borderColor: isToday ? "rgba(201,168,76,0.30)" : colors.border,
                      }}
                    />
                    <Text style={[typography.sub, { marginTop: 8, color: colors.subtext }]}>{d.date.slice(8)}</Text>
                  </View>
                );
              })}
            </View>

            <Pressable
              onPress={() => navigation.navigate("Play", { presetMinutes: 10 })}
              style={{ marginTop: 14, height: 44, borderRadius: 18, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" }}
            >
              <Text style={[typography.body, { color: "#fff", fontWeight: "900" }]}>Keep the streak gentle</Text>
            </Pressable>
          </Card>
          ) : null}

          {savedChallenges.length ? (
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={[typography.label, { color: colors.subtext }]}>Saved shortcuts</Text>
                <Pressable onPress={() => navigation.navigate("Search")}>
                  <Text style={[typography.sub, { color: colors.accent }]}>Open library</Text>
                </Pressable>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {savedChallenges.map((c) => (
                  <Pressable key={c.id} onPress={() => navigation.navigate("ChallengeDetail", { id: c.id })}>
                    <View style={{ width: 230, borderRadius: 16, padding: 14, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
                      <View style={{ width: 66, height: 66, borderRadius: 18, overflow: "hidden" }}>
                        <ChallengeArt id={c.id} size={66} />
                      </View>
                      <Text style={[typography.points, { marginTop: 10 }]} numberOfLines={2}>{c.title}</Text>
                      <Text style={[typography.sub, { marginTop: 6 }]} numberOfLines={2}>{c.shortDescription}</Text>
                      <Text style={[typography.sub, { marginTop: 10 }]}>{c.label} · {c.durationDays}d</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : (
            <Pressable onPress={() => navigation.navigate("Search")}>
              <View style={{ borderRadius: 16, padding: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
                <Text style={typography.title}>Save a favorite</Text>
                <Text style={[typography.sub, { marginTop: 6 }]}>Bookmark a challenge in Library to see quick shortcuts here.</Text>
                <View style={{ marginTop: 12, height: 44, borderRadius: 18, backgroundColor: "rgba(201,168,76,0.12)", borderWidth: 1, borderColor: "rgba(201,168,76,0.20)", alignItems: "center", justifyContent: "center" }}>
                  <Text style={[typography.body, { fontWeight: "900" }]}>Go to Library</Text>
                </View>
              </View>
            </Pressable>
          )}

          {featured ? (
            <Pressable onPress={() => navigation.navigate("ChallengeDetail", { id: featured.id })}>
              <Card>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.title} numberOfLines={2}>Continue your path</Text>
                    <Text style={[typography.points, { marginTop: 8 }]}>{featured.title}</Text>
                    <Text style={[typography.sub, { marginTop: 8 }]} numberOfLines={2}>{featured.shortDescription}</Text>
                    <View style={{ marginTop: 12 }}>
                      <ProgressBar value={featured.yourProgress} />
                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                      <Text style={typography.sub}>{Math.round(featured.yourProgress * 100)}% complete</Text>
                      <Text style={[typography.sub, { color: colors.accent }]}>{featured.dailyMinutes} min/day</Text>
                    </View>
                  </View>

                  <View style={{ width: 78, height: 78, borderRadius: 18, overflow: "hidden" }}>
                    <ChallengeArt id={featured.id} size={78} />
                  </View>
                </View>
              </Card>
            </Pressable>
          ) : null}

          {pick ? (
            <Pressable onPress={() => navigation.navigate("Search")}>
              <View style={{ borderRadius: 16, padding: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, shadowColor: colors.shadow, shadowOpacity: 0.08, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 4 }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={typography.title}>Explore a gold pick</Text>
                  <Text style={[typography.sub, { color: colors.accent }]}>Library</Text>
                </View>
                <View style={{ flexDirection: "row", gap: 12, marginTop: 12 }}>
                  <View style={{ width: 70, height: 70, borderRadius: 18, overflow: "hidden" }}>
                    <ChallengeArt id={pick.id} size={70} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={typography.points} numberOfLines={1}>{pick.title}</Text>
                    <Text style={[typography.sub, { marginTop: 6 }]} numberOfLines={2}>{pick.shortDescription}</Text>
                    <Text style={[typography.sub, { marginTop: 10 }]}>{pick.label} · {pick.durationDays} days</Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ) : null}

          <Card>
            <Text style={typography.title}>Gentle reflection</Text>
            <Text style={[typography.sub, { marginTop: 6 }]}>A tiny prompt to keep you grounded.</Text>

            <View style={{ marginTop: 12, padding: 14, borderRadius: 16, backgroundColor: "rgba(14,43,43,0.04)", borderWidth: 1, borderColor: colors.border }}>
              <Text style={[typography.body, { fontWeight: "900" }]}>What do you want to feel after today’s practice?</Text>
              <Text style={[typography.sub, { marginTop: 8 }]}>Pick one word: calm, clear, steady, brave, soft.</Text>
              <View style={{ height: 10 }} />
              <Text style={[typography.sub, { color: colors.accent }]}>No journaling required — just notice.</Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 12 }}>
              <Pressable onPress={() => navigation.navigate("Play", { presetMinutes: 5 })} style={{ flex: 1, height: 44, borderRadius: 18, backgroundColor: colors.teal, alignItems: "center", justifyContent: "center" }}>
                <Text style={[typography.body, { color: "#fff", fontWeight: "900" }]}>Start now</Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate("Search")} style={{ flex: 1, height: 44, borderRadius: 18, backgroundColor: "rgba(14,43,43,0.06)", borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" }}>
                <Text style={[typography.body, { color: colors.text, fontWeight: "900" }]}>Browse library</Text>
              </Pressable>
            </View>

            <Text style={[typography.sub, { marginTop: 10 }]}>Today logged: {todayMinutes} min.</Text>
          </Card>

          <View style={{ height: 2 }} />
        </View>
      </ScrollView>
    </View>
  );
}
