import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";
import { Fab } from "../components/Fab";
import { Input, TinyButton } from "../components/Input";
import { Db, uuid } from "../db/database";
import { Habit, ScheduleType } from "../models/types";
import { habitPalette } from "../theme/colors";
import { computeHabitStreak } from "../utils/streak";

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export default function HabitsScreen() {
  const { colors, spacing, typography } = useTheme();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<Record<string, any[]>>({});

  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
    const [color, setColor] = useState(habitPalette[0]);
  const [scheduleType, setScheduleType] = useState<ScheduleType>("daily");
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([1,2,3,4,5]); // weekdays default
  const [timesPerWeek, setTimesPerWeek] = useState(3);
  const [graceDays, setGraceDays] = useState(1);

  const load = useCallback(async () => {
    const hs = await Db.listHabits();
    setHabits(hs);
    const map: any = {};
    for (const h of hs) {
      map[h.id] = await Db.listHabitLogs(h.id);
    }
    setLogs(map);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const reset = () => {
    setName("");
        setColor(habitPalette[Math.floor(Math.random() * habitPalette.length)]);
    setScheduleType("daily");
    setDaysOfWeek([1,2,3,4,5]);
    setTimesPerWeek(3);
    setGraceDays(1);
  };

  const save = async () => {
    if (!name.trim()) return Alert.alert("Name required", "Give your habit a name.");
    const schedule =
      scheduleType === "daily"
        ? {}
        : scheduleType === "weekly"
          ? { timesPerWeek }
          : { daysOfWeek };

    const h: Habit = {
      id: uuid(),
      name: name.trim(),
      emoji: "",
      color,
      scheduleType,
      schedule,
      graceDays,
      createdAt: new Date().toISOString(),
    };
    await Db.createHabit(h);
    setOpen(false);
    reset();
    load();
  };

  const remove = async (id: string) => {
    Alert.alert("Delete habit?", "This deletes logs too.", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { await Db.deleteHabit(id); load(); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.tabBarGutter, gap: spacing.lg }}>
        {habits.length === 0 ? (
          <Card>
            <Text style={[typography.h2, { color: colors.text }]}>No habits yet</Text>
            <Text style={[typography.body, { color: colors.subtext, marginTop: 8 }]}>
              Tap + to create your first habit. Daily / weekly / custom.
            </Text>
          </Card>
        ) : (
          habits.map((h) => {
            const streak = computeHabitStreak(h, logs[h.id] ?? []);
            return (
              <Pressable
                key={h.id}
                onLongPress={() => remove(h.id)}
                style={{
                  backgroundColor: h.color,
                  borderRadius: spacing.radiusLg,
                  padding: spacing.lg,
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.35)",
                }}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md, flex: 1 }}>
                    <View style={{ width: 44, height: 44, borderRadius: 999, backgroundColor: "rgba(255,255,255,0.35)", alignItems: "center", justifyContent: "center" }}>
                      <View style={{ width: 16, height: 16, borderRadius: 6, backgroundColor: "rgba(16,34,36,0.20)" }} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[typography.h3, { color: colors.text }]} numberOfLines={1}>{h.name}</Text>
                      <Text style={[typography.small, { color: colors.subtext, marginTop: 2 }]}>
                        {h.scheduleType.toUpperCase()} · grace {h.graceDays}d · 🔥 {streak}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: colors.subtext, fontWeight: "900" }}>⋮</Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <Fab onPress={() => { setOpen(true); }} />

      <Modal visible={open} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.xl, gap: spacing.lg, maxHeight: "92%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={[typography.h2, { color: colors.text }]}>New Habit</Text>
              <Pressable onPress={() => { setOpen(false); reset(); }}>
                <Text style={[typography.body, { color: colors.subtext }]}>Close</Text>
              </Pressable>
            </View>

            <Input label="Habit name" value={name} onChangeText={setName} placeholder="e.g., Drink water" />

            <Card style={{ padding: spacing.md }}>
              <Text style={[typography.small, { color: colors.subtext }]}>Color</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                {habitPalette.map((c) => (
                  <Pressable key={c} onPress={() => setColor(c)} style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: c, borderWidth: 2, borderColor: c === color ? colors.primaryDark : "rgba(255,255,255,0.6)" }} />
                ))}
              </View>
            </Card>

            <Card style={{ padding: spacing.md }}>
              <Text style={[typography.small, { color: colors.subtext }]}>Schedule</Text>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                {(["daily", "weekly", "custom"] as ScheduleType[]).map((t) => (
                  <Pressable key={t} onPress={() => setScheduleType(t)} style={{ flex: 1, paddingVertical: 10, borderRadius: 999, backgroundColor: scheduleType === t ? colors.primary : colors.primarySoft, alignItems: "center" }}>
                    <Text style={{ color: scheduleType === t ? "#fff" : colors.primaryDark, fontWeight: "900" }}>{t.toUpperCase()}</Text>
                  </Pressable>
                ))}
              </View>

              {scheduleType === "custom" && (
                <View style={{ marginTop: spacing.md }}>
                  <Text style={[typography.small, { color: colors.subtext }]}>Days</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                    {weekdayLabels.map((lbl, i) => {
                      const on = daysOfWeek.includes(i);
                      return (
                        <Pressable
                          key={lbl}
                          onPress={() => setDaysOfWeek((prev) => on ? prev.filter(x => x !== i) : [...prev, i].sort())}
                          style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, backgroundColor: on ? colors.primary : "#fff", borderWidth: 1, borderColor: colors.border }}
                        >
                          <Text style={{ color: on ? "#fff" : colors.text, fontWeight: "900" }}>{lbl}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              )}

              {scheduleType === "weekly" && (
                <View style={{ marginTop: spacing.md, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={[typography.small, { color: colors.subtext }]}>Times per week</Text>
                  <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <TinyButton text="−" onPress={() => setTimesPerWeek((v) => Math.max(1, v - 1))} />
                    <Text style={[typography.h3, { color: colors.text }]}>{timesPerWeek}</Text>
                    <TinyButton text="+" onPress={() => setTimesPerWeek((v) => Math.min(7, v + 1))} />
                  </View>
                </View>
              )}
            </Card>

            <Card style={{ padding: spacing.md }}>
              <Text style={[typography.small, { color: colors.subtext }]}>Missed-day grace</Text>
              <Text style={[typography.small, { color: colors.subtext, marginTop: 6 }]}>
                How many scheduled misses can happen before your streak breaks.
              </Text>
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center", marginTop: 10 }}>
                <TinyButton text="−" onPress={() => setGraceDays((v) => Math.max(0, v - 1))} />
                <Text style={[typography.h3, { color: colors.text }]}>{graceDays} day(s)</Text>
                <TinyButton text="+" onPress={() => setGraceDays((v) => Math.min(10, v + 1))} />
              </View>
            </Card>

            <Pressable
              onPress={save}
              style={{
                backgroundColor: colors.primary,
                paddingVertical: 14,
                borderRadius: 18,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Create Habit</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}
