export type ScheduleType = "daily" | "weekly" | "custom";

export type Habit = {
  id: string;
  name: string;
  emoji: string;
  color: string;
  scheduleType: ScheduleType;
  // schedule JSON:
  // - daily: {}
  // - weekly: { timesPerWeek: number }
  // - custom: { daysOfWeek: number[] } (0=Sun..6=Sat)
  schedule: any;
  graceDays: number;
  createdAt: string;
};

export type HabitLog = {
  id: string;
  habitId: string;
  date: string; // yyyy-MM-dd
  done: 0 | 1;
};

export type Workout = {
  id: string;
  date: string; // yyyy-MM-dd
  title: string;
  notes: string;
};

export type WorkoutExercise = {
  id: string;
  workoutId: string;
  name: string;
  orderIndex: number;
};

export type WorkoutSet = {
  id: string;
  exerciseId: string;
  reps: number;
  weight: number;
  rpe: number | null;
  completed: 0 | 1;
};
