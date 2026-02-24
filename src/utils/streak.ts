import { addDays, isAfter, isSameDay, parseISO, startOfDay, subDays } from "date-fns";
import { Habit, HabitLog } from "../models/types";
import { dow, dayKey } from "./date";

function isScheduledOnDate(h: Habit, date: Date): boolean {
  if (h.scheduleType === "daily") return true;
  if (h.scheduleType === "weekly") {
    // Weekly habits are "flex" — scheduled any day; handled by timesPerWeek aggregation.
    return true;
  }
  if (h.scheduleType === "custom") {
    const days: number[] = (h.schedule?.daysOfWeek ?? []);
    return days.includes(dow(date));
  }
  return true;
}

/**
 * Compute a "current streak" for a habit.
 * - daily/custom: streak counts consecutive scheduled days met, allowing up to `graceDays` missed scheduled days
 * - weekly: streak counts consecutive weeks where completedCount >= timesPerWeek, allowing grace weeks? (we'll use graceDays as graceWeeks)
 */
export function computeHabitStreak(habit: Habit, logs: HabitLog[], now = new Date()): number {
  const grace = Math.max(0, habit.graceDays ?? 0);

  if (habit.scheduleType === "weekly") {
    const times = Math.max(1, habit.schedule?.timesPerWeek ?? 1);
    // Count full weeks backward, starting this week.
    // Week starts Monday for simplicity.
    const start = startOfDay(now);
    const monday = subDays(start, (start.getDay() + 6) % 7);
    let streak = 0;
    let misses = 0;

    for (let w = 0; w < 200; w++) {
      const weekStart = subDays(monday, w * 7);
      const weekEnd = addDays(weekStart, 7);
      const count = logs.filter(l => {
        const d = parseISO(l.date);
        return !isAfter(weekStart, d) && isAfter(weekEnd, d) && l.done === 1;
      }).length;

      if (count >= times) {
        streak += 1;
      } else {
        misses += 1;
        if (misses > grace) break;
      }
    }
    return streak;
  }

  // daily/custom
  let streak = 0;
  let misses = 0;

  // Work backward day-by-day from today (inclusive)
  for (let i = 0; i < 365 * 5; i++) {
    const date = subDays(startOfDay(now), i);
    if (!isScheduledOnDate(habit, date)) continue;

    const key = dayKey(date);
    const done = logs.some(l => l.date === key && l.done === 1);

    if (done) {
      streak += 1;
    } else {
      misses += 1;
      if (misses > grace) break;
    }
  }

  return streak;
}

export function isHabitDueToday(habit: Habit, date = new Date()): boolean {
  if (habit.scheduleType === "daily") return true;
  if (habit.scheduleType === "weekly") return true; // due any day (flex)
  if (habit.scheduleType === "custom") {
    const days: number[] = (habit.schedule?.daysOfWeek ?? []);
    return days.includes(dow(date));
  }
  return true;
}
