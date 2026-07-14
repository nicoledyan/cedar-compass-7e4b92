import type { AppSettings, WorkoutDay } from '../types';
import { milestones, phases } from '../data/program';

const msPerDay = 24 * 60 * 60 * 1000;

export const currentWeekFromSettings = (settings: AppSettings) => {
  const start = new Date(`${settings.startDate}T00:00:00`);
  const now = new Date();
  if (Number.isNaN(start.getTime())) return 1;
  return Math.min(24, Math.max(1, Math.floor((now.getTime() - start.getTime()) / (msPerDay * 7)) + 1));
};

export const getTodayWorkout = (workouts: WorkoutDay[], settings: AppSettings) => {
  const currentWeek = currentWeekFromSettings(settings);
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(new Date());
  return workouts.find((workout) => workout.week === currentWeek && workout.day === dayName) ?? workouts.find((workout) => workout.week === currentWeek);
};

export const weeklyProgress = (workouts: WorkoutDay[], week: number) => {
  const weekRows = workouts.filter((workout) => workout.week === week);
  const required = weekRows.filter((workout) => workout.type !== 'Optional' && workout.type !== 'Rest');
  const completed = required.reduce((sum, workout) => sum + completedItemCount(workout), 0);
  const total = required.reduce((sum, workout) => sum + plannedItemCount(workout), 0);
  return {
    completed,
    total,
    percent: total ? Math.round((completed / total) * 100) : 0
  };
};

const plannedItemCount = (workout: WorkoutDay) => {
  if (workout.type === 'Rest') return 1;
  const hasWalkExercise = workout.exercises.includes('walking');
  const walkItem = workout.walkingTarget && !hasWalkExercise ? 1 : 0;
  return (workout.warmUp?.length ?? 0) + workout.exercises.length + walkItem + (workout.coolDown?.length ?? 0);
};

const completedItemCount = (workout: WorkoutDay) => {
  const total = plannedItemCount(workout);
  if (workout.completed) return total;
  return Math.min(total, Object.values(workout.itemCompletions ?? {}).filter(Boolean).length);
};

export const streakCount = (workouts: WorkoutDay[]) => {
  const completedDays = new Set(workouts.filter((workout) => workout.completedAt).map((workout) => workout.completedAt?.slice(0, 10)));
  let streak = 0;
  const date = new Date();
  for (let index = 0; index < 365; index += 1) {
    const key = date.toISOString().slice(0, 10);
    if (!completedDays.has(key)) {
      if (index === 0) {
        date.setDate(date.getDate() - 1);
        continue;
      }
      break;
    }
    streak += 1;
    date.setDate(date.getDate() - 1);
  }
  return streak;
};

export const phaseDetails = (week: number) => phases[Math.floor((week - 1) / 4)];

export const earnedMilestone = (workouts: WorkoutDay[]) => {
  const completedWeeks = milestones.filter((milestone) => {
    const progress = weeklyProgress(workouts, milestone.week);
    return progress.total > 0 && progress.completed === progress.total;
  });
  return completedWeeks[completedWeeks.length - 1];
};
