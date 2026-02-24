import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";
import { Db } from "../db/database";
import { Habit, HabitLog } from "../models/types";
import { computeHabitStreak } from "../utils/streak";
import { subDays, parseISO, startOfDay } from "date-fns";
import { dayKey } from "../utils/date";

export default function ReportsScreen() {
  const { colors, spacing, typography } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logsByHabit, setLogsByHabit] = useState<Record<string, HabitLog[]>>({});

  const load = useCallback(async () => {
    const hs = await Db.listHabits();
    setHabits(hs);
    const map: Record<string, HabitLog[]> = {};
    for (const h of hs) map[h.id] = await Db.listHabitLogs(h.id);
    setLogsByHabit(map);
  }, []);

  useEffect(() => { load(); }, [load]);

  const last7 = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => dayKey(subDays(new Date(), 6 - i)));
    let done = 0;
    for (const h of habits) {
      const logs = logsByHabit[h.id] ?? [];
      done += logs.filter(l => days.includes(l.date) && l.done === 1).length;
    }
    return { days, done };
  }, [habits, logsByHabit]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.tabBarGutter, gap: spacing.lg }}>
        <Card style={{ backgroundColor: colors.primary, borderColor: "transparent" }}>
          <Text style={[typography.h1, { color: "#fff" }]}>Report</Text>
          <Text style={[typography.body, { color: "rgba(255,255,255,0.85)", marginTop: 6 }]}>
            Quick stats, no noise.
          </Text>
        </Card>

        <Card>
          <Text style={[typography.h2, { color: colors.text }]}>Last 7 days</Text>
          <Text style={[typography.body, { color: colors.subtext, marginTop: 6 }]}>
            Total habit check-ins: <Text style={{ fontWeight: "900", color: colors.text }}>{last7.done}</Text>
          </Text>

          <View style={{ flexDirection: "row", gap: 8, marginTop: spacing.lg, flexWrap: "wrap" }}>
            {last7.days.map((d) => (
              <View key={d} style={{ paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.primarySoft, borderWidth: 1, borderColor: colors.border }}>
                <Text style={[typography.small, { color: colors.primaryDark }]}>{d.slice(5)}</Text>
              </View>
            ))}
          </View>
        </Card>

        <Card>
          <Text style={[typography.h2, { color: colors.text }]}>Habit streaks</Text>
          <View style={{ marginTop: spacing.md, gap: 10 }}>
            {habits.length === 0 ? (
              <Text style={[typography.body, { color: colors.subtext }]}>Create habits to see streaks.</Text>
            ) : habits.map((h) => {
              const streak = computeHabitStreak(h, logsByHabit[h.id] ?? []);
              return (
                <View key={h.id} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 18, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border }}>
                  <Text style={[typography.body, { color: colors.text }]} numberOfLines={1}>{h.emoji} {h.name}</Text>
                  <Text style={[typography.body, { color: colors.primaryDark, fontWeight: "900" }]}>{streak}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        <Card>
          <Text style={[typography.h2, { color: colors.text }]}>Workout</Text>
          <Text style={[typography.body, { color: colors.subtext, marginTop: 6 }]}>
            This demo keeps workout reporting simple. Your logging data is stored offline and ready for richer analytics later.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
}
