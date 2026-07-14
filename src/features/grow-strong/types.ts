export type WorkoutType =
  | 'Strength A'
  | 'Strength B'
  | 'Strength C'
  | 'Yoga + Walk'
  | 'Recovery Walk'
  | 'Optional'
  | 'Rest';

export type WorkoutDay = {
  id: string;
  week: number;
  day: string;
  phase: string;
  type: WorkoutType;
  focus: string;
  exercises: string[];
  setsReps: string;
  warmUp?: string[];
  coolDown?: string[];
  effortTarget?: string;
  walkingTarget?: string;
  coachNote?: string;
  itemCompletions?: Record<string, boolean>;
  warmUpPrescriptions?: string[];
  workoutPrescriptions?: string[];
  coolDownPrescriptions?: string[];
  completed: boolean;
  rpe?: number;
  elbowPain?: number;
  notes?: string;
  completedAt?: string;
};

export type Exercise = {
  id: string;
  name: string;
  category: string;
  difficulty: 'Beginner' | 'Medium' | 'Harder';
  elbowLoad: 'None' | 'Low' | 'Medium' | 'Avoid if sore';
  howTo: string;
  formCues: string[];
  commonMistakes: string[];
  easier: string;
  harder: string;
  substitute: string;
};

export type Measurement = {
  id: string;
  date: string;
  weight?: number;
  waist?: number;
  hips?: number;
  thigh?: number;
  arm?: number;
  notes?: string;
};

export type WeeklyReflection = {
  id: string;
  week: number;
  energy?: number;
  sleep?: number;
  soreness?: number;
  mood?: number;
  biggestWin?: string;
  whatFeltHard?: string;
  nextWeekFocus?: string;
};

export type AppSettings = {
  id: 'settings';
  startDate: string;
  darkMode: boolean;
  programVersion?: number;
};

export type BackupPayload = {
  version: 1;
  exportedAt: string;
  workouts: WorkoutDay[];
  measurements: Measurement[];
  reflections: WeeklyReflection[];
  settings: AppSettings;
};
