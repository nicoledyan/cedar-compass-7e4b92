import Dexie, { type Table } from 'dexie';
import type { AppSettings, BackupPayload, Measurement, WeeklyReflection, WorkoutDay } from './types';
import { generateWorkoutPlan } from './data/program';

const PROGRAM_VERSION = 5;

export class GrowStrongDb extends Dexie {
  workouts!: Table<WorkoutDay, string>;
  measurements!: Table<Measurement, string>;
  reflections!: Table<WeeklyReflection, string>;
  settings!: Table<AppSettings, string>;

  constructor() {
    super('growStrongDb');
    this.version(1).stores({
      workouts: 'id, week, day, phase, type, completedAt',
      measurements: 'id, date',
      reflections: 'id, week',
      settings: 'id'
    });
  }
}

export const db = new GrowStrongDb();

const todayIso = () => new Date().toISOString().slice(0, 10);

export const defaultSettings = (): AppSettings => ({
  id: 'settings',
  startDate: todayIso(),
  darkMode: false,
  programVersion: PROGRAM_VERSION
});

export const seedIfNeeded = async () => {
  const settings = await db.settings.get('settings');
  const workoutCount = await db.workouts.count();
  if (!settings) {
    await db.settings.put(defaultSettings());
  }
  if (workoutCount === 0) {
    await db.workouts.bulkPut(generateWorkoutPlan());
    return;
  }
  if ((settings?.programVersion ?? 1) < PROGRAM_VERSION) {
    const currentWorkouts = await db.workouts.toArray();
    const currentById = new Map(currentWorkouts.map((workout) => [workout.id, workout]));
    const migratedWorkouts = generateWorkoutPlan().map((workout) => {
      const current = currentById.get(workout.id);
      if (!current) return workout;
      return {
        ...workout,
        completed: current.completed,
        rpe: current.rpe,
        elbowPain: current.elbowPain,
        itemCompletions: current.itemCompletions,
        notes: current.notes,
        completedAt: current.completedAt
      };
    });
    await db.transaction('rw', db.workouts, db.settings, async () => {
      await db.workouts.clear();
      await db.workouts.bulkPut(migratedWorkouts);
      await db.settings.put({ ...(settings ?? defaultSettings()), darkMode: false, programVersion: PROGRAM_VERSION });
    });
  }
};

export const exportBackup = async (): Promise<BackupPayload> => ({
  version: 1,
  exportedAt: new Date().toISOString(),
  workouts: await db.workouts.toArray(),
  measurements: await db.measurements.toArray(),
  reflections: await db.reflections.toArray(),
  settings: (await db.settings.get('settings')) ?? defaultSettings()
});

export const importBackup = async (payload: BackupPayload) => {
  if (payload.version !== 1 || !Array.isArray(payload.workouts)) {
    throw new Error('This backup does not look like a Grow Strong export.');
  }
  await db.transaction('rw', db.workouts, db.measurements, db.reflections, db.settings, async () => {
    await db.workouts.clear();
    await db.measurements.clear();
    await db.reflections.clear();
    await db.settings.clear();
    await db.workouts.bulkPut(payload.workouts);
    await db.measurements.bulkPut(payload.measurements ?? []);
    await db.reflections.bulkPut(payload.reflections ?? []);
    await db.settings.put(payload.settings ?? defaultSettings());
  });
};

export const resetAllData = async () => {
  await db.transaction('rw', db.workouts, db.measurements, db.reflections, db.settings, async () => {
    await db.workouts.clear();
    await db.measurements.clear();
    await db.reflections.clear();
    await db.settings.clear();
    await db.settings.put(defaultSettings());
    await db.workouts.bulkPut(generateWorkoutPlan());
  });
};
