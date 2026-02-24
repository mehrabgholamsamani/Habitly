import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import { Habit, HabitLog, Workout, WorkoutExercise, WorkoutSet } from "../models/types";

type Row = Record<string, any>;

const STORAGE_KEY = "habitly_fallback_db_v1";

/**
 * Why this exists:
 * - Expo SQLite does not run on web (and can appear as an empty module), which causes:
 *   SQLite.openDatabase is not a function
 * - On native (iOS/Android), we use SQLite.
 * - On web, we use a tiny JSON DB persisted in AsyncStorage (backed by localStorage).
 */

let nativeDb: SQLite.SQLiteDatabase | null = null;
const isNativeSQLite = Platform.OS !== "web" && typeof (SQLite as any).openDatabase === "function";

function getNativeDb() {
  if (!nativeDb) nativeDb = (SQLite as any).openDatabase("habitly.db");
  return nativeDb!;
}

type FallbackDbShape = {
  habits: Row[];
  habit_logs: Row[];
  workouts: Row[];
  workout_exercises: Row[];
  workout_sets: Row[];
};

async function loadFallback(): Promise<FallbackDbShape> {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) return { habits: [], habit_logs: [], workouts: [], workout_exercises: [], workout_sets: [] };
  try {
    const parsed = JSON.parse(raw);
    return {
      habits: parsed.habits ?? [],
      habit_logs: parsed.habit_logs ?? [],
      workouts: parsed.workouts ?? [],
      workout_exercises: parsed.workout_exercises ?? [],
      workout_sets: parsed.workout_sets ?? [],
    };
  } catch {
    return { habits: [], habit_logs: [], workouts: [], workout_exercises: [], workout_sets: [] };
  }
}

async function saveFallback(db: FallbackDbShape) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export async function resetFallbackDb() {
  await AsyncStorage.removeItem(STORAGE_KEY);
}

export async function initDb(): Promise<void> {
  if (!isNativeSQLite) {
    await loadFallback();
    return;
  }
  const db = getNativeDb();
  await exec(db, `
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS habits (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      emoji TEXT NOT NULL,
      color TEXT NOT NULL,
      schedule_type TEXT NOT NULL,
      schedule_json TEXT NOT NULL,
      grace_days INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS habit_logs (
      id TEXT PRIMARY KEY NOT NULL,
      habit_id TEXT NOT NULL,
      date TEXT NOT NULL,
      done INTEGER NOT NULL DEFAULT 1,
      UNIQUE(habit_id, date),
      FOREIGN KEY (habit_id) REFERENCES habits(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workouts (
      id TEXT PRIMARY KEY NOT NULL,
      date TEXT NOT NULL,
      title TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS workout_exercises (
      id TEXT PRIMARY KEY NOT NULL,
      workout_id TEXT NOT NULL,
      name TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workout_sets (
      id TEXT PRIMARY KEY NOT NULL,
      exercise_id TEXT NOT NULL,
      reps INTEGER NOT NULL,
      weight REAL NOT NULL,
      rpe REAL,
      completed INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
    );
  `);
}

function exec(db: SQLite.SQLiteDatabase, sql: string, args: any[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    // @ts-ignore - legacy expo-sqlite exec API is still supported in SDK 51
    db.exec([{ sql, args }], false, (err) => (err ? reject(err) : resolve()));
  });
}

function runNative<T = any>(sql: string, args: any[] = []): Promise<T[]> {
  const db = getNativeDb();
  return new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        sql,
        args,
        (_, res) => resolve(res.rows._array as T[]),
        (_, err) => {
          reject(err);
          return true;
        }
      );
    });
  });
}

function runOneNative<T = any>(sql: string, args: any[] = []): Promise<T | null> {
  return runNative<T>(sql, args).then((rows) => rows[0] ?? null);
}

function sortBy<T>(arr: T[], key: string, dir: "asc" | "desc" = "asc"): T[] {
  return [...arr].sort((a: any, b: any) => {
    const av = a[key];
    const bv = b[key];
    if (av === bv) return 0;
    return (av > bv ? 1 : -1) * (dir === "asc" ? 1 : -1);
  });
}

export const Db = {
  async listHabits(): Promise<Habit[]> {
    if (isNativeSQLite) {
      const rows = await runNative<any>("SELECT * FROM habits ORDER BY created_at DESC");
      return rows.map(rowToHabit);
    }
    const db = await loadFallback();
    return sortBy(db.habits, "created_at", "desc").map(rowToHabit);
  },

  async createHabit(h: Habit): Promise<void> {
    if (isNativeSQLite) {
      await runNative(
        "INSERT INTO habits (id, name, emoji, color, schedule_type, schedule_json, grace_days, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [h.id, h.name, h.emoji, h.color, h.scheduleType, JSON.stringify(h.schedule ?? {}), h.graceDays ?? 1, h.createdAt]
      );
      return;
    }
    const db = await loadFallback();
    db.habits.push({
      id: h.id,
      name: h.name,
      emoji: h.emoji,
      color: h.color,
      schedule_type: h.scheduleType,
      schedule_json: JSON.stringify(h.schedule ?? {}),
      grace_days: h.graceDays ?? 1,
      created_at: h.createdAt,
    });
    await saveFallback(db);
  },

  async updateHabit(h: Habit): Promise<void> {
    if (isNativeSQLite) {
      await runNative(
        "UPDATE habits SET name=?, emoji=?, color=?, schedule_type=?, schedule_json=?, grace_days=? WHERE id=?",
        [h.name, h.emoji, h.color, h.scheduleType, JSON.stringify(h.schedule ?? {}), h.graceDays ?? 1, h.id]
      );
      return;
    }
    const db = await loadFallback();
    const idx = db.habits.findIndex((x) => x.id === h.id);
    if (idx >= 0) {
      db.habits[idx] = {
        ...db.habits[idx],
        name: h.name,
        emoji: h.emoji,
        color: h.color,
        schedule_type: h.scheduleType,
        schedule_json: JSON.stringify(h.schedule ?? {}),
        grace_days: h.graceDays ?? 1,
      };
      await saveFallback(db);
    }
  },

  async deleteHabit(id: string): Promise<void> {
    if (isNativeSQLite) {
      await runNative("DELETE FROM habits WHERE id=?", [id]);
      return;
    }
    const db = await loadFallback();
    db.habits = db.habits.filter((h) => h.id !== id);
    db.habit_logs = db.habit_logs.filter((l) => l.habit_id !== id);
    await saveFallback(db);
  },

  async listHabitLogs(habitId: string): Promise<HabitLog[]> {
    if (isNativeSQLite) {
      return runNative<any>("SELECT * FROM habit_logs WHERE habit_id=? ORDER BY date DESC", [habitId]).then((r) =>
        r.map(rowToHabitLog)
      );
    }
    const db = await loadFallback();
    return sortBy(db.habit_logs.filter((l) => l.habit_id === habitId), "date", "desc").map(rowToHabitLog);
  },

  async listHabitLogsForDate(date: string): Promise<HabitLog[]> {
    if (isNativeSQLite) {
      return runNative<any>("SELECT * FROM habit_logs WHERE date=? AND done=1", [date]).then((r) => r.map(rowToHabitLog));
    }
    const db = await loadFallback();
    return db.habit_logs.filter((l) => l.date === date && l.done === 1).map(rowToHabitLog);
  },

  async toggleHabitDone(habitId: string, date: string): Promise<void> {
    if (isNativeSQLite) {
      const existing = await runOneNative<any>("SELECT * FROM habit_logs WHERE habit_id=? AND date=?", [habitId, date]);
      if (existing) {
        await runNative("DELETE FROM habit_logs WHERE id=?", [existing.id]);
      } else {
        await runNative("INSERT OR IGNORE INTO habit_logs (id, habit_id, date, done) VALUES (?, ?, ?, 1)", [
          uuid(),
          habitId,
          date,
        ]);
      }
      return;
    }
    const db = await loadFallback();
    const idx = db.habit_logs.findIndex((l) => l.habit_id === habitId && l.date === date);
    if (idx >= 0) db.habit_logs.splice(idx, 1);
    else db.habit_logs.push({ id: uuid(), habit_id: habitId, date, done: 1 });
    await saveFallback(db);
  },

  async getWorkoutByDate(date: string): Promise<Workout | null> {
    if (isNativeSQLite) {
      const row = await runOneNative<any>("SELECT * FROM workouts WHERE date=?", [date]);
      return row ? rowToWorkout(row) : null;
    }
    const db = await loadFallback();
    const row = db.workouts.find((w) => w.date === date) ?? null;
    return row ? rowToWorkout(row) : null;
  },

  async createOrGetWorkout(date: string, title = "Today's Workout"): Promise<Workout> {
    const existing = await this.getWorkoutByDate(date);
    if (existing) return existing;

    const w: Workout = { id: uuid(), date, title, notes: "" };

    if (isNativeSQLite) {
      await runNative("INSERT INTO workouts (id, date, title, notes) VALUES (?, ?, ?, ?)", [w.id, w.date, w.title, w.notes]);
      return w;
    }
    const db = await loadFallback();
    db.workouts.push({ id: w.id, date: w.date, title: w.title, notes: w.notes });
    await saveFallback(db);
    return w;
  },

  async updateWorkout(w: Workout): Promise<void> {
    if (isNativeSQLite) {
      await runNative("UPDATE workouts SET title=?, notes=? WHERE id=?", [w.title, w.notes, w.id]);
      return;
    }
    const db = await loadFallback();
    const idx = db.workouts.findIndex((x) => x.id === w.id);
    if (idx >= 0) {
      db.workouts[idx] = { ...db.workouts[idx], title: w.title, notes: w.notes };
      await saveFallback(db);
    }
  },

  async listWorkoutExercises(workoutId: string): Promise<WorkoutExercise[]> {
    if (isNativeSQLite) {
      const rows = await runNative<any>("SELECT * FROM workout_exercises WHERE workout_id=? ORDER BY order_index ASC", [workoutId]);
      return rows.map(rowToWorkoutExercise);
    }
    const db = await loadFallback();
    return sortBy(db.workout_exercises.filter((e) => e.workout_id === workoutId), "order_index", "asc").map(rowToWorkoutExercise);
  },

  async addWorkoutExercise(workoutId: string, name: string): Promise<WorkoutExercise> {
    if (isNativeSQLite) {
      const maxRow = await runOneNative<any>("SELECT MAX(order_index) as m FROM workout_exercises WHERE workout_id=?", [workoutId]);
      const nextIndex = (maxRow?.m ?? -1) + 1;
      const ex: WorkoutExercise = { id: uuid(), workoutId, name, orderIndex: nextIndex };
      await runNative("INSERT INTO workout_exercises (id, workout_id, name, order_index) VALUES (?, ?, ?, ?)", [
        ex.id,
        ex.workoutId,
        ex.name,
        ex.orderIndex,
      ]);
      return ex;
    }

    const db = await loadFallback();
    const current = db.workout_exercises.filter((e) => e.workout_id === workoutId);
    const nextIndex = (current.reduce((m, e) => Math.max(m, e.order_index ?? 0), -1) ?? -1) + 1;
    const ex: WorkoutExercise = { id: uuid(), workoutId, name, orderIndex: nextIndex };
    db.workout_exercises.push({ id: ex.id, workout_id: workoutId, name, order_index: nextIndex });
    await saveFallback(db);
    return ex;
  },

  async renameWorkoutExercise(exerciseId: string, name: string): Promise<void> {
    if (isNativeSQLite) {
      await runNative("UPDATE workout_exercises SET name=? WHERE id=?", [name, exerciseId]);
      return;
    }
    const db = await loadFallback();
    const idx = db.workout_exercises.findIndex((e) => e.id === exerciseId);
    if (idx >= 0) {
      db.workout_exercises[idx] = { ...db.workout_exercises[idx], name };
      await saveFallback(db);
    }
  },

  async deleteWorkoutExercise(exerciseId: string): Promise<void> {
    if (isNativeSQLite) {
      await runNative("DELETE FROM workout_exercises WHERE id=?", [exerciseId]);
      return;
    }
    const db = await loadFallback();
    db.workout_sets = db.workout_sets.filter((s) => s.exercise_id !== exerciseId);
    db.workout_exercises = db.workout_exercises.filter((e) => e.id !== exerciseId);
    await saveFallback(db);
  },

  async listSets(exerciseId: string): Promise<WorkoutSet[]> {
    if (isNativeSQLite) {
      const rows = await runNative<any>("SELECT * FROM workout_sets WHERE exercise_id=? ORDER BY rowid ASC", [exerciseId]);
      return rows.map(rowToWorkoutSet);
    }
    const db = await loadFallback();
    return db.workout_sets.filter((s) => s.exercise_id === exerciseId).map(rowToWorkoutSet);
  },

  async addSet(exerciseId: string, reps = 8, weight = 0): Promise<WorkoutSet> {
    const s: WorkoutSet = { id: uuid(), exerciseId, reps, weight, rpe: null, completed: 1 };

    if (isNativeSQLite) {
      await runNative("INSERT INTO workout_sets (id, exercise_id, reps, weight, rpe, completed) VALUES (?, ?, ?, ?, ?, ?)", [
        s.id,
        s.exerciseId,
        s.reps,
        s.weight,
        s.rpe,
        s.completed,
      ]);
      return s;
    }
    const db = await loadFallback();
    db.workout_sets.push({
      id: s.id,
      exercise_id: s.exerciseId,
      reps: s.reps,
      weight: s.weight,
      rpe: s.rpe,
      completed: s.completed,
    });
    await saveFallback(db);
    return s;
  },

  async updateSet(s: WorkoutSet): Promise<void> {
    if (isNativeSQLite) {
      await runNative("UPDATE workout_sets SET reps=?, weight=?, rpe=?, completed=? WHERE id=?", [
        s.reps,
        s.weight,
        s.rpe,
        s.completed,
        s.id,
      ]);
      return;
    }
    const db = await loadFallback();
    const idx = db.workout_sets.findIndex((x) => x.id === s.id);
    if (idx >= 0) {
      db.workout_sets[idx] = { ...db.workout_sets[idx], reps: s.reps, weight: s.weight, rpe: s.rpe, completed: s.completed };
      await saveFallback(db);
    }
  },

  async deleteSet(setId: string): Promise<void> {
    if (isNativeSQLite) {
      await runNative("DELETE FROM workout_sets WHERE id=?", [setId]);
      return;
    }
    const db = await loadFallback();
    db.workout_sets = db.workout_sets.filter((s) => s.id !== setId);
    await saveFallback(db);
  },

  async copyLastWorkoutToDate(date: string): Promise<Workout> {
    if (isNativeSQLite) {
      const last = await runOneNative<any>("SELECT * FROM workouts WHERE date < ? ORDER BY date DESC LIMIT 1", [date]);
      const target = await this.createOrGetWorkout(date);
      if (!last) return target;

      const existingEx = await runNative<any>("SELECT id FROM workout_exercises WHERE workout_id=?", [target.id]);
      for (const ex of existingEx) {
        await runNative("DELETE FROM workout_sets WHERE exercise_id=?", [ex.id]);
      }
      await runNative("DELETE FROM workout_exercises WHERE workout_id=?", [target.id]);

      const srcEx = await runNative<any>("SELECT * FROM workout_exercises WHERE workout_id=? ORDER BY order_index ASC", [last.id]);
      for (const ex of srcEx) {
        const newExId = uuid();
        await runNative("INSERT INTO workout_exercises (id, workout_id, name, order_index) VALUES (?, ?, ?, ?)", [
          newExId,
          target.id,
          ex.name,
          ex.order_index,
        ]);
        const srcSets = await runNative<any>("SELECT * FROM workout_sets WHERE exercise_id=? ORDER BY rowid ASC", [ex.id]);
        for (const s of srcSets) {
          await runNative("INSERT INTO workout_sets (id, exercise_id, reps, weight, rpe, completed) VALUES (?, ?, ?, ?, ?, ?)", [
            uuid(),
            newExId,
            s.reps,
            s.weight,
            s.rpe,
            1,
          ]);
        }
      }
      return target;
    }

    // Fallback web copy
    const db = await loadFallback();
    const target = await this.createOrGetWorkout(date);
    const prev = sortBy(db.workouts.filter((w) => w.date < date), "date", "desc")[0];
    if (!prev) return target;

    const targetExercises = db.workout_exercises.filter((e) => e.workout_id === target.id);
    const targetExIds = new Set(targetExercises.map((e) => e.id));
    db.workout_sets = db.workout_sets.filter((s) => !targetExIds.has(s.exercise_id));
    db.workout_exercises = db.workout_exercises.filter((e) => e.workout_id !== target.id);

    const srcExercises = sortBy(db.workout_exercises.filter((e) => e.workout_id === prev.id), "order_index", "asc");
    for (const ex of srcExercises) {
      const newExId = uuid();
      db.workout_exercises.push({ id: newExId, workout_id: target.id, name: ex.name, order_index: ex.order_index });
      const srcSets = db.workout_sets.filter((s) => s.exercise_id === ex.id);
      for (const s of srcSets) {
        db.workout_sets.push({ id: uuid(), exercise_id: newExId, reps: s.reps, weight: s.weight, rpe: s.rpe, completed: 1 });
      }
    }

    await saveFallback(db);
    return target;
  },
};

function rowToHabit(r: any): Habit {
  return {
    id: r.id,
    name: r.name,
    emoji: r.emoji,
    color: r.color,
    scheduleType: r.schedule_type,
    schedule: safeJson(r.schedule_json, {}),
    graceDays: r.grace_days ?? 1,
    createdAt: r.created_at,
  };
}
function rowToHabitLog(r: any): HabitLog {
  return { id: r.id, habitId: r.habit_id, date: r.date, done: r.done };
}
function rowToWorkout(r: any): Workout {
  return { id: r.id, date: r.date, title: r.title, notes: r.notes ?? "" };
}
function rowToWorkoutExercise(r: any): WorkoutExercise {
  return { id: r.id, workoutId: r.workout_id, name: r.name, orderIndex: r.order_index };
}
function rowToWorkoutSet(r: any): WorkoutSet {
  return {
    id: r.id,
    exerciseId: r.exercise_id,
    reps: Number(r.reps ?? 0),
    weight: Number(r.weight ?? 0),
    rpe: r.rpe === null || r.rpe === undefined ? null : Number(r.rpe),
    completed: r.completed ?? 1,
  };
}
function safeJson(s: string, fallback: any) {
  try {
    return JSON.parse(s);
  } catch {
    return fallback;
  }
}

export function uuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
