import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useTheme } from "../theme/ThemeProvider";
import { Card } from "../components/Card";
import { Fab } from "../components/Fab";
import { Input, TinyButton } from "../components/Input";
import { Db } from "../db/database";
import { todayKey } from "../utils/date";
import { Workout, WorkoutExercise, WorkoutSet } from "../models/types";
import * as Haptics from "expo-haptics";

const quickExercises = [
  "Bench Press",
  "Incline Dumbbell Press",
  "Pull-up",
  "Lat Pulldown",
  "Barbell Row",
  "Squat",
  "Leg Press",
  "Romanian Deadlift",
  "Shoulder Press",
  "Lateral Raise",
  "Bicep Curl",
  "Tricep Pushdown",
  "Calf Raise",
  "Plank",
];

export default function WorkoutScreen() {
  const { colors, spacing, typography } = useTheme();
  const [date] = useState(todayKey());
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [setsByExercise, setSetsByExercise] = useState<Record<string, WorkoutSet[]>>({});

  const [openAdd, setOpenAdd] = useState(false);
  const [exerciseName, setExerciseName] = useState("");

  const load = useCallback(async () => {
    const w = await Db.createOrGetWorkout(date);
    setWorkout(w);
    const ex = await Db.listWorkoutExercises(w.id);
    setExercises(ex);

    const map: Record<string, WorkoutSet[]> = {};
    for (const e of ex) map[e.id] = await Db.listSets(e.id);
    setSetsByExercise(map);
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  const addExercise = async (name: string) => {
    if (!workout) return;
    const trimmed = name.trim();
    if (!trimmed) return;
    await Haptics.selectionAsync();
    await Db.addWorkoutExercise(workout.id, trimmed);
    setExerciseName("");
    setOpenAdd(false);
    await load();
  };

  const addSet = async (exerciseId: string) => {
    await Haptics.selectionAsync();
    await Db.addSet(exerciseId, 8, 0);
    await load();
  };

  const updateSet = async (s: WorkoutSet, patch: Partial<WorkoutSet>) => {
    await Db.updateSet({ ...s, ...patch });
    await load();
  };

  const deleteSet = async (id: string) => {
    await Db.deleteSet(id);
    await load();
  };

  const removeExercise = async (id: string) => {
    Alert.alert("Remove exercise?", "This deletes all sets for it.", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: async () => { await Db.deleteWorkoutExercise(id); await load(); } },
    ]);
  };

  const copyLast = async () => {
    await Db.copyLastWorkoutToDate(date);
    await load();
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: spacing.tabBarGutter, gap: spacing.lg }}>
        <Card style={{ backgroundColor: colors.primary, borderColor: "transparent" }}>
          <Text style={[typography.h2, { color: "#fff" }]}>{workout?.title ?? "Workout"}</Text>
          <Text style={[typography.body, { color: "rgba(255,255,255,0.85)", marginTop: 6 }]}>
            {date} · fast logging mode 
          </Text>

          <View style={{ flexDirection: "row", gap: spacing.md, marginTop: spacing.lg }}>
            <Pressable
              onPress={copyLast}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.22)", alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontWeight: "900" }}>Copy Last</Text>
            </Pressable>
            <Pressable
              onPress={() => setOpenAdd(true)}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 18, backgroundColor: "#fff", alignItems: "center" }}
            >
              <Text style={{ color: colors.primaryDark, fontWeight: "900" }}>+ Exercise</Text>
            </Pressable>
          </View>
        </Card>

        <Card>
          <Text style={[typography.h3, { color: colors.text }]}>Notes (optional)</Text>
          <TextInput
            value={workout?.notes ?? ""}
            onChangeText={async (t) => {
              if (!workout) return;
              const next = { ...workout, notes: t };
              setWorkout(next);
              await Db.updateWorkout(next);
            }}
            placeholder="e.g., slept bad, reduce volume..."
            placeholderTextColor={colors.subtext}
            multiline
            style={{
              marginTop: 10,
              minHeight: 90,
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: spacing.radiusLg,
              padding: spacing.md,
              backgroundColor: "#fff",
              fontSize: 14,
              fontWeight: "700",
              color: colors.text,
            }}
          />
        </Card>

        {exercises.length === 0 ? (
          <Card>
            <Text style={[typography.h2, { color: colors.text }]}>No exercises yet</Text>
            <Text style={[typography.body, { color: colors.subtext, marginTop: 8 }]}>
              Add an exercise and log sets with quick + buttons.
            </Text>
            <Pressable onPress={() => setOpenAdd(true)} style={{ marginTop: spacing.lg, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 18, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "900" }}>Add Exercise</Text>
            </Pressable>
          </Card>
        ) : (
          exercises.map((ex) => {
            const sets = setsByExercise[ex.id] ?? [];
            return (
              <Card key={ex.id} style={{ padding: spacing.lg }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                  <Text style={[typography.h3, { color: colors.text }]}>{ex.name}</Text>
                  <View style={{ flexDirection: "row", gap: 10 }}>
                    <Pressable onPress={() => addSet(ex.id)} style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.primarySoft }}>
                      <Text style={{ color: colors.primaryDark, fontWeight: "900" }}>+ Set</Text>
                    </Pressable>
                    <Pressable onLongPress={() => removeExercise(ex.id)} style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
                      <Text style={{ color: colors.subtext, fontWeight: "900" }}>⋮</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={{ marginTop: spacing.md, gap: 10 }}>
                  {sets.length === 0 ? (
                    <Text style={[typography.body, { color: colors.subtext }]}>No sets yet. Tap + Set.</Text>
                  ) : (
                    sets.map((s, idx) => (
                      <View
                        key={s.id}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                          padding: 10,
                          borderRadius: 16,
                          backgroundColor: "#FAFAFF",
                          borderWidth: 1,
                          borderColor: colors.border,
                        }}
                      >
                        <Text style={[typography.small, { width: 26, color: colors.subtext }]}>#{idx + 1}</Text>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          <TinyButton text="−" onPress={() => updateSet(s, { reps: Math.max(1, s.reps - 1) })} />
                          <Text style={[typography.h3, { width: 36, textAlign: "center", color: colors.text }]}>{s.reps}</Text>
                          <TinyButton text="+" onPress={() => updateSet(s, { reps: Math.min(99, s.reps + 1) })} />
                          <Text style={[typography.small, { color: colors.subtext }]}>reps</Text>
                        </View>

                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginLeft: 6 }}>
                          <TinyButton text="−" onPress={() => updateSet(s, { weight: Math.max(0, Number((s.weight - 2.5).toFixed(1))) })} />
                          <Text style={[typography.h3, { width: 48, textAlign: "center", color: colors.text }]}>{s.weight}</Text>
                          <TinyButton text="+" onPress={() => updateSet(s, { weight: Number((s.weight + 2.5).toFixed(1)) })} />
                          <Text style={[typography.small, { color: colors.subtext }]}>kg</Text>
                        </View>

                        <Pressable
                          onPress={() => updateSet(s, { completed: s.completed ? 0 : 1 })}
                          style={{
                            marginLeft: "auto",
                            width: 34,
                            height: 34,
                            borderRadius: 999,
                            backgroundColor: s.completed ? colors.success : colors.primarySoft,
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Text style={{ color: s.completed ? "#fff" : colors.primaryDark, fontSize: 16, fontWeight: "900" }}>
                            {s.completed ? "✓" : "…"}
                          </Text>
                        </Pressable>

                        <Pressable onLongPress={() => deleteSet(s.id)} style={{ paddingHorizontal: 6, paddingVertical: 6 }}>
                          <Text style={{ color: colors.subtext, fontWeight: "900" }}>🗑️</Text>
                        </Pressable>
                      </View>
                    ))
                  )}
                </View>
              </Card>
            );
          })
        )}
      </ScrollView>

      <Fab onPress={() => setOpenAdd(true)} />

      <Modal visible={openAdd} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.25)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: colors.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.xl, gap: spacing.lg, maxHeight: "92%" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
              <Text style={[typography.h2, { color: colors.text }]}>Add Exercise</Text>
              <Pressable onPress={() => setOpenAdd(false)}>
                <Text style={[typography.body, { color: colors.subtext }]}>Close</Text>
              </Pressable>
            </View>

            <Input label="Exercise name" value={exerciseName} onChangeText={setExerciseName} placeholder="Type or choose below" />

            <Pressable onPress={() => addExercise(exerciseName)} style={{ backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 18, alignItems: "center" }}>
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>Add</Text>
            </Pressable>

            <Card style={{ padding: spacing.md }}>
              <Text style={[typography.small, { color: colors.subtext }]}>Quick picks</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 10 }}>
                {quickExercises.map((q) => (
                  <Pressable key={q} onPress={() => addExercise(q)} style={{ paddingHorizontal: 12, paddingVertical: 10, borderRadius: 999, backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border }}>
                    <Text style={{ color: colors.text, fontWeight: "900" }}>{q}</Text>
                  </Pressable>
                ))}
              </View>
            </Card>
          </View>
        </View>
      </Modal>
    </View>
  );
}
