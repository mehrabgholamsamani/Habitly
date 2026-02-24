import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";
import { Db } from "../db/database";
import { formatISODate, todayISO } from "../utils/date";
import { PillTabs } from "../components/PillTabs";
import { Button } from "../components/Button";
import { LinearGradient } from "expo-linear-gradient";

export default function DashboardScreen({ navigation }: any) {
  const { colors, spacing, typography } = useTheme();
  const [tab, setTab] = React.useState<"Today" | "Weekly" | "Overall">("Today");
  const [bestStreak, setBestStreak] = React.useState(0);
  const [checkins, setCheckins] = React.useState(0);
  const [hasHabits, setHasHabits] = React.useState(false);
  const [hasWorkout, setHasWorkout] = React.useState(false);
  const date = todayISO();

  const load = React.useCallback(async () => {
    const habits = await Db.listHabits();
    setHasHabits(habits.length > 0);
    const logs = await Db.listHabitLogsForDate(date);
    setCheckins(logs.length);
    const w = await Db.getWorkoutByDate(date);
    setHasWorkout(!!w);
    let best = 0;
    for (const h of habits) {
      const l = await Db.listHabitLogs(h.id);
      const s = computeStreak(l.map((x) => x.date), h.graceDays ?? 1);
      if (s.best > best) best = s.best;
    }
    setBestStreak(best);
  }, [date]);

  React.useEffect(() => {
    const unsub = navigation.addListener("focus", load);
    load();
    return unsub;
  }, [navigation, load]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient colors={[colors.bgTop, colors.bg]} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 260 }} />
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.tabBarGutter, gap: spacing.lg }}>
        <Card variant="hero" style={{ backgroundColor: colors.primary, borderColor: "transparent" }}>
          <View style={{ padding: spacing.xl, gap: spacing.lg }}>
            <View>
              <Text style={[typography.h1, { color: "#fff" }]}>Daily Dashboard</Text>
              <Text style={[typography.body, { color: "rgba(255,255,255,0.82)", marginTop: 6 }]}>Zero friction. Tap to win today.</Text>
            </View>

            <PillTabs
              value={tab}
              onChange={setTab as any}
              options={[
                { label: "Today", value: "Today" },
                { label: "Weekly", value: "Weekly" },
                { label: "Overall", value: "Overall" },
              ]}
              light
            />

            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <Card variant="pill" style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.10)" }}>
                <View style={{ padding: spacing.lg }}>
                  <Text style={[typography.label, { color: "rgba(255,255,255,0.82)" }]}>BEST STREAK</Text>
                  <Text style={[typography.h2, { color: "#fff", marginTop: 8 }]}>{bestStreak}</Text>
                </View>
              </Card>
              <Card variant="pill" style={{ flex: 1, backgroundColor: "rgba(255,255,255,0.14)", borderColor: "rgba(255,255,255,0.10)" }}>
                <View style={{ padding: spacing.lg }}>
                  <Text style={[typography.label, { color: "rgba(255,255,255,0.82)" }]}>TOTAL CHECK-INS</Text>
                  <Text style={[typography.h2, { color: "#fff", marginTop: 8 }]}>{checkins}</Text>
                </View>
              </Card>
            </View>
          </View>
        </Card>

        <Card>
          <View style={{ padding: spacing.xl }}>
            <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
              <Text style={[typography.h2, { color: colors.text }]}>Today</Text>
              <Text style={[typography.small, { color: colors.subtext }]}>{formatISODate(date)}</Text>
            </View>
            <Text style={[typography.body, { color: colors.subtext, marginTop: spacing.sm }]}>
              {hasHabits ? "Tap habits to check in." : "No habits yet. Add a habit and start stacking Ws."}
            </Text>
          </View>
        </Card>

        <Card>
          <View style={{ padding: spacing.xl, gap: spacing.lg }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={[typography.h2, { color: colors.text }]}>Today’s Workout</Text>
              <Pressable
                onPress={() => navigation.navigate("Workout")}
                style={{
                  paddingHorizontal: 14,
                  height: 36,
                  borderRadius: 18,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(16,34,36,0.06)",
                }}
              >
                <Text style={[typography.small, { color: colors.text, fontWeight: "800" }]}>Open</Text>
              </Pressable>
            </View>

            <View style={{ gap: 8 }}>
              <Text style={[typography.body, { color: colors.subtext }]}>Today's Workout</Text>
            </View>

            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <Button title={hasWorkout ? "Continue" : "Start"} onPress={() => navigation.navigate("Workout")} style={{ flex: 1 }} />
              <Button title="Copy Last" variant="secondary" onPress={async () => { await Db.copyLastWorkoutToDate(date); await load(); navigation.navigate("Workout"); }} style={{ flex: 1 }} />
            </View>
          </View>
        </Card>

        <Card>
          <View style={{ padding: spacing.xl, gap: spacing.lg }}>
            <Text style={[typography.h2, { color: colors.text }]}>One-tap Actions</Text>
            <View style={{ flexDirection: "row", gap: spacing.md }}>
              <Pressable
                onPress={() => navigation.navigate("Habits")}
                style={{
                  flex: 1,
                  borderRadius: 24,
                  padding: spacing.lg,
                  backgroundColor: "rgba(16,34,36,0.06)",
                }}
              >
                <Text style={[typography.h3, { color: colors.text }]}>+ New Habit</Text>
                <Text style={[typography.small, { color: colors.subtext, marginTop: 6 }]}>Daily / weekly / custom</Text>
              </Pressable>

              <Pressable
                onPress={() => navigation.navigate("Workout")}
                style={{
                  flex: 1,
                  borderRadius: 24,
                  padding: spacing.lg,
                  backgroundColor: "rgba(47,174,132,0.12)",
                }}
              >
                <Text style={[typography.h3, { color: colors.text }]}>+ New Workout</Text>
                <Text style={[typography.small, { color: colors.subtext, marginTop: 6 }]}>Fast log sets</Text>
              </Pressable>
            </View>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

function computeStreak(dates: string[], graceDays: number) {
  const set = new Set(dates);
  let cur = 0;
  let best = 0;
  let grace = graceDays;
  let day = new Date();
  day.setHours(0, 0, 0, 0);
  for (let i = 0; i < 366; i++) {
    const iso = day.toISOString().slice(0, 10);
    if (set.has(iso)) {
      cur += 1;
      best = Math.max(best, cur);
    } else if (grace > 0) {
      grace -= 1;
    } else {
      cur = 0;
      grace = graceDays;
    }
    day.setDate(day.getDate() - 1);
  }
  return { cur, best };
}
