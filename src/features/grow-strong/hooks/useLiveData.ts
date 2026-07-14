import { useEffect, useState } from 'react';
import type { AppSettings, Measurement, WeeklyReflection, WorkoutDay } from '../types';
import { db, defaultSettings } from '../db';

export function useLiveData() {
  const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [reflections, setReflections] = useState<WeeklyReflection[]>([]);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings());
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      const [workoutRows, measurementRows, reflectionRows, storedSettings] = await Promise.all([
        db.workouts.orderBy('id').toArray(),
        db.measurements.orderBy('date').toArray(),
        db.reflections.orderBy('week').toArray(),
        db.settings.get('settings')
      ]);
      if (!alive) return;
      setWorkouts(workoutRows.sort((a, b) => a.week - b.week || dayOrder(a.day) - dayOrder(b.day)));
      setMeasurements(measurementRows);
      setReflections(reflectionRows);
      setSettings(storedSettings ?? defaultSettings());
    };
    load();
    return () => {
      alive = false;
    };
  }, [refreshKey]);

  return {
    workouts,
    measurements,
    reflections,
    settings,
    refresh: () => setRefreshKey((value) => value + 1)
  };
}

const order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const dayOrder = (day: string) => order.indexOf(day);
