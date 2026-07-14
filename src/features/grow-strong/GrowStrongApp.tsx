import { useEffect, useState } from 'react';
import {
  Activity,
  CalendarDays,
  Check,
  ChevronDown,
  Download,
  Dumbbell,
  Flame,
  Heart,
  HeartPulse,
  Home,
  Moon,
  RotateCcw,
  Search,
  Settings,
  Sparkles,
  Upload,
  Utensils,
  X
} from 'lucide-react';
import { db, exportBackup, importBackup, resetAllData } from './db';
import { coolDownPrescriptionFor, elbowRules, exerciseById, exercises, milestones, mobilityPrescriptionFor, phases, warmUpPrescriptionFor, workoutPrescriptionFor } from './data/program';
import { useLiveData } from './hooks/useLiveData';
import type { BackupPayload, Exercise, WeeklyReflection, WorkoutDay } from './types';
import { downloadJson } from './utils/file';
import { currentWeekFromSettings, earnedMilestone, getTodayWorkout, phaseDetails, streakCount, weeklyProgress } from './utils/progress';

type Route = 'dashboard' | 'plan' | 'exercises' | 'progress' | 'nutrition' | 'settings';

const navItems: Array<{ route: Route; label: string; icon: typeof Home }> = [
  { route: 'dashboard', label: 'Today', icon: Home },
  { route: 'plan', label: 'Plan', icon: CalendarDays },
  { route: 'exercises', label: 'Moves', icon: Dumbbell },
  { route: 'progress', label: 'Feel', icon: Heart },
  { route: 'nutrition', label: 'Food', icon: Utensils },
  { route: 'settings', label: 'Settings', icon: Settings }
];

export default function GrowStrongApp() {
  const [route, setRouteState] = useState<Route>('dashboard');
  const [activeWorkoutId, setActiveWorkoutId] = useState<string | null>(null);
  const data = useLiveData();
  const week = currentWeekFromSettings(data.settings);
  const activeWorkout = data.workouts.find((workout) => workout.id === activeWorkoutId);
  const setRoute = (nextRoute: Route) => {
    setRouteState(nextRoute);
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [activeWorkoutId]);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-28 pt-6 text-moon-text sm:px-6 lg:pb-8">
        {!activeWorkout && <Header route={route} />}
        <main className="mt-6 min-w-0 flex-1 overflow-x-hidden">
          {activeWorkout ? (
            <WorkoutDetail workout={activeWorkout} refresh={data.refresh} onClose={() => setActiveWorkoutId(null)} />
          ) : (
            <>
              {route === 'dashboard' && <Dashboard {...data} currentWeek={week} openWorkout={setActiveWorkoutId} />}
              {route === 'plan' && <Plan workouts={data.workouts} currentWeek={week} refresh={data.refresh} openWorkout={setActiveWorkoutId} />}
              {route === 'exercises' && <ExerciseLibrary />}
              {route === 'progress' && (
                <Progress reflections={data.reflections} workouts={data.workouts} currentWeek={week} refresh={data.refresh} />
              )}
              {route === 'nutrition' && <Nutrition />}
              {route === 'settings' && <SettingsPage settings={data.settings} refresh={data.refresh} />}
            </>
          )}
        </main>
      </div>
      {!activeWorkout && <BottomNav route={route} setRoute={setRoute} />}
    </div>
  );
}

function Header({ route }: { route: Route }) {
  const subtitles: Record<Route, string> = {
    dashboard: 'Gentle strength, clearly planned.',
    plan: 'Twenty-four weeks, one kind choice at a time.',
    exercises: 'Pain-free options before pride.',
    progress: 'Track how this feels, not what you weigh.',
    nutrition: 'Protein first. Practical ideas. No guilt.',
    settings: 'Your app, your local data.'
  };
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <header className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-moon-muted/60">
          <Moon size={13} aria-hidden="true" />
          <span>Grow Strong</span>
          <span className="opacity-30">·</span>
          <span className="normal-case tracking-normal font-medium opacity-75">{dateStr}</span>
        </div>
        <h1 className="mt-2.5 font-display text-[2.6rem] leading-[1.08] tracking-[-0.01em] sm:text-5xl">
          {route === 'dashboard' ? 'Today' : titleForRoute(route)}
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-moon-muted/75">{subtitles[route]}</p>
      </div>
    </header>
  );
}

function BottomNav({ route, setRoute }: { route: Route; setRoute: (route: Route) => void }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-moon-border/50 bg-[#FFFCF4]/93 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-xl lg:left-1/2 lg:max-w-3xl lg:-translate-x-1/2 lg:rounded-t-3xl lg:border-x"
      style={{ boxShadow: '0 -6px 32px rgba(71, 44, 89, 0.06)' }}
    >
      <div className="flex items-start justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = route === item.route;
          return (
            <button
              key={item.route}
              type="button"
              onClick={() => setRoute(item.route)}
              className="no-active-scale flex flex-col items-center gap-1 px-2 py-1.5"
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                  active ? 'bg-moon-surface/80 text-[#8B6AAF]' : 'text-moon-muted/45'
                }`}
                style={active ? { boxShadow: '0 2px 12px rgba(191, 162, 220, 0.18)' } : undefined}
              >
                <Icon size={active ? 21 : 20} aria-hidden="true" />
              </span>
              <span
                className={`text-[10px] font-semibold leading-none transition-colors duration-200 ${
                  active ? 'text-[#8B6AAF]' : 'text-moon-muted/40'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function Dashboard({
  workouts,
  settings,
  currentWeek,
  refresh,
  openWorkout
}: ReturnType<typeof useLiveData> & { currentWeek: number; openWorkout: (id: string) => void }) {
  const today = getTodayWorkout(workouts, settings);
  const progress = weeklyProgress(workouts, currentWeek);
  const phase = phaseDetails(currentWeek);
  const streak = streakCount(workouts);
  const milestone = earnedMilestone(workouts);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
      <section className="overflow-hidden rounded-[2rem] border border-moon-border/40 bg-white shadow-soft">
        <div className="bg-gradient-to-br from-[#F4EAFF] via-[#EDE0FA] to-[#D8C8F5]/50 p-5">
          <div className="flex items-center justify-between gap-3">
            <Pill icon={Sparkles} text={`Week ${currentWeek} · ${phase.name}`} />
            <ProgressRing percent={progress.percent} />
          </div>
          <h2 className="mt-4 font-display text-3xl leading-tight tracking-[-0.01em]">{today?.type ?? 'Plan loading'}</h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-moon-muted/75">{today?.focus}</p>
        </div>
        {today && (
          <div className="p-5">
            <div className="rounded-[1.5rem] border border-moon-border/35 bg-moon-bg/50 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-moon-muted/55">{today.day}</p>
              <p className="mt-2 text-[15px] font-semibold leading-snug">{today.setsReps}</p>
              {today.effortTarget && <p className="mt-1.5 text-[13px] text-moon-muted/65">{today.effortTarget}</p>}
              <TodayItemList workout={today} refresh={refresh} />
              <button
                type="button"
                onClick={() => openWorkout(today.id)}
                className="mt-4 min-h-12 w-full rounded-2xl bg-white/80 px-4 text-[13px] font-semibold text-moon-text transition hover:bg-white"
                style={{ boxShadow: '0 2px 10px rgba(71, 44, 89, 0.06)' }}
              >
                Notes, pain, and details
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="grid gap-4">
        <MetricCard icon={Flame} label="Streak" value={`${streak} day${streak === 1 ? '' : 's'}`} detail="Today's win does not have to be dramatic." />
        <MetricCard icon={Activity} label="This week" value={`${progress.completed}/${progress.total}`} detail="Each checked item counts. Split it up however the day allows." />
        <div className="rounded-[2rem] border border-moon-border/35 bg-moon-surface/60 p-5 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-moon-muted/55">Next action</p>
          <h3 className="mt-2.5 text-[17px] font-bold leading-snug">
            {progress.percent === 100 ? 'Let recovery do its work.' : today?.completed ? 'Write how it felt.' : 'Pick one item that feels doable.'}
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-moon-muted/60">No sharp elbow pain. We are building strength, not collecting injuries.</p>
        </div>
        {milestone && (
          <div className="rounded-[2rem] border border-moon-border/35 bg-white p-5 shadow-soft">
            <Pill icon={Moon} text="Milestone earned" />
            <h3 className="mt-3 font-display text-2xl leading-tight">{milestone.label}</h3>
          </div>
        )}
      </section>
    </div>
  );
}

function Plan({
  workouts,
  currentWeek,
  refresh,
  openWorkout
}: {
  workouts: WorkoutDay[];
  currentWeek: number;
  refresh: () => void;
  openWorkout: (id: string) => void;
}) {
  const [week, setWeek] = useState(currentWeek);
  const weekRows = workouts.filter((workout) => workout.week === week);
  const progress = weeklyProgress(workouts, week);
  const phase = phaseDetails(week);

  return (
    <div className="grid gap-4 lg:grid-cols-[20rem_1fr]">
      <aside className="rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft lg:sticky lg:top-4 lg:self-start">
        <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-moon-muted/55" htmlFor="week-select">
          Week
        </label>
        <div className="relative mt-2">
          <select
            id="week-select"
            value={week}
            onChange={(event) => setWeek(Number(event.target.value))}
            className="min-h-12 w-full appearance-none rounded-2xl border border-moon-border/40 bg-moon-bg px-4 text-[15px] font-semibold"
          >
            {Array.from({ length: 24 }, (_, index) => index + 1).map((weekNumber) => (
              <option key={weekNumber} value={weekNumber}>
                Week {weekNumber}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-3.5 text-moon-muted/40" size={17} aria-hidden="true" />
        </div>
        <div className="mt-5 flex items-start gap-4">
          <ProgressRing percent={progress.percent} />
          <div className="min-w-0">
            <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">{phase.name}</h2>
            <p className="mt-1 text-[13px] leading-relaxed text-moon-muted/65">{phase.focus}</p>
          </div>
        </div>
      </aside>
      <section className="grid gap-4">
        {weekRows.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} refresh={refresh} openWorkout={openWorkout} />
        ))}
      </section>
    </div>
  );
}

function WorkoutCard({ workout, refresh, openWorkout }: { workout: WorkoutDay; refresh: () => void; openWorkout: (id: string) => void }) {
  const update = async (patch: Partial<WorkoutDay>) => {
    await db.workouts.update(workout.id, patch);
    refresh();
  };
  const toggleWholeDay = async () => {
    const items = checklistItems(workout);
    const complete = !workout.completed;
    await update({
      itemCompletions: complete ? itemCompletionMap(items, true) : itemCompletionMap(items, false),
      completed: complete,
      completedAt: complete ? (workout.completedAt ?? new Date().toISOString()) : undefined
    });
  };

  return (
    <article className="rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft transition-shadow duration-200 hover:shadow-[0_20px_48px_rgba(71,44,89,0.11)]">
      <div className="flex items-start justify-between gap-3">
        <button type="button" onClick={() => openWorkout(workout.id)} className="no-active-scale min-w-0 flex-1 text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-moon-muted/50">{workout.day}</p>
          <h3 className="mt-1.5 font-display text-2xl leading-tight tracking-[-0.01em]">{workout.type}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-moon-muted/65">{workout.focus}</p>
          <p className="mt-3 text-[11px] font-semibold text-moon-muted/45">
            {checkedCount(workout)} of {checklistItems(workout).length} done
          </p>
        </button>
        <button
          type="button"
          onClick={toggleWholeDay}
          className={`no-active-scale grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition-all duration-200 ${
            workout.completed
              ? 'bg-moon-accent text-white'
              : 'border border-moon-border/55 bg-moon-bg text-transparent'
          }`}
          style={workout.completed ? { boxShadow: '0 4px 16px rgba(191, 162, 220, 0.42)' } : undefined}
          aria-label={workout.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          <Check size={20} className={workout.completed ? 'opacity-100' : 'opacity-0'} aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => openWorkout(workout.id)}
        className="no-active-scale mt-4 w-full rounded-2xl bg-moon-bg/60 p-4 text-left transition hover:bg-moon-bg"
      >
        <p className="text-[13px] font-semibold leading-snug">{workout.setsReps}</p>
        <p className="mt-1.5 text-[11px] text-moon-muted/50">Tap for warm-up, item checkoffs, and instructions.</p>
      </button>
    </article>
  );
}

type ChecklistItem = {
  key: string;
  label: string;
  section: 'Warm-up' | 'Workout' | 'Walk' | 'Cool-down' | 'Rest';
  exerciseId?: string;
};

function ChecklistRow({
  item,
  done,
  onToggle,
  onSelect,
  hasExercise
}: {
  item: ChecklistItem;
  done: boolean;
  onToggle: () => void;
  onSelect: () => void;
  hasExercise: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-2xl border p-2.5 transition-all duration-200 ${
        done
          ? 'border-moon-accent/20 bg-moon-surface/25'
          : 'border-moon-border/35 bg-white/55'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className={`no-active-scale grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-all duration-200 ${
          done
            ? 'bg-moon-accent text-white'
            : 'border border-moon-border/55 bg-white text-transparent'
        }`}
        style={done ? { boxShadow: '0 2px 10px rgba(191, 162, 220, 0.38)' } : undefined}
        aria-label={done ? `Uncheck ${item.label}` : `Check off ${item.label}`}
      >
        {done && <Check size={17} className="check-icon" aria-hidden="true" />}
      </button>
      <button
        type="button"
        onClick={onSelect}
        className="no-active-scale min-h-10 flex-1 text-left"
        disabled={!hasExercise}
      >
        <span
          className={`block text-[13px] font-semibold transition-all duration-200 ${
            done ? 'text-moon-muted/45 line-through decoration-moon-accent/35' : ''
          }`}
        >
          {item.label}
        </span>
      </button>
    </div>
  );
}

function TodayItemList({ workout, refresh }: { workout: WorkoutDay; refresh: () => void }) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const items = checklistItems(workout);

  const toggleItem = async (item: ChecklistItem) => {
    const currentCompletions = workout.completed && !workout.itemCompletions ? itemCompletionMap(items, true) : (workout.itemCompletions ?? {});
    const nextCompletions = { ...currentCompletions, [item.key]: !itemIsDone(workout, item) };
    const allDone = items.length > 0 && items.every((entry) => nextCompletions[entry.key]);
    await db.workouts.update(workout.id, {
      itemCompletions: nextCompletions,
      completed: allDone,
      completedAt: allDone ? (workout.completedAt ?? new Date().toISOString()) : undefined
    });
    refresh();
  };

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-moon-muted/55">Today's list</p>
        <span className="rounded-full bg-white/70 px-2.5 py-1 text-[11px] font-bold text-moon-muted/60">
          {checkedCount(workout)}/{items.length}
        </span>
      </div>
      <p className="mt-1 text-[12px] leading-relaxed text-moon-muted/50">Pick anything when you feel like it. No required order.</p>
      <div className="mt-3 grid gap-2">
        {items.map((item) => {
          const done = itemIsDone(workout, item);
          const exercise = item.exerciseId ? exerciseById.get(item.exerciseId) : undefined;
          return (
            <ChecklistRow
              key={item.key}
              item={item}
              done={done}
              onToggle={() => toggleItem(item)}
              onSelect={() => exercise && setSelectedExercise(exercise)}
              hasExercise={!!exercise}
            />
          );
        })}
      </div>
      {selectedExercise && <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
    </div>
  );
}

function WorkoutDetail({ workout, refresh, onClose }: { workout: WorkoutDay; refresh: () => void; onClose: () => void }) {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [notes, setNotes] = useState(workout.notes ?? '');
  const items = checklistItems(workout);
  const completeCount = checkedCount(workout);
  const percent = items.length ? Math.round((completeCount / items.length) * 100) : workout.completed ? 100 : 0;

  const updateWorkout = async (patch: Partial<WorkoutDay>) => {
    await db.workouts.update(workout.id, patch);
    refresh();
  };

  const toggleItem = async (item: ChecklistItem) => {
    const currentCompletions = workout.completed && !workout.itemCompletions ? itemCompletionMap(items, true) : (workout.itemCompletions ?? {});
    const nextCompletions = { ...currentCompletions, [item.key]: !itemIsDone(workout, item) };
    const allDone = items.length > 0 && items.every((entry) => nextCompletions[entry.key]);
    await updateWorkout({
      itemCompletions: nextCompletions,
      completed: allDone,
      completedAt: allDone ? (workout.completedAt ?? new Date().toISOString()) : undefined
    });
  };

  const markAllDone = async () => {
    const nextCompletions = Object.fromEntries(items.map((item) => [item.key, true]));
    await updateWorkout({
      itemCompletions: nextCompletions,
      completed: true,
      completedAt: workout.completedAt ?? new Date().toISOString()
    });
  };

  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4">
      <button
        type="button"
        onClick={onClose}
        className="no-active-scale inline-flex min-h-11 w-fit items-center justify-center rounded-2xl border border-moon-border/45 bg-white px-4 text-[13px] font-semibold text-moon-muted shadow-soft"
      >
        Back to plan
      </button>

      <section
        className="overflow-hidden rounded-[2rem] border border-moon-border/30 bg-[#FFFCF4] shadow-soft"
        aria-label={`${workout.day} ${workout.type}`}
      >
        <div className="bg-gradient-to-br from-[#F4EAFF] via-[#EDE0FA] to-[#D8C8F5]/50 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Pill icon={Sparkles} text={`Week ${workout.week} · ${workout.phase}`} />
              <h2 className="mt-3 font-display text-3xl leading-tight tracking-[-0.01em] sm:text-4xl">{workout.type}</h2>
              <p className="mt-1.5 text-[13px] text-moon-muted/65">
                {workout.day} · Use this as a running checklist throughout the day.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/70 text-moon-muted transition hover:bg-white"
              style={{ boxShadow: '0 2px 8px rgba(71, 44, 89, 0.08)' }}
              aria-label="Close workout"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div
            className="rounded-2xl border border-moon-border/25 bg-white p-4"
            style={{ boxShadow: '0 2px 10px rgba(71, 44, 89, 0.05)' }}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-[13px] font-semibold">{completeCount} of {items.length} items checked</p>
              <p className="text-[13px] font-bold text-moon-accent">{percent}%</p>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-moon-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-moon-accent to-[#D4B8F0] transition-all duration-700 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          <div className="mt-4 grid gap-3">
            <MiniBlock title="Plan for today" body={workout.setsReps} />
            {workout.effortTarget && <MiniBlock title="Effort target" body={workout.effortTarget} />}
            {workout.coachNote && <MiniBlock title="Coach's note" body={workout.coachNote} />}
          </div>

          <div
            className="mt-4 grid gap-3 rounded-2xl border border-moon-border/25 bg-white p-4 sm:grid-cols-2"
            style={{ boxShadow: '0 2px 10px rgba(71, 44, 89, 0.05)' }}
          >
            <NumberInput label="Effort rating" min={1} max={10} value={workout.rpe} onChange={(value) => updateWorkout({ rpe: value })} />
            <NumberInput label="Elbow pain" min={0} max={10} value={workout.elbowPain} onChange={(value) => updateWorkout({ elbowPain: value })} />
            <div className="sm:col-span-2">
              <ElbowNote value={workout.elbowPain} />
            </div>
            <label className="block sm:col-span-2" htmlFor={`${workout.id}-detail-notes`}>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-moon-muted/55">Notes</span>
              <textarea
                id={`${workout.id}-detail-notes`}
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                onBlur={() => updateWorkout({ notes })}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-moon-border/35 bg-moon-bg p-3 text-[13px] leading-relaxed"
                placeholder="Use this for split-up sessions, swaps, or what felt different."
              />
            </label>
          </div>

          <div className="mt-5 grid gap-2">
            {items.map((item) => {
              const done = itemIsDone(workout, item);
              const exercise = item.exerciseId ? exerciseById.get(item.exerciseId) : undefined;
              return (
                <ChecklistRow
                  key={item.key}
                  item={item}
                  done={done}
                  onToggle={() => toggleItem(item)}
                  onSelect={() => exercise && setSelectedExercise(exercise)}
                  hasExercise={!!exercise}
                />
              );
            })}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={markAllDone}
              className="min-h-12 rounded-2xl bg-moon-accent px-4 text-[13px] font-bold text-white transition"
              style={{ boxShadow: '0 4px 18px rgba(191, 162, 220, 0.42)' }}
            >
              Mark all done
            </button>
            <button
              type="button"
              onClick={onClose}
              className="min-h-12 rounded-2xl border border-moon-border/50 bg-white px-4 text-[13px] font-semibold text-moon-muted transition hover:border-moon-border"
            >
              Done for now
            </button>
          </div>
        </div>
      </section>
      {selectedExercise && <ExerciseModal exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />}
    </div>
  );
}

function ExerciseLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [load, setLoad] = useState('All');
  const [selected, setSelected] = useState<Exercise | null>(null);
  const categories = ['All', ...Array.from(new Set(exercises.map((exercise) => exercise.category)))];
  const loads = ['All', 'None', 'Low', 'Medium', 'Avoid if sore'];
  const filtered = exercises.filter((exercise) => {
    const matchesQuery = `${exercise.name} ${exercise.category}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (category === 'All' || exercise.category === category) && (load === 'All' || exercise.elbowLoad === load);
  });

  return (
    <>
      <div className="grid gap-3 rounded-[2rem] border border-moon-border/40 bg-white p-4 shadow-soft sm:grid-cols-3">
        <label className="relative sm:col-span-1">
          <span className="sr-only">Search exercises</span>
          <Search className="absolute left-4 top-3.5 text-moon-muted/35" size={17} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="min-h-12 w-full rounded-2xl border border-moon-border/40 bg-moon-bg pl-11 pr-4 text-[13px]"
            placeholder="Search moves"
          />
        </label>
        <Select label="Category" value={category} options={categories} onChange={setCategory} />
        <Select label="Elbow load" value={load} options={loads} onChange={setLoad} />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exercise) => (
          <button
            key={exercise.id}
            type="button"
            onClick={() => setSelected(exercise)}
            className="no-active-scale min-h-40 rounded-[2rem] border border-moon-border/40 bg-white p-5 text-left shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_48px_rgba(71,44,89,0.12)]"
          >
            <Pill icon={HeartPulse} text={exercise.elbowLoad} />
            <h2 className="mt-4 font-display text-xl leading-tight tracking-[-0.01em]">{exercise.name}</h2>
            <p className="mt-2 text-[13px] text-moon-muted/60">{exercise.category} · {exercise.difficulty}</p>
          </button>
        ))}
      </div>
      {selected && <ExerciseModal exercise={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function ExerciseModal({ exercise, onClose }: { exercise: Exercise; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-[#FFFCF4] p-4 text-moon-text sm:bg-[#1D1424]/38 sm:p-6 sm:backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={exercise.name}
    >
      <div
        className="mx-auto min-h-[calc(100dvh-2rem)] w-full max-w-2xl overflow-hidden rounded-[2rem] border border-moon-border/30 bg-white sm:min-h-0"
        style={{ boxShadow: '0 32px 80px rgba(71, 44, 89, 0.18)' }}
      >
        <div className="bg-gradient-to-br from-[#F4EAFF] to-[#EDE0FA]/60 p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Pill icon={HeartPulse} text={`Elbow load: ${exercise.elbowLoad}`} />
              <h2 className="mt-3 font-display text-3xl leading-tight tracking-[-0.01em]">{exercise.name}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-white/70 text-moon-muted transition hover:bg-white"
              aria-label="Close"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="p-5">
          <DetailBlock title="How to do it" body={exercise.howTo} />
          <DetailList title="Form cues" items={exercise.formCues} />
          <DetailList title="Common mistakes" items={exercise.commonMistakes} />
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniBlock title="Easier" body={exercise.easier} />
            <MiniBlock title="Harder" body={exercise.harder} />
            <MiniBlock title="Substitute" body={exercise.substitute} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Progress({
  reflections,
  workouts,
  currentWeek,
  refresh
}: {
  reflections: WeeklyReflection[];
  workouts: WorkoutDay[];
  currentWeek: number;
  refresh: () => void;
}) {
  const currentProgress = weeklyProgress(workouts, currentWeek);
  const dailyRows = dailyProgressRows(workouts, currentWeek);
  const weeklyRows = Array.from({ length: 24 }, (_, index) => {
    const week = index + 1;
    const progress = weeklyProgress(workouts, week);
    return { label: `W${week}`, value: progress.percent, detail: `${progress.completed}/${progress.total}` };
  });
  const exerciseTotals = movementTotals(workouts);
  const walkCount = exerciseTotals.find((row) => row.id === 'walking')?.count ?? 0;
  const checkedItems = workouts.reduce((sum, workout) => sum + completedItemsForWorkout(workout), 0);
  const feelingRows = reflections
    .filter((reflection) => reflection.energy || reflection.sleep || reflection.soreness || reflection.mood)
    .map((reflection) => ({
      label: `W${reflection.week}`,
      energy: reflection.energy,
      sleep: reflection.sleep,
      soreness: reflection.soreness,
      mood: reflection.mood
    }));

  return (
    <div className="grid min-w-0 max-w-full gap-4 overflow-x-hidden lg:grid-cols-[minmax(0,1fr)_22rem]">
      <section className="grid min-w-0 gap-4">
        <section className="min-w-0 overflow-hidden rounded-[2rem] border border-moon-border/40 bg-white shadow-soft">
          <div className="bg-gradient-to-br from-[#F4EAFF] via-[#EDE0FA] to-[#D8C8F5]/50 p-5">
            <Pill icon={Heart} text="Proof, not pressure" />
            <h2 className="mt-4 font-display text-3xl leading-tight tracking-[-0.01em]">Your progress is showing.</h2>
            <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-moon-muted/70">
              No weigh-ins. No measurements. Just the daily receipts: checked items, walks, and moves you keep coming back to.
            </p>
          </div>
        </section>

        <div className="grid min-w-0 gap-3 sm:grid-cols-3">
          <ProgressStat label="This week" value={`${currentProgress.percent}%`} detail={`${currentProgress.completed}/${currentProgress.total} items checked`} />
          <ProgressStat label="All checkoffs" value={`${checkedItems}`} detail="Every small box counts." />
          <ProgressStat label="Walks" value={`${walkCount}`} detail="Logged from walk items." />
        </div>

        <DailyCompletionChart rows={dailyRows} />
        <MovementTotals rows={exerciseTotals} />
        <WeeklyProgressChart rows={weeklyRows} />
        <FeelingTrend rows={feelingRows} />
      </section>
      <aside className="grid min-w-0 gap-4 self-start">
        <ReflectionForm currentWeek={currentWeek} reflections={reflections} refresh={refresh} />
      </aside>
    </div>
  );
}

function ProgressStat({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="min-w-0 rounded-[2rem] border border-moon-border/40 bg-white p-4 shadow-soft">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-moon-muted/50">{label}</p>
      <p className="mt-2 font-display text-3xl leading-none tracking-[-0.01em]">{value}</p>
      <p className="mt-2 text-[12px] leading-relaxed text-moon-muted/60">{detail}</p>
    </div>
  );
}

function DailyCompletionChart({ rows }: { rows: Array<{ label: string; type: string; value: number; completed: number; total: number }> }) {
  return (
    <section className="min-w-0 rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">Daily completion</h2>
          <p className="mt-1 text-[12px] leading-relaxed text-moon-muted/55">Percentage of each day’s checklist you’ve actually checked off.</p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-7 items-end gap-1.5">
        {rows.map((row) => {
          const height = row.total ? Math.max(6, row.value) : 0;
          return (
            <div key={row.label} className="min-w-0">
              <div className="flex h-32 items-end overflow-hidden rounded-full bg-moon-bg">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-moon-accent to-[#D4B8F0]/65 transition-all duration-700 ease-out"
                  style={{ height: `${height}%` }}
                />
              </div>
              <div className="mt-2 text-center">
                <p className="text-[9px] font-black uppercase tracking-[0.08em] text-moon-muted/45">{row.label}</p>
                <p className="mt-0.5 text-[10px] font-bold text-moon-text">{row.value}%</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 grid gap-1.5">
        {rows.map((row) => (
          <div key={`${row.label}-detail`} className="flex min-w-0 items-center justify-between gap-3 rounded-xl bg-moon-bg/55 px-3 py-2">
            <span className="min-w-0 truncate text-[12px] font-semibold">{row.label} · {row.type}</span>
            <span className="shrink-0 text-[12px] font-bold text-moon-accent">{row.completed}/{row.total}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function MovementTotals({ rows }: { rows: Array<{ id: string; name: string; count: number }> }) {
  const topRows = rows.slice(0, 8);
  const max = Math.max(1, ...topRows.map((row) => row.count));

  return (
    <section className="min-w-0 rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
      <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">Moves you’ve done</h2>
      <p className="mt-1 text-[12px] leading-relaxed text-moon-muted/55">Counts checked items, including walks and mobility.</p>
      <div className="mt-4 grid gap-2">
        {topRows.map((row) => (
          <div key={row.id} className="min-w-0 rounded-2xl bg-moon-bg/55 p-3">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-[13px] font-bold">{row.name}</p>
              <p className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-moon-accent">{row.count}</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-gradient-to-r from-moon-accent to-[#D4B8F0]/70"
                style={{ width: `${Math.max(8, Math.round((row.count / max) * 100))}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      {topRows.length === 0 && (
        <p className="mt-4 rounded-2xl bg-moon-bg/55 p-4 text-[13px] leading-relaxed text-moon-muted/60">
          Check off a few items and your most repeated moves will show up here.
        </p>
      )}
    </section>
  );
}

function WeeklyProgressChart({ rows }: { rows: Array<{ label: string; value: number; detail: string }> }) {
  return (
    <section className="min-w-0 rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
      <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">Program progress</h2>
      <div className="no-scrollbar -mx-2 mt-5 flex max-w-[calc(100vw-2rem)] items-end gap-1.5 overflow-x-auto px-2 pb-2 sm:mx-0 sm:max-w-full sm:px-0">
        {rows.map((row) => (
          <div key={row.label} className="flex w-7 shrink-0 flex-col items-center gap-2">
            <div className="flex h-28 w-full items-end overflow-hidden rounded-full bg-moon-bg">
              <div
                className="w-full rounded-full bg-gradient-to-t from-moon-accent to-[#D4B8F0]/65 transition-all duration-700 ease-out"
                style={{ height: `${Math.max(5, row.value)}%` }}
              />
            </div>
            <span className="text-[9px] font-bold text-moon-muted/40">{row.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeelingTrend({ rows }: { rows: Array<{ label: string; energy?: number; sleep?: number; soreness?: number; mood?: number }> }) {
  const latest = rows[rows.length - 1];
  const cards = [
    { label: 'Energy', value: latest?.energy },
    { label: 'Sleep', value: latest?.sleep },
    { label: 'Soreness', value: latest?.soreness },
    { label: 'Mood', value: latest?.mood }
  ];

  return (
    <section className="min-w-0 rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
      <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">Latest check-in</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="min-w-0 rounded-2xl bg-moon-bg/60 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-moon-muted/50">{card.label}</p>
            <p className="mt-2 font-display text-4xl leading-none">{card.value ?? '–'}</p>
          </div>
        ))}
      </div>
      {rows.length === 0 && (
        <p className="mt-4 text-[13px] text-moon-muted/60">Save a weekly check-in and this will start to show patterns.</p>
      )}
    </section>
  );
}

function ReflectionForm({ currentWeek, reflections, refresh }: { currentWeek: number; reflections: WeeklyReflection[]; refresh: () => void }) {
  const existing = reflections.find((reflection) => reflection.week === currentWeek);
  const [energy, setEnergy] = useState(existing?.energy ?? 5);
  const [sleep, setSleep] = useState(existing?.sleep ?? 5);
  const [soreness, setSoreness] = useState(existing?.soreness ?? 3);
  const [mood, setMood] = useState(existing?.mood ?? 5);
  const [win, setWin] = useState(existing?.biggestWin ?? '');
  const [hard, setHard] = useState(existing?.whatFeltHard ?? '');
  const [focus, setFocus] = useState(existing?.nextWeekFocus ?? '');
  const save = async () => {
    await db.reflections.put({
      id: existing?.id ?? `week-${currentWeek}`,
      week: currentWeek,
      energy,
      sleep,
      soreness,
      mood,
      biggestWin: win,
      whatFeltHard: hard,
      nextWeekFocus: focus
    });
    refresh();
  };
  return (
    <div className="min-w-0 rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
      <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">Week {currentWeek} reflection</h2>
      <div className="mt-4 grid gap-3">
        <SliderInput label="Energy" value={energy} onChange={setEnergy} />
        <SliderInput label="Sleep" value={sleep} onChange={setSleep} />
        <SliderInput label="Soreness" value={soreness} onChange={setSoreness} />
        <SliderInput label="Mood" value={mood} onChange={setMood} />
        <TextArea label="Biggest win" value={win} onChange={setWin} placeholder="Today's win does not have to be dramatic." />
        <TextArea label="What felt hard" value={hard} onChange={setHard} placeholder="Name it without making it your personality." />
        <TextArea label="Next week focus" value={focus} onChange={setFocus} placeholder="Repeat, regress, or gently reach." />
        <button
          type="button"
          onClick={save}
          className="min-h-12 rounded-2xl bg-moon-accent px-4 text-[13px] font-bold text-white transition"
          style={{ boxShadow: '0 4px 18px rgba(191, 162, 220, 0.40)' }}
        >
          Save reflection
        </button>
      </div>
    </div>
  );
}

// ====================== NUTRITION DATA ======================

type MealTag = 'high-protein' | 'quick' | 'cozy' | 'fresh' | 'comfort' | 'vegetarian' | 'budget' | 'no-cook' | 'meal-prep' | 'takeout';
type CravingTag = 'savory' | 'cozy' | 'fresh' | 'pasta' | 'mexican' | 'chicken' | 'beef' | 'sweet' | 'light' | 'hungry' | 'comfort';

type MealCategory = 'breakfast' | 'lunch' | 'dinner' | 'snack';

type Meal = {
  id: string;
  name: string;
  emoji: string;
  category: MealCategory;
  protein: number;
  calories: number;
  fullness: number;
  prepTime: string;
  bestFor: string;
  portions: Partial<Record<'protein' | 'carbs' | 'veg' | 'fat' | 'fruit', string>>;
  proteinBoost: string;
  swap: string;
  tags: MealTag[];
  cravings: CravingTag[];
};

type PlateItem = { id: string; name: string; emoji: string; protein: number; calories: number };
type RestaurantCategory = 'burger' | 'chicken' | 'mexican' | 'sandwich' | 'coffee' | 'asian' | 'pizza' | 'casual' | 'healthy';
type Restaurant = { name: string; emoji: string; category: RestaurantCategory; best: string; balanced: string; treat: string };

const MEALS: Meal[] = [
  // ── BREAKFAST ──
  { id: 'egg-oatmeal', name: 'Eggs + Oatmeal', emoji: '🍳', category: 'breakfast', protein: 28, calories: 420, fullness: 4, prepTime: '15 min', bestFor: 'Before a workout', portions: { protein: 'Two or three eggs', carbs: 'Fist of oatmeal', fruit: 'Cupped hand of fruit' }, proteinBoost: 'Add a protein shake on the side', swap: 'Replace oatmeal with toast', tags: ['high-protein', 'cozy', 'budget', 'vegetarian'], cravings: ['cozy', 'savory', 'hungry'] },
  { id: 'greek-yogurt-bowl', name: 'Greek Yogurt Parfait', emoji: '🫙', category: 'breakfast', protein: 25, calories: 320, fullness: 3, prepTime: '5 min', bestFor: 'Quick breakfast', portions: { protein: 'Palm-sized cup of yogurt', carbs: 'Cupped hand of granola', fruit: 'Cupped hand of berries' }, proteinBoost: 'Add a scoop of protein powder', swap: 'Use cottage cheese instead of yogurt', tags: ['high-protein', 'quick', 'no-cook', 'vegetarian'], cravings: ['sweet', 'light', 'fresh'] },
  { id: 'cottage-cheese-toast', name: 'Cottage Cheese Toast', emoji: '🍞', category: 'breakfast', protein: 22, calories: 290, fullness: 3, prepTime: '5 min', bestFor: 'Light and quick start', portions: { protein: 'Palm of cottage cheese', carbs: 'Two slices of toast', fruit: 'Cupped hand of berries' }, proteinBoost: 'Add smoked salmon or a boiled egg', swap: 'Use ricotta instead', tags: ['quick', 'no-cook', 'vegetarian', 'budget'], cravings: ['fresh', 'light', 'sweet'] },
  { id: 'avocado-toast-eggs', name: 'Avocado Toast + Eggs', emoji: '🥚', category: 'breakfast', protein: 24, calories: 420, fullness: 4, prepTime: '10 min', bestFor: 'Relaxed weekend breakfast', portions: { protein: 'Two eggs', carbs: 'Two slices of toast', fat: 'Thumb of avocado', fruit: 'Cupped hand of cherry tomatoes' }, proteinBoost: 'Add smoked salmon or an extra egg', swap: 'Use cottage cheese instead of avocado', tags: ['fresh', 'quick', 'vegetarian'], cravings: ['savory', 'fresh', 'light'] },
  { id: 'overnight-oats', name: 'Overnight Oats', emoji: '🌾', category: 'breakfast', protein: 22, calories: 380, fullness: 4, prepTime: '5 min + overnight', bestFor: 'Grab-and-go morning', portions: { protein: 'Palm-sized scoop of protein powder', carbs: 'Fist of oats', fruit: 'Cupped hand of berries', fat: 'Thumb of nut butter' }, proteinBoost: 'Spoon Greek yogurt on top', swap: 'Use chia seeds instead of oats', tags: ['high-protein', 'meal-prep', 'vegetarian', 'budget', 'no-cook'], cravings: ['sweet', 'cozy', 'fresh'] },
  { id: 'protein-smoothie', name: 'Protein Smoothie', emoji: '🥤', category: 'breakfast', protein: 30, calories: 350, fullness: 3, prepTime: '5 min', bestFor: 'Quick breakfast on the go', portions: { protein: 'One scoop protein powder', carbs: 'Cupped hand of frozen banana', fruit: 'Cupped hand of berries', fat: 'Thumb of nut butter' }, proteinBoost: 'Blend in Greek yogurt or cottage cheese', swap: 'Use collagen peptides instead of protein powder', tags: ['high-protein', 'quick', 'no-cook', 'vegetarian', 'budget'], cravings: ['sweet', 'light', 'fresh'] },
  { id: 'breakfast-burrito', name: 'Breakfast Burrito', emoji: '🌯', category: 'breakfast', protein: 34, calories: 520, fullness: 5, prepTime: '15 min', bestFor: 'Before a long day', portions: { protein: 'Three eggs + palm of turkey sausage', carbs: 'One large tortilla', veg: 'Two handfuls peppers and onion', fat: 'Thumb of cheese' }, proteinBoost: 'Add black beans inside', swap: 'Use a lettuce wrap for lower carbs', tags: ['high-protein', 'comfort', 'cozy'], cravings: ['savory', 'comfort', 'hungry', 'mexican'] },

  // ── LUNCH ──
  { id: 'turkey-wrap', name: 'Turkey Avocado Wrap', emoji: '🌯', category: 'lunch', protein: 32, calories: 440, fullness: 4, prepTime: '10 min', bestFor: 'Quick lunch', portions: { protein: 'Palm of turkey', carbs: 'One tortilla wrap', veg: 'Two handfuls lettuce + tomato', fat: 'Thumb of avocado' }, proteinBoost: 'Add a side of cottage cheese', swap: 'Use a lettuce wrap instead of tortilla', tags: ['high-protein', 'quick', 'no-cook'], cravings: ['savory', 'fresh', 'hungry'] },
  { id: 'tuna-salad', name: 'Tuna Salad Bowl', emoji: '🥗', category: 'lunch', protein: 36, calories: 380, fullness: 3, prepTime: '5 min', bestFor: 'Fast protein, no cooking', portions: { protein: 'Palm of tuna', veg: 'Two handfuls greens', fat: 'Thumb of olive oil or avocado', fruit: 'Cupped hand of cherry tomatoes' }, proteinBoost: 'Add a boiled egg or white beans', swap: 'Use salmon or chicken instead', tags: ['high-protein', 'quick', 'no-cook', 'fresh'], cravings: ['fresh', 'light', 'savory'] },
  { id: 'burrito-bowl', name: 'Burrito Bowl', emoji: '🫕', category: 'lunch', protein: 38, calories: 560, fullness: 5, prepTime: '15 min', bestFor: 'Filling lunch', portions: { protein: 'Palm of chicken or beef', carbs: 'Fist of rice or beans', veg: 'Two handfuls peppers + lettuce', fat: 'Thumb of guacamole' }, proteinBoost: 'Double the protein, skip some rice', swap: 'Use cauliflower rice to lower carbs', tags: ['high-protein', 'meal-prep', 'takeout'], cravings: ['mexican', 'savory', 'hungry', 'comfort'] },
  { id: 'chicken-caesar', name: 'Chicken Caesar Salad', emoji: '🥗', category: 'lunch', protein: 38, calories: 430, fullness: 4, prepTime: '10 min', bestFor: 'Light but filling lunch', portions: { protein: 'Palm of grilled chicken', veg: 'Two handfuls romaine', carbs: 'Cupped hand of croutons', fat: 'Thumb of dressing' }, proteinBoost: 'Add a boiled egg or extra chicken', swap: 'Skip croutons, add chickpeas', tags: ['high-protein', 'fresh', 'quick'], cravings: ['fresh', 'savory', 'light', 'chicken'] },
  { id: 'turkey-soup', name: 'Turkey Veggie Soup', emoji: '🍲', category: 'lunch', protein: 30, calories: 320, fullness: 4, prepTime: '30 min', bestFor: 'Cozy and light', portions: { protein: 'Palm of turkey or chicken', veg: 'Two handfuls mixed veggies', carbs: 'Fist of beans or barley' }, proteinBoost: 'Add a boiled egg on the side', swap: 'Use lentils instead of turkey', tags: ['cozy', 'meal-prep', 'budget', 'comfort'], cravings: ['cozy', 'savory', 'light', 'comfort'] },
  { id: 'protein-sandwich', name: 'Turkey Club Sandwich', emoji: '🥪', category: 'lunch', protein: 35, calories: 480, fullness: 4, prepTime: '10 min', bestFor: 'Classic quick lunch', portions: { protein: 'Palm of turkey + two slices of bacon', carbs: 'Two slices whole grain bread', veg: 'Two handfuls lettuce + tomato', fat: 'Thumb of avocado or mayo' }, proteinBoost: 'Add string cheese or a cottage cheese side', swap: 'Use a lettuce wrap for lower carbs', tags: ['high-protein', 'quick', 'no-cook'], cravings: ['savory', 'hungry', 'fresh'] },
  { id: 'grain-bowl', name: 'Falafel Grain Bowl', emoji: '🫙', category: 'lunch', protein: 22, calories: 490, fullness: 4, prepTime: '15 min', bestFor: 'Plant-based and filling', portions: { protein: 'Palm of falafel or chickpeas', carbs: 'Fist of quinoa or farro', veg: 'Two handfuls cucumber + tomato + greens', fat: 'Thumb of hummus or tahini' }, proteinBoost: 'Add Greek yogurt sauce or a soft egg', swap: 'Add grilled chicken for more protein', tags: ['vegetarian', 'fresh', 'meal-prep'], cravings: ['fresh', 'savory', 'light'] },

  // ── DINNER ──
  { id: 'chicken-rice-bowl', name: 'Chicken Rice Bowl', emoji: '🍚', category: 'dinner', protein: 40, calories: 550, fullness: 5, prepTime: '20 min', bestFor: 'Good after a workout', portions: { protein: 'Palm of chicken', carbs: 'Fist of rice', veg: 'Two handfuls of veggies', fat: 'Thumb of avocado' }, proteinBoost: 'Add Greek yogurt sauce', swap: 'Use potatoes instead of rice', tags: ['high-protein', 'meal-prep'], cravings: ['savory', 'chicken', 'hungry'] },
  { id: 'salmon-sweet-potato', name: 'Salmon + Sweet Potato', emoji: '🐟', category: 'dinner', protein: 38, calories: 520, fullness: 5, prepTime: '25 min', bestFor: 'Recovery dinner', portions: { protein: 'Palm of salmon', carbs: 'Fist of sweet potato', veg: 'Two handfuls greens', fat: 'Thumb of olive oil' }, proteinBoost: 'Add a boiled egg on the side', swap: 'Use tilapia or shrimp instead', tags: ['high-protein', 'fresh'], cravings: ['savory', 'fresh', 'hungry'] },
  { id: 'pasta-chicken', name: 'Pasta with Chicken', emoji: '🍝', category: 'dinner', protein: 42, calories: 620, fullness: 5, prepTime: '25 min', bestFor: 'Big dinner or meal prep', portions: { protein: 'Palm of chicken', carbs: 'Fist of pasta', veg: 'Two handfuls spinach or broccoli', fat: 'Thumb of olive oil' }, proteinBoost: 'Add parmesan or cottage cheese sauce', swap: 'Use chickpea pasta for more protein', tags: ['high-protein', 'meal-prep', 'cozy', 'comfort'], cravings: ['pasta', 'cozy', 'comfort', 'hungry'] },
  { id: 'beef-stir-fry', name: 'Beef Stir-Fry', emoji: '🥩', category: 'dinner', protein: 44, calories: 580, fullness: 5, prepTime: '20 min', bestFor: 'High-protein weeknight dinner', portions: { protein: 'Palm of lean beef', carbs: 'Fist of rice or noodles', veg: 'Two handfuls mixed veggies', fat: 'Thumb of sesame oil' }, proteinBoost: 'Add edamame on the side', swap: 'Use tofu or chicken instead', tags: ['high-protein', 'meal-prep'], cravings: ['beef', 'savory', 'hungry'] },
  { id: 'shrimp-tacos', name: 'Shrimp Tacos', emoji: '🌮', category: 'dinner', protein: 33, calories: 460, fullness: 4, prepTime: '20 min', bestFor: 'Fun weeknight dinner', portions: { protein: 'Palm of shrimp', carbs: 'Two small tortillas', veg: 'Two handfuls slaw', fat: 'Thumb of sauce' }, proteinBoost: 'Add black beans or extra shrimp', swap: 'Use fish or chicken instead', tags: ['fresh', 'quick'], cravings: ['mexican', 'fresh', 'savory', 'light'] },
  { id: 'turkey-chili', name: 'Turkey Chili', emoji: '🥣', category: 'dinner', protein: 40, calories: 490, fullness: 5, prepTime: '35 min', bestFor: 'Cozy meal prep dinner', portions: { protein: 'Palm of turkey', carbs: 'Fist of beans', veg: 'Two handfuls peppers + tomatoes' }, proteinBoost: 'Top with Greek yogurt instead of sour cream', swap: 'Use ground beef or lentils', tags: ['high-protein', 'meal-prep', 'cozy', 'comfort', 'budget'], cravings: ['cozy', 'comfort', 'savory', 'hungry', 'beef'] },
  { id: 'steak-veggies', name: 'Steak + Roasted Veggies', emoji: '🥩', category: 'dinner', protein: 48, calories: 560, fullness: 5, prepTime: '25 min', bestFor: 'High-protein dinner', portions: { protein: 'Palm of lean steak', veg: 'Two handfuls roasted veggies', fat: 'Thumb of butter or olive oil', carbs: 'Fist of potatoes (optional)' }, proteinBoost: 'Add a side salad with cottage cheese dressing', swap: 'Use chicken thighs instead', tags: ['high-protein', 'comfort'], cravings: ['beef', 'savory', 'hungry', 'cozy'] },
  { id: 'lemon-chicken', name: 'Lemon Herb Chicken', emoji: '🍋', category: 'dinner', protein: 40, calories: 420, fullness: 4, prepTime: '25 min', bestFor: 'Clean and satisfying dinner', portions: { protein: 'Palm of chicken breast', veg: 'Two handfuls asparagus or zucchini', fat: 'Thumb of olive oil', carbs: 'Fist of rice or quinoa' }, proteinBoost: 'Add a Greek yogurt dipping sauce', swap: 'Use pork tenderloin instead', tags: ['high-protein', 'fresh', 'meal-prep'], cravings: ['fresh', 'savory', 'chicken', 'light'] },
  { id: 'sheet-pan-salmon', name: 'Sheet Pan Salmon', emoji: '🐠', category: 'dinner', protein: 36, calories: 480, fullness: 5, prepTime: '30 min', bestFor: 'Easy hands-off dinner', portions: { protein: 'Palm of salmon', veg: 'Two handfuls broccoli or green beans', fat: 'Thumb of olive oil', carbs: 'Fist of potatoes or rice' }, proteinBoost: 'Add a soft-boiled egg on the side', swap: 'Use chicken thighs instead', tags: ['high-protein', 'fresh', 'meal-prep'], cravings: ['fresh', 'savory', 'hungry'] },

  // ── SNACKS ──
  { id: 'apple-pb', name: 'Apple + Peanut Butter', emoji: '🍎', category: 'snack', protein: 8, calories: 220, fullness: 2, prepTime: '2 min', bestFor: 'Between meals or pre-workout', portions: { fruit: 'One apple', fat: 'Thumb of peanut butter' }, proteinBoost: 'Add string cheese or Greek yogurt on the side', swap: 'Use almond butter or sunflower butter', tags: ['quick', 'no-cook', 'vegetarian', 'budget', 'fresh'], cravings: ['sweet', 'light', 'fresh'] },
  { id: 'protein-shake', name: 'Protein Shake', emoji: '🥛', category: 'snack', protein: 30, calories: 220, fullness: 2, prepTime: '3 min', bestFor: 'Right after a workout', portions: { protein: 'One scoop protein powder', fruit: 'Cupped hand of frozen fruit (optional)' }, proteinBoost: 'Blend with Greek yogurt for extra protein', swap: 'Use collagen peptides instead', tags: ['high-protein', 'quick', 'no-cook', 'budget'], cravings: ['sweet', 'light'] },
  { id: 'hummus-veggies', name: 'Hummus + Veggies', emoji: '🥕', category: 'snack', protein: 8, calories: 180, fullness: 2, prepTime: '2 min', bestFor: 'Light snack, no prep needed', portions: { protein: 'Palm of hummus', veg: 'Two handfuls carrots, cucumber, peppers' }, proteinBoost: 'Add a hard-boiled egg or string cheese', swap: 'Use Greek yogurt dip instead of hummus', tags: ['quick', 'no-cook', 'vegetarian', 'fresh', 'budget'], cravings: ['fresh', 'light', 'savory'] },
  { id: 'cottage-cheese-fruit', name: 'Cottage Cheese + Fruit', emoji: '🍑', category: 'snack', protein: 24, calories: 240, fullness: 3, prepTime: '2 min', bestFor: 'High-protein snack', portions: { protein: 'Palm-sized cup of cottage cheese', fruit: 'Cupped hand of fruit' }, proteinBoost: 'Add a drizzle of honey and some nuts', swap: 'Use Greek yogurt instead', tags: ['high-protein', 'quick', 'no-cook', 'vegetarian', 'budget'], cravings: ['sweet', 'light', 'fresh'] },
  { id: 'edamame-cheese', name: 'Edamame + String Cheese', emoji: '🫛', category: 'snack', protein: 18, calories: 200, fullness: 2, prepTime: '5 min', bestFor: 'Satisfying between-meal snack', portions: { protein: 'Two string cheeses + palm of edamame' }, proteinBoost: 'Add a boiled egg', swap: 'Use roasted chickpeas instead of edamame', tags: ['high-protein', 'quick', 'vegetarian', 'no-cook'], cravings: ['savory', 'light'] },
  { id: 'trail-mix', name: 'DIY Trail Mix', emoji: '🥜', category: 'snack', protein: 10, calories: 250, fullness: 2, prepTime: '2 min', bestFor: 'On the go or desk snack', portions: { fat: 'Thumb of mixed nuts', fruit: 'Cupped hand of dried fruit or dark chocolate chips', protein: 'Small handful of pumpkin seeds' }, proteinBoost: 'Add protein granola or roasted chickpeas', swap: 'Skip dried fruit, use dark chocolate chips only', tags: ['quick', 'no-cook', 'vegetarian', 'budget'], cravings: ['sweet', 'light'] },
];

const PLATE_PROTEINS: PlateItem[] = [
  { id: 'chicken', name: 'Chicken breast', emoji: '🍗', protein: 35, calories: 165 },
  { id: 'salmon', name: 'Salmon', emoji: '🐟', protein: 30, calories: 180 },
  { id: 'lean-beef', name: 'Lean ground beef', emoji: '🥩', protein: 28, calories: 200 },
  { id: 'eggs', name: 'Eggs (3)', emoji: '🍳', protein: 18, calories: 210 },
  { id: 'shrimp', name: 'Shrimp', emoji: '🦐', protein: 26, calories: 130 },
  { id: 'tuna', name: 'Canned tuna', emoji: '🐡', protein: 30, calories: 130 },
  { id: 'tofu', name: 'Tofu', emoji: '🫘', protein: 15, calories: 160 },
  { id: 'turkey', name: 'Turkey breast', emoji: '🦃', protein: 34, calories: 160 },
];

const PLATE_CARBS: PlateItem[] = [
  { id: 'rice', name: 'Rice', emoji: '🍚', protein: 4, calories: 200 },
  { id: 'sweet-potato', name: 'Sweet potato', emoji: '🍠', protein: 2, calories: 130 },
  { id: 'pasta', name: 'Pasta', emoji: '🍝', protein: 7, calories: 220 },
  { id: 'oats', name: 'Oats', emoji: '🌾', protein: 6, calories: 150 },
  { id: 'quinoa', name: 'Quinoa', emoji: '🌱', protein: 8, calories: 185 },
  { id: 'bread', name: 'Sourdough', emoji: '🍞', protein: 5, calories: 140 },
  { id: 'beans', name: 'Beans', emoji: '🫘', protein: 9, calories: 150 },
  { id: 'potatoes', name: 'Potatoes', emoji: '🥔', protein: 3, calories: 130 },
];

const PLATE_VEGS: PlateItem[] = [
  { id: 'spinach', name: 'Spinach', emoji: '🌿', protein: 2, calories: 15 },
  { id: 'broccoli', name: 'Broccoli', emoji: '🥦', protein: 3, calories: 30 },
  { id: 'peppers', name: 'Bell peppers', emoji: '🫑', protein: 1, calories: 25 },
  { id: 'cucumber', name: 'Cucumber + tomato', emoji: '🥒', protein: 1, calories: 20 },
  { id: 'asparagus', name: 'Asparagus', emoji: '🌱', protein: 3, calories: 20 },
  { id: 'zucchini', name: 'Zucchini', emoji: '🥬', protein: 2, calories: 20 },
  { id: 'salad', name: 'Mixed greens', emoji: '🥗', protein: 2, calories: 15 },
  { id: 'cauliflower', name: 'Cauliflower', emoji: '🌸', protein: 2, calories: 25 },
];

const PLATE_FATS: PlateItem[] = [
  { id: 'avocado', name: 'Avocado', emoji: '🥑', protein: 1, calories: 80 },
  { id: 'olive-oil', name: 'Olive oil', emoji: '🫒', protein: 0, calories: 60 },
  { id: 'nuts', name: 'Mixed nuts', emoji: '🥜', protein: 4, calories: 90 },
  { id: 'cheese', name: 'Parmesan', emoji: '🧀', protein: 4, calories: 60 },
  { id: 'tahini', name: 'Tahini drizzle', emoji: '🌻', protein: 2, calories: 60 },
  { id: 'butter', name: 'Butter', emoji: '🧈', protein: 0, calories: 70 },
];

const PLATE_EXTRAS: PlateItem[] = [
  { id: 'berries', name: 'Mixed berries', emoji: '🍓', protein: 1, calories: 50 },
  { id: 'banana', name: 'Banana', emoji: '🍌', protein: 1, calories: 90 },
  { id: 'salsa', name: 'Salsa', emoji: '🍅', protein: 0, calories: 20 },
  { id: 'hot-sauce', name: 'Hot sauce', emoji: '🌶️', protein: 0, calories: 5 },
  { id: 'greek-yogurt', name: 'Greek yogurt sauce', emoji: '🫙', protein: 6, calories: 40 },
  { id: 'kimchi', name: 'Kimchi', emoji: '🥬', protein: 1, calories: 15 },
];

const RESTAURANT_CATEGORIES: Array<{ id: RestaurantCategory; label: string }> = [
  { id: 'burger', label: '🍔 Fast Food' },
  { id: 'chicken', label: '🍗 Chicken' },
  { id: 'mexican', label: '🌮 Mexican' },
  { id: 'sandwich', label: '🥪 Sandwiches' },
  { id: 'coffee', label: '☕ Breakfast' },
  { id: 'asian', label: '🥡 Asian' },
  { id: 'pizza', label: '🍕 Pizza' },
  { id: 'casual', label: '🍽️ Casual Dining' },
  { id: 'healthy', label: '🌱 Healthy' },
];

const RESTAURANTS: Restaurant[] = [
  // ── Fast Food (Burgers) ──────────────────────────────────────────────────────
  {
    name: "McDonald's", emoji: '🍔', category: 'burger',
    best: "Quarter Pounder with Cheese + side salad. ~560 cal, ~32g protein. ⭐⭐⭐⭐ High protein for a fast food burger — skip the fries and you're in solid shape.",
    balanced: "McDouble + small fries. ~640 cal, ~27g protein. ⭐⭐⭐ The McDouble is surprisingly efficient — two patties for under $3.",
    treat: "Big Mac + medium fries. ~940 cal, ~28g protein. ⭐⭐⭐ The classic for a reason. Enjoy it.",
  },
  {
    name: "Wendy's", emoji: '🍔', category: 'burger',
    best: "Grilled Chicken Sandwich + a cup of chili. ~680 cal, ~57g protein. ⭐⭐⭐⭐⭐ Wendy's chili is a legitimate high-protein side — don't sleep on it.",
    balanced: "Dave's Single + side salad. ~640 cal, ~40g protein. ⭐⭐⭐⭐ Fresh beef, real protein. A solid everyday pick.",
    treat: "Baconator. ~950 cal, ~57g protein. ⭐⭐⭐⭐ Indulgent but genuinely protein-dense — this one earns the calories.",
  },
  {
    name: "Burger King", emoji: '🍔', category: 'burger',
    best: "Grilled Chicken Sandwich (no mayo). ~470 cal, ~37g protein. ⭐⭐⭐⭐ One of the better grilled chicken options in fast food. Lean and filling.",
    balanced: "Whopper Jr. (no mayo) + side salad. ~490 cal, ~28g protein. ⭐⭐⭐ Good balance — the Jr. keeps calories in check.",
    treat: "Whopper + onion rings. ~880 cal, ~30g protein. ⭐⭐⭐ The classic. Worth every bite.",
  },
  {
    name: "Jack in the Box", emoji: '🍔', category: 'burger',
    best: "Grilled Chicken Strips (4-piece) + side salad. ~390 cal, ~38g protein. ⭐⭐⭐⭐⭐ Clean protein option — great ratio for a fast food stop.",
    balanced: "Jumbo Jack (no mayo) + side salad. ~530 cal, ~26g protein. ⭐⭐⭐ Solid all-around choice without going overboard.",
    treat: "Ultimate Cheeseburger + small fries. ~1,050 cal, ~43g protein. ⭐⭐⭐ Big meal, strong protein — enjoy it.",
  },
  {
    name: "Carl's Jr. / Hardee's", emoji: '🍔', category: 'burger',
    best: "Charbroiled Chicken Club (no sauce). ~550 cal, ~40g protein. ⭐⭐⭐⭐ Charbroiled = actual grill flavor without the fryer. Ask for sauce on the side.",
    balanced: "Famous Star Burger. ~660 cal, ~27g protein. ⭐⭐⭐ The original. Good protein for a drive-through meal.",
    treat: "Double Western Bacon Cheeseburger. ~960 cal, ~51g protein. ⭐⭐⭐⭐ High cal but surprisingly protein-dense. A real treat.",
  },
  {
    name: "Sonic", emoji: '🍔', category: 'burger',
    best: "Grilled Chicken Sandwich. ~390 cal, ~30g protein. ⭐⭐⭐⭐ Solid grilled option at a drive-in. Skip the ranch dip.",
    balanced: "Jr. Cheeseburger + small tater tots. ~620 cal, ~22g protein. ⭐⭐⭐ Satisfying combo without going overboard.",
    treat: "Bacon Double Cheeseburger + tots. ~970 cal, ~42g protein. ⭐⭐⭐ Classic Sonic experience. Go for it.",
  },
  {
    name: "Dairy Queen", emoji: '🍔', category: 'burger',
    best: "Grilled Chicken Sandwich. ~370 cal, ~32g protein. ⭐⭐⭐⭐ Simple, lean, filling.",
    balanced: "Double Cheeseburger + side salad. ~700 cal, ~38g protein. ⭐⭐⭐⭐ Two patties means solid protein — swap fries for salad.",
    treat: "Burger + Blizzard. ~1,100+ cal. ⭐⭐⭐ You came to DQ for the Blizzard. Get the Blizzard.",
  },
  {
    name: "Arby's", emoji: '🥩', category: 'burger',
    best: "Two Classic Roast Beef sandwiches. ~680 cal, ~46g protein. ⭐⭐⭐⭐ Roast beef is leaner than most fast food meat — and Arby's does it right.",
    balanced: "Roast Turkey Farmhouse Salad. ~230 cal, ~26g protein. ⭐⭐⭐ Light and protein-forward. Surprisingly filling.",
    treat: "Beef 'N Cheddar + curly fries. ~820 cal, ~32g protein. ⭐⭐⭐ The classic Arby's order.",
  },
  {
    name: "Five Guys", emoji: '🍔', category: 'burger',
    best: "Little Hamburger + extra patty + side salad. ~700 cal, ~41g protein. ⭐⭐⭐⭐ Build it the way you want — the customization is the point.",
    balanced: "Little Cheeseburger + side salad. ~600 cal, ~35g protein. ⭐⭐⭐⭐ Genuinely fresh ingredients.",
    treat: "Regular Cheeseburger (double) + fries. ~1,200 cal, ~55g protein. ⭐⭐⭐⭐⭐ Protein-rich treat — the fries are worth it.",
  },
  {
    name: "In-N-Out", emoji: '🍔', category: 'burger',
    best: "Protein Style Double-Double (lettuce wrap). ~520 cal, ~37g protein. ⭐⭐⭐⭐⭐ Same flavor, no bun. The secret menu is real and worth it.",
    balanced: "Double-Double (no fries). ~670 cal, ~37g protein. ⭐⭐⭐⭐ Skip the fries and you've got a balanced, high-protein meal.",
    treat: "Double-Double Animal Style + fries. ~980 cal, ~37g protein. ⭐⭐⭐ Worth the hype. No guilt.",
  },
  {
    name: "Whataburger", emoji: '🍔', category: 'burger',
    best: "Grilled Chicken Sandwich (no mayo). ~420 cal, ~35g protein. ⭐⭐⭐⭐ Great lean option. Add jalapeños for flavor.",
    balanced: "Whataburger (single) + side salad. ~540 cal, ~26g protein. ⭐⭐⭐ The OG — a good balanced pick.",
    treat: "Double Whataburger with Cheese. ~870 cal, ~51g protein. ⭐⭐⭐⭐ One of the most protein-dense doubles in fast food.",
  },
  {
    name: "Culver's", emoji: '🍔', category: 'burger',
    best: "Grilled Chicken Sandwich (no sauce). ~400 cal, ~34g protein. ⭐⭐⭐⭐ Fresh, never frozen. A genuinely good grilled option.",
    balanced: "ButterBurger (single) + side salad. ~570 cal, ~28g protein. ⭐⭐⭐ Midwest comfort done right.",
    treat: "Cheese Curd Burger + cheese curds. ~1,000 cal, ~40g protein. ⭐⭐⭐ Wisconsin at its finest. Embrace it.",
  },
  {
    name: "Shake Shack", emoji: '🍔', category: 'burger',
    best: "SmokeShack (single) + no fries. ~490 cal, ~28g protein. ⭐⭐⭐ Bacon + cherry peppers = a better burger. Worth savoring.",
    balanced: "ShackBurger (single) + side salad. ~500 cal, ~27g protein. ⭐⭐⭐⭐ Simple, quality ingredients.",
    treat: "Double SmokeShack + fries. ~1,080 cal, ~56g protein. ⭐⭐⭐⭐⭐ High protein treat. No apologies needed.",
  },
  {
    name: "Freddy's", emoji: '🍔', category: 'burger',
    best: "Double Steakburger (no sauce) + side salad. ~640 cal, ~42g protein. ⭐⭐⭐⭐ Smashed patties = more surface area, more flavor, solid protein.",
    balanced: "Single Steakburger + small fries. ~650 cal, ~28g protein. ⭐⭐⭐ A satisfying everyday pick.",
    treat: "Double Steakburger + frozen custard concrete. ~1,100 cal. ⭐⭐⭐ The full Freddy's experience. Go for it.",
  },
  {
    name: "Smashburger", emoji: '🍔', category: 'burger',
    best: "Classic Smash (no sauce) + side salad. ~540 cal, ~32g protein. ⭐⭐⭐⭐ Simple, protein-forward, and satisfying.",
    balanced: "BBQ Bacon Smash (single) + side salad. ~600 cal, ~34g protein. ⭐⭐⭐⭐ Smoky and filling.",
    treat: "Double Classic + smash fries. ~980 cal, ~52g protein. ⭐⭐⭐⭐⭐ Protein-dense treat. You earned it.",
  },

  // ── Chicken ──────────────────────────────────────────────────────────────────
  {
    name: "Chick-fil-A", emoji: '🍗', category: 'chicken',
    best: "Grilled Chicken Sandwich + side salad. ~490 cal, ~39g protein. ⭐⭐⭐⭐⭐ One of the best fast food protein sandwiches, full stop.",
    balanced: "Grilled Spicy Deluxe. ~450 cal, ~38g protein. ⭐⭐⭐⭐⭐ All the flavor, lean protein. A reliable pick.",
    treat: "Classic Chicken Sandwich + waffle fries. ~870 cal, ~38g protein. ⭐⭐⭐⭐ The original. Still solid protein. Enjoy it.",
  },
  {
    name: "Raising Cane's", emoji: '🍗', category: 'chicken',
    best: "3-piece Chicken Fingers + coleslaw (no Cane's sauce). ~520 cal, ~40g protein. ⭐⭐⭐⭐ The sauce is where most of the extra calories hide — go easy or skip it.",
    balanced: "3-piece combo with coleslaw instead of fries. ~640 cal, ~40g protein. ⭐⭐⭐⭐ A solid protein meal.",
    treat: "Box Combo (4 fingers + fries + toast + sauce). ~1,000 cal, ~52g protein. ⭐⭐⭐⭐⭐ The full Cane's experience. Worth it.",
  },
  {
    name: "KFC", emoji: '🍗', category: 'chicken',
    best: "3-piece Grilled Chicken (breast + drumstick + thigh) + green beans. ~380 cal, ~58g protein. ⭐⭐⭐⭐⭐ KFC's grilled option is seriously underrated — best protein-per-calorie at any chicken chain.",
    balanced: "Extra Crispy Chicken Sandwich + coleslaw. ~700 cal, ~32g protein. ⭐⭐⭐ Crispy and satisfying — coleslaw over fries to balance it out.",
    treat: "3-piece Original Recipe + mashed potatoes + biscuit. ~1,050 cal, ~62g protein. ⭐⭐⭐⭐⭐ Surprisingly protein-rich for a treat meal.",
  },
  {
    name: "Popeyes", emoji: '🍗', category: 'chicken',
    best: "Blackened Chicken Tenders (3-piece) + green beans. ~380 cal, ~42g protein. ⭐⭐⭐⭐⭐ Blackened = big flavor without the fry coating calories. Hidden gem on the menu.",
    balanced: "Chicken Sandwich (classic) + coleslaw. ~700 cal, ~30g protein. ⭐⭐⭐ Still a great sandwich — coleslaw is the right side call.",
    treat: "Classic Chicken Sandwich + Cajun fries. ~900 cal, ~30g protein. ⭐⭐⭐ The sandwich that started the great chicken war. Worth every bite.",
  },
  {
    name: "Church's Chicken", emoji: '🍗', category: 'chicken',
    best: "2-piece Mixed (breast + leg, original) + coleslaw. ~540 cal, ~44g protein. ⭐⭐⭐⭐ Real bone-in chicken = great protein density.",
    balanced: "Chicken sandwich + coleslaw. ~620 cal, ~28g protein. ⭐⭐⭐ Solid, affordable, filling.",
    treat: "2-piece + honey butter biscuit + fries. ~980 cal, ~44g protein. ⭐⭐⭐⭐ Southern comfort done right. Enjoy it.",
  },
  {
    name: "Bojangles", emoji: '🍗', category: 'chicken',
    best: "4-piece Supremes (chicken strips) + green beans (no biscuit). ~480 cal, ~46g protein. ⭐⭐⭐⭐⭐ Southern seasoning, real protein. The strips are the move.",
    balanced: "2-piece leg quarter + dirty rice. ~680 cal, ~38g protein. ⭐⭐⭐ Flavorful and filling — the dirty rice is worth it.",
    treat: "2-piece + seasoned fries + biscuit. ~920 cal, ~38g protein. ⭐⭐⭐ The full Bojangles experience. Saturday morning approved.",
  },

  // ── Mexican ──────────────────────────────────────────────────────────────────
  {
    name: "Chipotle", emoji: '🌯', category: 'mexican',
    best: "Burrito bowl: double chicken + black beans + fajita veggies + salsa + lettuce. ~650 cal, ~55g protein. ⭐⭐⭐⭐⭐ Double protein is always worth the upcharge here.",
    balanced: "Burrito bowl: chicken + rice + beans + salsa + guac. ~730 cal, ~42g protein. ⭐⭐⭐⭐ Guac adds good fats. A complete meal.",
    treat: "Full burrito with everything. ~1,050 cal, ~38g protein. ⭐⭐⭐⭐ Still solid protein. Worth it for a big day.",
  },
  {
    name: "Qdoba", emoji: '🌯', category: 'mexican',
    best: "Protein bowl: grilled chicken + black beans + fajita veggies + salsa + lettuce. ~580 cal, ~46g protein. ⭐⭐⭐⭐⭐ Free queso makes this an easy win.",
    balanced: "Burrito bowl: chicken + rice + beans + queso + pico. ~720 cal, ~38g protein. ⭐⭐⭐⭐ The free queso upgrade is a real advantage at Qdoba.",
    treat: "Full burrito with everything. ~1,050 cal, ~38g protein. ⭐⭐⭐⭐ Go all in. It's good.",
  },
  {
    name: "Taco Bell", emoji: '🌮', category: 'mexican',
    best: "Power Menu Bowl (chicken). ~490 cal, ~27g protein. ⭐⭐⭐⭐ Or try 3 Fresco Style Chicken Soft Tacos for ~480 cal, ~30g protein. Both are solid wins.",
    balanced: "Chicken Burrito Supreme. ~490 cal, ~20g protein. ⭐⭐⭐ Reliable and filling. Add extra chicken if you want more protein.",
    treat: "Crunchwrap Supreme. ~540 cal, ~17g protein. ⭐⭐⭐ The iconic Taco Bell experience. Sometimes that's exactly what you need.",
  },
  {
    name: "Del Taco", emoji: '🌮', category: 'mexican',
    best: "2 Grilled Chicken Del Carbon Tacos. ~400 cal, ~30g protein. ⭐⭐⭐⭐ Simple, lean, and genuinely tasty.",
    balanced: "Chicken Burrito + side of beans. ~680 cal, ~34g protein. ⭐⭐⭐ Filling and practical — beans add fiber and extra protein.",
    treat: "Del Beef Tacos (×3) + quesadilla. ~950 cal, ~40g protein. ⭐⭐⭐⭐ Budget-friendly treat with real protein.",
  },
  {
    name: "Cafe Rio", emoji: '🌯', category: 'mexican',
    best: "Salad bowl: grilled chicken + black beans + salsa + lettuce. ~580 cal, ~45g protein. ⭐⭐⭐⭐⭐ The fresh lime flavor makes this feel like a real meal, not a compromise.",
    balanced: "3 tacos: chicken + black beans + pico. ~650 cal, ~38g protein. ⭐⭐⭐⭐ Three tacos is the right amount.",
    treat: "Full burrito con todo. ~1,100 cal, ~42g protein. ⭐⭐⭐⭐ Save this for a big appetite day — worth it.",
  },
  {
    name: "Costa Vida", emoji: '🌯', category: 'mexican',
    best: "Sweet Pork Salad (no tortilla shell) + black beans + pico + lettuce. ~600 cal, ~40g protein. ⭐⭐⭐⭐ The sweet pork is their signature — lean enough to make it work.",
    balanced: "Chicken Burrito Bowl + rice + beans + mild salsa. ~680 cal, ~38g protein. ⭐⭐⭐ Solid, reliable, filling.",
    treat: "Sweet Pork Burrito with everything. ~1,100 cal, ~42g protein. ⭐⭐⭐⭐ The full Costa Vida experience. Go for it.",
  },

  // ── Sandwiches ───────────────────────────────────────────────────────────────
  {
    name: "Subway", emoji: '🥪', category: 'sandwich',
    best: "Footlong Rotisserie-Style Chicken on multigrain, loaded with veggies. ~640 cal, ~44g protein. ⭐⭐⭐⭐⭐ Load it up — the veggies are free and filling.",
    balanced: "6-inch Turkey Breast + avocado + veggies. ~480 cal, ~26g protein. ⭐⭐⭐⭐ Add a second 6-inch if you're hungry.",
    treat: "Footlong Meatball Marinara. ~960 cal, ~43g protein. ⭐⭐⭐⭐ Satisfying and still protein-rich.",
  },
  {
    name: "Jimmy John's", emoji: '🥖', category: 'sandwich',
    best: "Unwich (lettuce wrap) with roast beef or turkey + extra meat. ~300 cal, ~32g protein. ⭐⭐⭐⭐ Great low-carb pick — same fillings, less bread.",
    balanced: "#7 Gourmet Smoked Ham Club on wheat. ~540 cal, ~34g protein. ⭐⭐⭐⭐ Freaky fast and genuinely satisfying.",
    treat: "#12 Beach Club + chips. ~730 cal, ~30g protein. ⭐⭐⭐ Fresh and filling. The chips are worth it.",
  },
  {
    name: "Jersey Mike's", emoji: '🥖', category: 'sandwich',
    best: "Giant #13 Original Italian on wheat (light oil). ~780 cal, ~52g protein. ⭐⭐⭐⭐⭐ One of the best protein sandwiches you can order anywhere.",
    balanced: "Regular Turkey + provolone on wheat, light oil. ~520 cal, ~34g protein. ⭐⭐⭐⭐ Clean and filling.",
    treat: "Giant Italian Mike's Way. ~950 cal, ~52g protein. ⭐⭐⭐⭐ The full experience. Oil, vinegar, hot peppers — all of it.",
  },
  {
    name: "Firehouse Subs", emoji: '🥖', category: 'sandwich',
    best: "Medium Turkey Breast on wheat. ~490 cal, ~38g protein. ⭐⭐⭐⭐⭐ Real sliced turkey in generous portions — hard to beat.",
    balanced: "Medium Hook & Ladder (turkey + ham) on wheat. ~540 cal, ~40g protein. ⭐⭐⭐⭐⭐ Two proteins, one sandwich. Smart pick.",
    treat: "Large Engineer (roast beef + corned beef) + chips. ~1,100 cal, ~68g protein. ⭐⭐⭐⭐⭐ Treat meal with serious protein.",
  },
  {
    name: "Potbelly", emoji: '🥪', category: 'sandwich',
    best: "Grilled Chicken sandwich (regular) + steamed broccoli. ~540 cal, ~38g protein. ⭐⭐⭐⭐⭐ Underrated sandwich chain with real protein.",
    balanced: "Skinny (half) Mediterranean + cup of soup. ~420 cal, ~24g protein. ⭐⭐⭐⭐ Lighter option that still satisfies.",
    treat: "Regular Turkey Bacon Dijon on multigrain + shake. ~900 cal, ~40g protein. ⭐⭐⭐⭐ Get the shake. It's worth it.",
  },
  {
    name: "Which Wich", emoji: '🥖', category: 'sandwich',
    best: "Large Turkey Wich on multigrain + extra turkey. ~640 cal, ~48g protein. ⭐⭐⭐⭐⭐ Build it exactly how you want — that's the whole point.",
    balanced: "Regular Turkey Wich on wheat, piled with veggies. ~520 cal, ~36g protein. ⭐⭐⭐⭐ Customizable and filling.",
    treat: "Meaty Wich + chips. ~980 cal, ~52g protein. ⭐⭐⭐⭐ Protein-rich treat. Go for it.",
  },

  // ── Coffee & Breakfast ───────────────────────────────────────────────────────
  {
    name: "Starbucks", emoji: '☕', category: 'coffee',
    best: "Egg White & Roasted Red Pepper Egg Bites (×2) + unsweetened cold brew. ~310 cal, ~24g protein. ⭐⭐⭐⭐ The best grab-and-go protein breakfast at any coffee shop.",
    balanced: "Turkey Bacon, Cheddar & Egg White Sandwich + protein box. ~530 cal, ~32g protein. ⭐⭐⭐⭐ A real meal in coffee shop form.",
    treat: "Iced Caramel Macchiato + Butter Croissant. ~560 cal, ~12g protein. ⭐⭐ Enjoy it. Add a protein box if you want more substance.",
  },
  {
    name: "Dutch Bros", emoji: '☕', category: 'coffee',
    best: "Americano or cold brew straight (or with splash of protein milk). ~20 cal, ~0g protein. ⭐⭐⭐⭐ Dutch Bros is about the coffee — grab a protein bar to pair with it.",
    balanced: "Golden Eagle with 2% milk (medium). ~310 cal, ~11g protein. ⭐⭐⭐ One of their smoother drinks. Pair with food for a real meal.",
    treat: "Freeze or Rebel. High sugar, big fun. ⭐⭐⭐ It's a coffee experience, not a nutrition strategy — that's allowed.",
  },
  {
    name: "Dunkin'", emoji: '🍩', category: 'coffee',
    best: "Egg & Cheese Wake-Up Wrap (×2) + cold brew (unsweetened). ~340 cal, ~18g protein. ⭐⭐⭐ Two wraps gets you to a real breakfast. Easy and portable.",
    balanced: "Bacon, Egg & Cheese Croissant + cold brew. ~490 cal, ~18g protein. ⭐⭐⭐ Classic Dunkin' breakfast. Does the job.",
    treat: "Boston Kreme donut + iced latte. ~540 cal. ⭐⭐ Sometimes you just want the donut. That's completely fine.",
  },
  {
    name: "Einstein Bros.", emoji: '🥯', category: 'coffee',
    best: "Thin bagel with smoked salmon + plain cream cheese. ~420 cal, ~28g protein. ⭐⭐⭐⭐ Salmon brings real protein and omega-3s to a bagel breakfast.",
    balanced: "Everything Bagel + turkey + veggie cream cheese. ~500 cal, ~26g protein. ⭐⭐⭐⭐ Load it up with turkey for extra protein.",
    treat: "Asiago bagel with classic cream cheese. ~490 cal, ~13g protein. ⭐⭐⭐ The classic. Pair with a protein shake to round it out.",
  },
  {
    name: "Panera", emoji: '🥖', category: 'coffee',
    best: "You Pick Two: Turkey Chili + half Chicken Caesar Salad. ~510 cal, ~38g protein. ⭐⭐⭐⭐⭐ Smart combo — protein from two sources.",
    balanced: "Fuji Apple Salad with chicken. ~570 cal, ~32g protein. ⭐⭐⭐⭐ Light, satisfying, and protein-forward.",
    treat: "Mac & cheese + half turkey sandwich. ~980 cal, ~32g protein. ⭐⭐⭐⭐ Comfort choice worth having on a slow day.",
  },
  {
    name: "First Watch", emoji: '🍳', category: 'coffee',
    best: "Farmhouse Hash with 3 scrambled eggs. ~580 cal, ~35g protein. ⭐⭐⭐⭐⭐ A real breakfast with real protein. Order it and feel good about your day.",
    balanced: "Turkey Avocado BLT on multigrain. ~620 cal, ~34g protein. ⭐⭐⭐⭐ Lunch-style option with solid macros.",
    treat: "Lemon Ricotta Pancakes + eggs on the side. ~900 cal, ~28g protein. ⭐⭐⭐ Saturday morning done right. Add the eggs to bump protein.",
  },

  // ── Asian ─────────────────────────────────────────────────────────────────────
  {
    name: "Panda Express", emoji: '🥡', category: 'asian',
    best: "Grilled Teriyaki Chicken + mixed veggies (no rice). ~290 cal, ~36g protein. ⭐⭐⭐⭐⭐ The highest protein, lowest calorie main at Panda. Underrated order.",
    balanced: "Grilled Teriyaki Chicken + half rice/half veggies. ~490 cal, ~36g protein. ⭐⭐⭐⭐ Great balance. The teriyaki is genuinely good.",
    treat: "Orange Chicken + fried rice. ~800 cal, ~25g protein. ⭐⭐⭐ The crowd favorite exists for a reason. Enjoy it.",
  },
  {
    name: "Pei Wei", emoji: '🥢', category: 'asian',
    best: "Japanese Teriyaki Chicken bowl + extra veggies. ~450 cal, ~36g protein. ⭐⭐⭐⭐⭐ Clean protein, good flavor, filling.",
    balanced: "Teriyaki Chicken bowl with brown rice. ~620 cal, ~38g protein. ⭐⭐⭐⭐ Brown rice keeps it balanced.",
    treat: "Mongolian Beef + white rice. ~840 cal, ~36g protein. ⭐⭐⭐⭐ Rich, satisfying, and still protein-solid.",
  },
  {
    name: "Teriyaki Madness", emoji: '🍱', category: 'asian',
    best: "Chicken bowl + veggie base (skip the rice or go half). ~420 cal, ~48g protein. ⭐⭐⭐⭐⭐ Generous portions of real chicken breast — hard to find a better protein ratio at a casual chain.",
    balanced: "Chicken bowl + brown rice + extra veggies. ~680 cal, ~48g protein. ⭐⭐⭐⭐⭐ More volume, still great protein. A real meal.",
    treat: "Beef bowl + white rice + gyoza add-on. ~1,050 cal, ~52g protein. ⭐⭐⭐⭐⭐ Protein-packed treat. Worth every bite.",
  },

  // ── Pizza ─────────────────────────────────────────────────────────────────────
  {
    name: "Domino's", emoji: '🍕', category: 'pizza',
    best: "2 slices Thin Crust Chicken & Veggie (no ranch). ~400 cal, ~24g protein. ⭐⭐⭐ Thin crust drops the carb load significantly — the right move for pizza night.",
    balanced: "2 slices Hand Tossed Chicken + 1 slice veggie. ~580 cal, ~30g protein. ⭐⭐⭐⭐ Solid balance if you're having a proper dinner.",
    treat: "3 slices Pepperoni Hand Tossed. ~720 cal, ~30g protein. ⭐⭐⭐ Nobody eats pizza to be virtuous. Enjoy it.",
  },
  {
    name: "Pizza Hut", emoji: '🍕', category: 'pizza',
    best: "2 slices Thin 'N Crispy Chicken Supreme. ~380 cal, ~22g protein. ⭐⭐⭐ Thin crust + chicken is the smart combo.",
    balanced: "2 slices Original Crust Chicken + side salad. ~580 cal, ~28g protein. ⭐⭐⭐⭐ Add the salad to stretch the meal.",
    treat: "3 slices Original Pan + garlic bread. ~900 cal, ~30g protein. ⭐⭐⭐ The classic thick-crust experience.",
  },
  {
    name: "Papa John's", emoji: '🍕', category: 'pizza',
    best: "2 slices Thin Crust Chicken & Veggie. ~380 cal, ~22g protein. ⭐⭐⭐ Lighter option that still satisfies.",
    balanced: "2 slices Original Crust with chicken. ~540 cal, ~26g protein. ⭐⭐⭐ Reliable. Add a side salad to round it out.",
    treat: "3 slices The Works + garlic dipping sauce. ~860 cal, ~33g protein. ⭐⭐⭐ The full Papa John's experience.",
  },
  {
    name: "Little Caesars", emoji: '🍕', category: 'pizza',
    best: "2 slices Classic Cheese + side salad from home. ~400 cal, ~18g protein. ⭐⭐⭐ The price-per-calorie is unmatched anywhere. Pair with a protein shake.",
    balanced: "2 slices Pepperoni + Crazy Bread (1 piece). ~640 cal, ~26g protein. ⭐⭐⭐ Budget-friendly and filling.",
    treat: "3 slices Pepperoni + Crazy Bread (3 pieces). ~880 cal, ~30g protein. ⭐⭐⭐ The value is unbeatable. Enjoy it.",
  },
  {
    name: "MOD Pizza", emoji: '🍕', category: 'pizza',
    best: "Build your own: thin crust + red sauce + grilled chicken + roasted veggies + light cheese. ~520 cal, ~32g protein. ⭐⭐⭐⭐ Full control of what goes on — use it.",
    balanced: "Build: classic sauce + mozzarella + chicken + roasted garlic + artichoke. ~640 cal, ~34g protein. ⭐⭐⭐⭐ Flavor-forward and filling.",
    treat: "Any signature pizza + salad. ~800 cal, ~30g protein. ⭐⭐⭐ MOD is fun because you can make it exactly what you want.",
  },
  {
    name: "Blaze Pizza", emoji: '🍕', category: 'pizza',
    best: "Build your own: white garlic sauce + spinach + grilled chicken + roasted tomatoes (thin crust). ~540 cal, ~34g protein. ⭐⭐⭐⭐ High-protein custom build that actually tastes good.",
    balanced: "High Bird or Green Stripe (their built-for-protein pies). ~620 cal, ~36g protein. ⭐⭐⭐⭐ These menu picks exist specifically for people who care about protein.",
    treat: "Any pizza + garlic knots. ~880 cal, ~32g protein. ⭐⭐⭐ The garlic knots are the move. Get them.",
  },

  // ── Casual Dining ────────────────────────────────────────────────────────────
  {
    name: "Applebee's", emoji: '🍽️', category: 'casual',
    best: "8 oz Sirloin + steamed broccoli + house salad. ~580 cal, ~52g protein. ⭐⭐⭐⭐⭐ Steak at a sit-down restaurant is one of the smartest protein picks around.",
    balanced: "Grilled Chicken Wonton Tacos. ~590 cal, ~34g protein. ⭐⭐⭐⭐ Light, satisfying, and one of their better options.",
    treat: "Double Crunch Bone-In Wings + fries. ~1,100 cal, ~54g protein. ⭐⭐⭐⭐⭐ High protein treat. Game-day approved.",
  },
  {
    name: "Chili's", emoji: '🍽️', category: 'casual',
    best: "6 oz Classic Sirloin + steamed broccoli + house salad. ~560 cal, ~48g protein. ⭐⭐⭐⭐⭐ A complete protein meal for a reasonable price.",
    balanced: "Grilled Chicken Sandwich + steamed broccoli. ~570 cal, ~42g protein. ⭐⭐⭐⭐⭐ One of the better balanced picks at a casual chain.",
    treat: "Boss Burger + fries. ~1,200 cal, ~56g protein. ⭐⭐⭐⭐ Indulgent but protein-dense. Worth it for a cheat day.",
  },
  {
    name: "Olive Garden", emoji: '🍝', category: 'casual',
    best: "Herb-Grilled Salmon. ~510 cal, ~42g protein. ⭐⭐⭐⭐⭐ One of the best macro meals at OG — skip the breadstick and add a side salad.",
    balanced: "Chicken Alfredo (half portion) + minestrone soup. ~720 cal, ~38g protein. ⭐⭐⭐⭐ Pasta + soup is a surprisingly filling combo.",
    treat: "Tour of Italy + a breadstick. ~1,500 cal, ~55g protein. ⭐⭐⭐⭐⭐ Special occasion order. High protein, high enjoyment.",
  },
  {
    name: "Red Robin", emoji: '🍔', category: 'casual',
    best: "Simply Grilled Chicken Burger (lettuce wrap) + side salad. ~520 cal, ~38g protein. ⭐⭐⭐⭐ Great customization options — build it your way.",
    balanced: "Burnin' Love Burger (single) + side salad. ~700 cal, ~34g protein. ⭐⭐⭐⭐ Spicy and filling. Swap fries for salad.",
    treat: "Gourmet Cheeseburger + bottomless steak fries. ~1,200 cal, ~48g protein. ⭐⭐⭐⭐ The bottomless fries are part of the experience. Embrace it.",
  },
  {
    name: "Buffalo Wild Wings", emoji: '🍗', category: 'casual',
    best: "Traditional Wings (8) + dry rub seasoning + side salad. ~680 cal, ~60g protein. ⭐⭐⭐⭐⭐ Traditional > boneless for protein-to-calorie — real chicken, less breading.",
    balanced: "Naked Tenders (6) + Spicy Garlic sauce + celery. ~540 cal, ~52g protein. ⭐⭐⭐⭐⭐ Unbreaded tenders are a protein powerhouse.",
    treat: "Boneless Wings (15) + loaded fries. ~1,400 cal, ~72g protein. ⭐⭐⭐⭐⭐ Game day done right. High protein, zero regrets.",
  },
  {
    name: "Texas Roadhouse", emoji: '🥩', category: 'casual',
    best: "8 oz Sirloin + grilled green beans + house salad. ~620 cal, ~58g protein. ⭐⭐⭐⭐⭐ Save the rolls for after — start with the steak and let the protein do its job.",
    balanced: "Grilled Chicken + mashed potatoes + house salad. ~680 cal, ~54g protein. ⭐⭐⭐⭐⭐ A complete, high-protein meal at a fair price.",
    treat: "12 oz Ribeye + mashed potatoes + rolls. ~1,400 cal, ~78g protein. ⭐⭐⭐⭐⭐ Premium treat with exceptional protein. Special occasion approved.",
  },
  {
    name: "Outback Steakhouse", emoji: '🥩', category: 'casual',
    best: "9 oz Victoria's Filet + steamed vegetables + house salad. ~680 cal, ~62g protein. ⭐⭐⭐⭐⭐ The filet is lean, tender, and protein-packed.",
    balanced: "Grilled Salmon + seasonal vegetables. ~620 cal, ~46g protein. ⭐⭐⭐⭐⭐ Omega-3 rich and balanced.",
    treat: "Outback Special (14 oz) + loaded baked potato. ~1,400 cal, ~85g protein. ⭐⭐⭐⭐⭐ Worth every calorie for a big night out.",
  },
  {
    name: "BJ's Restaurant", emoji: '🍺', category: 'casual',
    best: "Enlightened Grilled Chicken Pesto + zucchini noodles. ~480 cal, ~44g protein. ⭐⭐⭐⭐⭐ From their lighter menu — genuinely good and protein-packed.",
    balanced: "Grilled Salmon + roasted Brussels sprouts. ~680 cal, ~42g protein. ⭐⭐⭐⭐ Solid sit-down meal.",
    treat: "Personal Deep Dish Pizza + Pizookie for dessert. ~1,200 cal. ⭐⭐⭐ The Pizookie is non-negotiable at BJ's. Get it.",
  },
  {
    name: "Cheesecake Factory", emoji: '🍰', category: 'casual',
    best: "SkinnyLicious® Grilled Chicken (lighter menu). ~580 cal, ~48g protein. ⭐⭐⭐⭐⭐ Their lighter menu is actually good — real food, not rabbit food.",
    balanced: "Factory Chopped Salad with chicken. ~700 cal, ~40g protein. ⭐⭐⭐⭐ Generous portions of real ingredients.",
    treat: "Pasta Napoletana + a slice of cheesecake. ~1,400 cal. ⭐⭐⭐ You came for the cheesecake. Get the cheesecake. No guilt.",
  },

  // ── Healthy Chains ───────────────────────────────────────────────────────────
  {
    name: "CAVA", emoji: '🫕', category: 'healthy',
    best: "Greens base + grilled chicken + roasted veggies + hummus + tzatziki. ~560 cal, ~46g protein. ⭐⭐⭐⭐⭐ Add double chicken if you're hungry. The lemon herb tahini is worth it.",
    balanced: "Grain base + grilled chicken + cucumber + harissa + feta. ~680 cal, ~38g protein. ⭐⭐⭐⭐ Balanced, filling, and genuinely tasty.",
    treat: "Pita bowl + falafel + all the toppings. ~950 cal, ~38g protein. ⭐⭐⭐⭐ Falafel is surprisingly filling and worth adding.",
  },
  {
    name: "Sweetgreen", emoji: '🥗', category: 'healthy',
    best: "Harvest Bowl (no croutons, extra chicken). ~620 cal, ~46g protein. ⭐⭐⭐⭐⭐ One of the best macro bowls at any salad chain. The warm base + chicken combo is legitimately good.",
    balanced: "Custom bowl: roasted chicken + greens + roasted veggies + balsamic vinaigrette. ~580 cal, ~40g protein. ⭐⭐⭐⭐⭐ Build it the way you want.",
    treat: "Crispy Rice Bowl + warm garlic bread. ~980 cal, ~30g protein. ⭐⭐⭐ Sweetgreen goes harder than you'd expect. Enjoy it.",
  },
  {
    name: "Flower Child", emoji: '🌸', category: 'healthy',
    best: "Mother Earth Bowl + grilled chicken added. ~560 cal, ~42g protein. ⭐⭐⭐⭐⭐ Clean ingredients, real food, great flavor. A lunch you'll actually look forward to.",
    balanced: "Kale Caesar + grilled chicken. ~510 cal, ~36g protein. ⭐⭐⭐⭐ Light but filling. The Caesar dressing is made right here.",
    treat: "Crispy Chicken bowl + tahini drizzle. ~780 cal, ~42g protein. ⭐⭐⭐⭐ Crispy still fits. No need to deprive yourself.",
  },
  {
    name: "Noodles & Company", emoji: '🍜', category: 'healthy',
    best: "Zucchini Pesto + grilled chicken. ~510 cal, ~42g protein. ⭐⭐⭐⭐⭐ The zucchini noodle swap is genuinely good — not a compromise.",
    balanced: "Japanese Pan Noodles + grilled chicken. ~620 cal, ~38g protein. ⭐⭐⭐⭐ Savory, filling, and solid protein.",
    treat: "Wisconsin Mac & Cheese + chicken. ~860 cal, ~40g protein. ⭐⭐⭐⭐ Cheese + protein. A genuinely good day.",
  },
];

const FILTER_TAGS: Array<{ id: MealTag; label: string; emoji: string }> = [
  { id: 'high-protein', label: 'High protein', emoji: '💪' },
  { id: 'quick', label: 'Quick', emoji: '⚡' },
  { id: 'cozy', label: 'Cozy', emoji: '🍲' },
  { id: 'fresh', label: 'Fresh', emoji: '🥗' },
  { id: 'comfort', label: 'Comfort food', emoji: '❤️' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🌱' },
  { id: 'budget', label: 'Budget', emoji: '💚' },
  { id: 'no-cook', label: 'No cooking', emoji: '🙌' },
  { id: 'meal-prep', label: 'Meal prep', emoji: '📦' },
  { id: 'takeout', label: 'Takeout', emoji: '🥡' },
];

const CRAVING_TAGS: Array<{ id: CravingTag; label: string; emoji: string }> = [
  { id: 'savory', label: 'Savory', emoji: '🧂' },
  { id: 'cozy', label: 'Cozy', emoji: '🍲' },
  { id: 'fresh', label: 'Fresh', emoji: '🌿' },
  { id: 'pasta', label: 'Pasta', emoji: '🍝' },
  { id: 'mexican', label: 'Mexican', emoji: '🌮' },
  { id: 'chicken', label: 'Chicken', emoji: '🍗' },
  { id: 'beef', label: 'Beef', emoji: '🥩' },
  { id: 'sweet', label: 'Sweet', emoji: '🍓' },
  { id: 'light', label: 'Light', emoji: '🥬' },
  { id: 'hungry', label: 'Really hungry', emoji: '🔥' },
];

const PORTION_LABELS: Record<string, string> = {
  protein: '🤚 Protein',
  carbs: '✊ Carbs',
  veg: '🤲 Veg',
  fat: '👍 Fat',
  fruit: '🫴 Fruit',
};

function Nutrition() {
  const [activeCategory, setActiveCategory] = useState<MealCategory | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState<MealTag | null>(null);
  const [activeCraving, setActiveCraving] = useState<CravingTag | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'build' | 'restaurants'>('browse');
  const [plateProtein, setPlateProtein] = useState<PlateItem[]>([]);
  const [plateCarb, setPlateCarb] = useState<PlateItem[]>([]);
  const [plateVeg, setPlateVeg] = useState<PlateItem[]>([]);
  const [plateFat, setPlateFat] = useState<PlateItem[]>([]);
  const [plateExtra, setPlateExtra] = useState<PlateItem[]>([]);

  function togglePlateItem(list: PlateItem[], setList: (v: PlateItem[]) => void, item: PlateItem) {
    setList(list.some((s) => s.id === item.id) ? list.filter((s) => s.id !== item.id) : [...list, item]);
  }
  function clearPlate() {
    setPlateProtein([]); setPlateCarb([]); setPlateVeg([]); setPlateFat([]); setPlateExtra([]);
  }

  const filteredMeals = MEALS.filter((meal) => {
    if (activeCategory !== 'all' && meal.category !== activeCategory) return false;
    if (activeFilter && !meal.tags.includes(activeFilter)) return false;
    if (activeCraving && !meal.cravings.includes(activeCraving)) return false;
    return true;
  });

  const allPlateItems = [...plateProtein, ...plateCarb, ...plateVeg, ...plateFat, ...plateExtra];
  const plateProteinTotal = allPlateItems.reduce((sum, i) => sum + i.protein, 0);
  const plateCalTotal = allPlateItems.reduce((sum, i) => sum + i.calories, 0);
  const isBalanced = plateProtein.length > 0 && plateCarb.length > 0 && plateVeg.length > 0 && plateFat.length > 0;
  const plateFullness = plateProtein.length > 0 && plateCarb.length > 0 && plateVeg.length > 0
    ? plateProteinTotal >= 30 ? 5 : plateProteinTotal >= 20 ? 4 : 3
    : 0;

  return (
    <div className="grid min-w-0 max-w-full gap-4 overflow-x-hidden">
      <section className="overflow-hidden rounded-[2rem] border border-moon-border/40 bg-white shadow-soft">
        <div className="bg-gradient-to-br from-[#F4EAFF] via-[#EDE0FA] to-[#D8C8F5]/50 p-4 sm:p-6">
          <Pill icon={Utensils} text="Food coach" />
          <h2 className="mt-2 font-display text-2xl leading-tight tracking-[-0.01em] sm:text-4xl">What should I eat next?</h2>
          <p className="mt-1.5 max-w-xl text-[13px] leading-relaxed text-moon-muted/70">
            Protein first. No weighing. No guilt. Practical ideas to keep you full.
          </p>
        </div>
      </section>

      <NutritionTargets />

      <div className="no-scrollbar -mx-4 flex max-w-[100vw] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:max-w-full sm:px-0">
        {(['browse', 'build', 'restaurants'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`no-active-scale min-h-10 shrink-0 rounded-2xl px-3.5 py-2 text-[12px] font-semibold transition-all duration-200 sm:px-4 sm:py-2.5 sm:text-[13px] ${
              activeTab === tab
                ? 'bg-moon-accent text-white'
                : 'border border-moon-border/40 bg-white text-moon-muted/70'
            }`}
            style={activeTab === tab ? { boxShadow: '0 4px 16px rgba(191, 162, 220, 0.38)' } : undefined}
          >
            {tab === 'browse' ? 'Browse meals' : tab === 'build' ? 'Build my plate' : 'Restaurants'}
          </button>
        ))}
      </div>

      {activeTab === 'browse' && (
        <>
          {/* Meal-time category filter */}
          <div className="no-scrollbar -mx-4 flex max-w-[100vw] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:max-w-full sm:px-0">
            {(['all', 'breakfast', 'lunch', 'dinner', 'snack'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`no-active-scale min-h-10 shrink-0 rounded-2xl border px-3.5 text-[12px] font-semibold transition-all duration-200 sm:min-h-11 sm:px-4 sm:text-[13px] ${
                  activeCategory === cat
                    ? 'border-moon-text bg-moon-text text-white'
                    : 'border-moon-border/40 bg-white text-moon-muted/70'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <section>
            <h2 className="font-display text-xl leading-tight tracking-[-0.01em] sm:text-2xl">What are you craving?</h2>
            <div className="no-scrollbar -mx-4 mt-2.5 flex max-w-[100vw] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:max-w-full sm:px-0">
              {CRAVING_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => { setActiveCraving(activeCraving === tag.id ? null : tag.id); setActiveFilter(null); }}
                  className={`no-active-scale flex min-h-10 shrink-0 items-center gap-1.5 rounded-2xl border px-3 text-[12px] font-semibold transition-all duration-200 sm:min-h-11 sm:px-3.5 ${
                    activeCraving === tag.id
                      ? 'border-moon-accent bg-moon-accent text-white'
                      : 'border-moon-border/40 bg-white text-moon-muted/70'
                  }`}
                >
                  <span aria-hidden="true">{tag.emoji}</span>
                  {tag.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl leading-tight tracking-[-0.01em] sm:text-2xl">Browse by</h2>
            <div className="no-scrollbar -mx-4 mt-2.5 flex max-w-[100vw] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:max-w-full sm:px-0">
              {FILTER_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => { setActiveFilter(activeFilter === tag.id ? null : tag.id); setActiveCraving(null); }}
                  className={`no-active-scale flex min-h-10 shrink-0 items-center gap-1.5 rounded-2xl border px-3 text-[12px] font-semibold transition-all duration-200 sm:min-h-11 sm:px-3.5 ${
                    activeFilter === tag.id
                      ? 'border-moon-accent bg-moon-accent text-white'
                      : 'border-moon-border/40 bg-white text-moon-muted/70'
                  }`}
                >
                  <span aria-hidden="true">{tag.emoji}</span>
                  {tag.label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <p className="mb-3 text-[12px] text-moon-muted/50">
              {filteredMeals.length} idea{filteredMeals.length !== 1 ? 's' : ''}
            </p>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filteredMeals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  expanded={expandedMeal === meal.id}
                  onToggle={() => setExpandedMeal(expandedMeal === meal.id ? null : meal.id)}
                />
              ))}
              {filteredMeals.length === 0 && (
                <div className="col-span-full rounded-[2rem] border border-moon-border/35 bg-moon-surface/40 p-8 text-center">
                  <p className="font-display text-xl">No matches</p>
                  <p className="mt-2 text-[13px] text-moon-muted/60">Try a different filter or craving.</p>
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {activeTab === 'build' && (
        <BuildMyPlate
          protein={plateProtein} onProtein={(item) => togglePlateItem(plateProtein, setPlateProtein, item)}
          carb={plateCarb} onCarb={(item) => togglePlateItem(plateCarb, setPlateCarb, item)}
          veg={plateVeg} onVeg={(item) => togglePlateItem(plateVeg, setPlateVeg, item)}
          fat={plateFat} onFat={(item) => togglePlateItem(plateFat, setPlateFat, item)}
          extra={plateExtra} onExtra={(item) => togglePlateItem(plateExtra, setPlateExtra, item)}
          onClear={clearPlate}
          proteinTotal={plateProteinTotal}
          calTotal={plateCalTotal}
          isBalanced={isBalanced}
          fullness={plateFullness}
        />
      )}

      {activeTab === 'restaurants' && <RestaurantGuide />}
    </div>
  );
}

function MealCard({ meal, expanded, onToggle }: { meal: Meal; expanded: boolean; onToggle: () => void }) {
  return (
    <article className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-moon-border/40 bg-white shadow-soft transition-all duration-200 hover:shadow-[0_20px_48px_rgba(71,44,89,0.11)]">
      <div className="bg-gradient-to-br from-moon-surface/45 to-[#EDE0FA]/25 p-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-soft sm:h-12 sm:w-12 sm:text-3xl">
            {meal.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg leading-tight tracking-[-0.01em]">{meal.name}</h3>
            <p className="mt-0.5 text-[11px] text-moon-muted/60">{meal.bestFor}</p>
          </div>
          <div className="shrink-0 rounded-2xl bg-white/65 px-2.5 py-1.5 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-moon-muted/50">Protein</p>
            <p className="font-display text-lg leading-none text-moon-text sm:text-xl">~{meal.protein}g</p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-3 gap-1.5">
          <NutriPill label="Fullness" value={`${meal.fullness}/5`} />
          <NutriPill label="~Cal" value={`${meal.calories}`} />
          <NutriPill label="Time" value={meal.prepTime} />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-1.5 min-[380px]:grid-cols-2">
          {(Object.entries(meal.portions) as Array<[string, string]>).map(([key, value]) => (
            <div key={key} className="min-w-0 rounded-xl bg-moon-bg/60 px-2.5 py-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-moon-muted/45">
                {PORTION_LABELS[key] ?? key}
              </p>
              <p className="mt-0.5 break-words text-[11px] font-semibold leading-snug">{value}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="no-active-scale mt-3 flex w-full items-center justify-between rounded-2xl bg-moon-bg/55 px-4 py-2.5 text-left text-[12px] font-semibold text-moon-muted/65 transition hover:bg-moon-bg"
        >
          <span>Swaps &amp; boosts</span>
          <ChevronDown size={14} className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        {expanded && (
          <div className="mt-2.5 grid gap-2">
            <div className="rounded-2xl border border-moon-accent/20 bg-moon-surface/30 p-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-moon-muted/50">Protein boost</p>
              <p className="mt-1 text-[12px] font-semibold">{meal.proteinBoost}</p>
            </div>
            <div className="rounded-2xl border border-moon-border/30 bg-moon-bg/60 p-3">
              <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-moon-muted/50">Easy swap</p>
              <p className="mt-1 text-[12px] font-semibold">{meal.swap}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function NutriPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-xl bg-moon-bg/65 px-2 py-2 text-center sm:px-2.5">
      <span className="block truncate text-[9px] font-bold uppercase tracking-[0.08em] text-moon-muted/45 sm:tracking-[0.1em]">{label}</span>
      <span className="mt-0.5 block truncate text-[11px] font-bold text-moon-text">{value}</span>
    </div>
  );
}

function BuildMyPlate({
  protein, onProtein, carb, onCarb, veg, onVeg, fat, onFat, extra, onExtra, onClear,
  proteinTotal, calTotal, isBalanced, fullness
}: {
  protein: PlateItem[]; onProtein: (item: PlateItem) => void;
  carb: PlateItem[]; onCarb: (item: PlateItem) => void;
  veg: PlateItem[]; onVeg: (item: PlateItem) => void;
  fat: PlateItem[]; onFat: (item: PlateItem) => void;
  extra: PlateItem[]; onExtra: (item: PlateItem) => void;
  onClear: () => void;
  proteinTotal: number; calTotal: number; isBalanced: boolean; fullness: number;
}) {
  const plateItems = [...protein, ...carb, ...veg, ...fat, ...extra];

  return (
    <div className="grid min-w-0 max-w-full gap-3 overflow-x-hidden">
      <section className="min-w-0 overflow-hidden rounded-[2rem] border border-moon-border/40 bg-white shadow-soft">
        <div className="bg-gradient-to-br from-[#F4EAFF] via-[#EDE0FA] to-[#D8C8F5]/50 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">Build My Plate</h2>
              <p className="mt-1.5 text-[13px] text-moon-muted/70">Pick as many as you like from each category.</p>
            </div>
            {plateItems.length > 0 && (
              <button
                type="button"
                onClick={onClear}
                className="no-active-scale shrink-0 rounded-2xl border border-moon-border/40 bg-white/60 px-3 py-1.5 text-[12px] font-semibold text-moon-muted/60 transition-all hover:bg-white"
              >
                Clear plate
              </button>
            )}
          </div>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex justify-center">
            <div
              className="relative flex h-44 w-44 items-center justify-center rounded-full border-4 border-moon-border/20 bg-gradient-to-br from-moon-bg to-moon-surface/40"
              style={{ boxShadow: '0 4px 32px rgba(71, 44, 89, 0.10), inset 0 2px 8px rgba(71, 44, 89, 0.05)' }}
            >
              {plateItems.length > 0 ? (
                <div className="flex flex-wrap items-center justify-center gap-2 p-4">
                  {plateItems.map((item) => (
                    <span key={item.id} className="text-3xl" title={item.name} aria-label={item.name}>
                      {item.emoji}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="px-6 text-center text-[12px] text-moon-muted/40">Start picking below</p>
              )}
            </div>
          </div>

          {plateItems.length > 0 && (
            <div className="mt-5 grid grid-cols-3 gap-1.5 sm:gap-3">
              <div className="rounded-2xl bg-moon-surface/50 p-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-moon-muted/50">Protein</p>
                <p className="mt-1 font-display text-xl sm:text-2xl">~{proteinTotal}g</p>
              </div>
              <div className="rounded-2xl bg-moon-bg/70 p-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-moon-muted/50">Calories</p>
                <p className="mt-1 font-display text-xl sm:text-2xl">~{calTotal}</p>
              </div>
              <div className="rounded-2xl bg-moon-bg/70 p-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-moon-muted/50">Fullness</p>
                <p className="mt-1 font-display text-xl sm:text-2xl">{fullness > 0 ? `${fullness}/5` : '–'}</p>
              </div>
            </div>
          )}

          {isBalanced && (
            <div className="mt-3 rounded-2xl border border-[#C3E6C8]/60 bg-[#EFF9F0] p-3 text-center">
              <p className="text-[13px] font-semibold text-[#3a7d44]">
                {proteinTotal >= 30
                  ? 'Balanced and protein-rich. Good call.'
                  : 'Balanced meal. Add a protein boost if still hungry.'}
              </p>
            </div>
          )}
        </div>
      </section>

      <PlateSection title="🤚 Protein" subtitle="Palm-sized" items={PLATE_PROTEINS} selected={protein} onSelect={onProtein} />
      <PlateSection title="✊ Carbs" subtitle="Fist-sized" items={PLATE_CARBS} selected={carb} onSelect={onCarb} />
      <PlateSection title="🤲 Veg" subtitle="Two handfuls" items={PLATE_VEGS} selected={veg} onSelect={onVeg} />
      <PlateSection title="👍 Fat" subtitle="Thumb-sized" items={PLATE_FATS} selected={fat} onSelect={onFat} />
      <PlateSection title="🫴 Add-on" subtitle="Optional" items={PLATE_EXTRAS} selected={extra} onSelect={onExtra} optional />
    </div>
  );
}

function PlateSection({
  title, subtitle, items, selected, onSelect, optional
}: {
  title: string; subtitle: string; items: PlateItem[];
  selected: PlateItem[]; onSelect: (item: PlateItem) => void; optional?: boolean;
}) {
  return (
    <section className="min-w-0 rounded-[2rem] border border-moon-border/40 bg-white p-4 shadow-soft sm:p-5">
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="font-display text-lg leading-tight tracking-[-0.01em] sm:text-xl">{title}</h3>
        <span className="text-[11px] text-moon-muted/45">{optional ? 'optional · ' : ''}{subtitle}</span>
      </div>
      <div className="mt-2.5 flex min-w-0 flex-wrap gap-2">
        {items.map((item) => {
          const isActive = selected.some((s) => s.id === item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item)}
              className={`no-active-scale flex min-h-10 max-w-full items-center gap-1.5 rounded-2xl border px-3 py-1.5 text-[12px] font-semibold transition-all duration-200 ${
                isActive
                  ? 'border-moon-accent bg-moon-accent text-white'
                  : 'border-moon-border/40 bg-moon-bg text-moon-muted/70 hover:bg-moon-surface/40'
              }`}
              style={isActive ? { boxShadow: '0 2px 10px rgba(191, 162, 220, 0.35)' } : undefined}
            >
              <span aria-hidden="true">{item.emoji}</span>
              <span className="truncate">{item.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function RestaurantGuide() {
  const [activeCategory, setActiveCategory] = useState<RestaurantCategory | 'all'>('all');
  const filtered = activeCategory === 'all' ? RESTAURANTS : RESTAURANTS.filter((r) => r.category === activeCategory);

  return (
    <div className="grid min-w-0 max-w-full gap-3 overflow-x-hidden">
      <section className="min-w-0 overflow-hidden rounded-[2rem] border border-moon-border/40 bg-white shadow-soft">
        <div className="bg-gradient-to-br from-[#F4EAFF] via-[#EDE0FA] to-[#D8C8F5]/50 p-4 sm:p-5">
          <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">Ordering out?</h2>
          <p className="mt-1.5 text-[13px] text-moon-muted/70">
            Treat meals are allowed. We're just making choices easier.
          </p>
        </div>
      </section>

      <div className="no-scrollbar -mx-4 flex max-w-[100vw] gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:max-w-full sm:flex-wrap sm:px-0">
        <button
          type="button"
          onClick={() => setActiveCategory('all')}
          className={`no-active-scale shrink-0 rounded-2xl px-3.5 py-2 text-[12px] font-semibold transition-all duration-200 ${
            activeCategory === 'all'
              ? 'bg-moon-accent text-white'
              : 'border border-moon-border/40 bg-white text-moon-muted/70'
          }`}
          style={activeCategory === 'all' ? { boxShadow: '0 4px 16px rgba(191, 162, 220, 0.38)' } : undefined}
        >
          All
        </button>
        {RESTAURANT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`no-active-scale shrink-0 rounded-2xl px-3.5 py-2 text-[12px] font-semibold transition-all duration-200 ${
              activeCategory === cat.id
                ? 'bg-moon-accent text-white'
                : 'border border-moon-border/40 bg-white text-moon-muted/70'
            }`}
            style={activeCategory === cat.id ? { boxShadow: '0 4px 16px rgba(191, 162, 220, 0.38)' } : undefined}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((r) => (
          <article key={r.name} className="min-w-0 rounded-[2rem] border border-moon-border/40 bg-white p-4 shadow-soft sm:p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-moon-surface/50 text-xl">
                {r.emoji}
              </span>
              <h3 className="font-display text-lg leading-tight tracking-[-0.01em] sm:text-xl">{r.name}</h3>
            </div>
            <div className="mt-3 grid gap-2">
              <RestaurantChoice label="🟢 Great choice" body={r.best} color="green" />
              <RestaurantChoice label="🟡 Good choice" body={r.balanced} color="purple" />
              <RestaurantChoice label="🟠 Treat yourself" body={r.treat} color="neutral" />
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function RestaurantChoice({ label, body, color }: { label: string; body: string; color: 'green' | 'purple' | 'neutral' }) {
  const styles: Record<string, string> = {
    green: 'bg-[#EFF9F0] border-[#C3E6C8]/60 text-[#3a7d44]',
    purple: 'bg-moon-surface/40 border-moon-border/40 text-moon-text',
    neutral: 'bg-moon-bg/70 border-moon-border/30 text-moon-muted/70',
  };
  return (
    <div className={`min-w-0 rounded-2xl border p-3 ${styles[color]}`}>
      <p className="text-[9px] font-bold uppercase tracking-[0.13em] opacity-60">{label}</p>
      <p className="mt-1 break-words text-[12px] font-medium leading-relaxed">{body}</p>
    </div>
  );
}

function NutritionTargets() {
  const [open, setOpen] = useState(false);

  const zones = [
    { label: 'Protein', green: '120–130g', yellow: '100–120g', note: 'Focus here first' },
    { label: 'Calories', green: '1,850–2,000', yellow: '1,700–2,150', note: '' },
    { label: 'Carbs', green: '180–220g', yellow: '', note: '' },
    { label: 'Fat', green: '55–70g', yellow: '', note: '' },
    { label: 'Fiber', green: '25–35g', yellow: '', note: '' },
    { label: 'Water', green: '80–100 oz', yellow: '', note: '' },
  ];

  const plateGoals = [
    { emoji: '🖐️', label: 'Protein', amount: '4–5 palms', why: 'Gets you close to 120–130g protein.' },
    { emoji: '✊', label: 'Carbs', amount: '3–4 fists', why: 'Enough to fuel lifting and recovery without overdoing it.' },
    { emoji: '🥬', label: 'Vegetables', amount: '4–6 handfuls', why: 'Flexible and easier to hit than a fixed 5+.' },
    { emoji: '👍', label: 'Healthy fats', amount: '3 thumbs (up to 4 if eating leaner)', why: 'Supports hormones and satiety without crowding out protein.' },
    { emoji: '🍎', label: 'Fruit', amount: '1–2 handfuls', why: 'Plenty for fiber and micronutrients.' },
  ];

  const mealRhythm = [
    { emoji: '🍳', label: 'Breakfast', target: '25–30g protein' },
    { emoji: '🥗', label: 'Lunch', target: '30–35g protein' },
    { emoji: '🍝', label: 'Dinner', target: '30–35g protein' },
    { emoji: '🥤', label: 'Snack', target: '20–30g protein' },
  ];

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-[2rem] border border-moon-border/40 bg-white shadow-soft">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="no-active-scale flex w-full items-center justify-between gap-3 p-4"
        aria-expanded={open}
      >
        <div className="min-w-0 flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-moon-surface/60">
            <Sparkles size={14} className="text-moon-accent" aria-hidden="true" />
          </span>
          <div className="min-w-0 text-left">
            <p className="text-[13px] font-bold text-moon-text">Your targets</p>
            {!open && (
              <p className="truncate text-[11px] text-moon-muted/55">120g protein · 1,850–2,000 cal/day</p>
            )}
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-moon-muted/40 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className="min-w-0 border-t border-moon-border/25 px-4 pb-5 pt-4">
          <div className="rounded-2xl bg-moon-surface/50 p-3.5">
            <p className="text-[12px] font-semibold leading-relaxed text-moon-text">
              If you only track one thing, track{' '}
              <span className="text-moon-accent">protein</span>. Aim for 120g/day.
              Everything else can be estimated.
            </p>
          </div>

          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-moon-muted/50">Daily green zones</p>
          <div className="mt-2 grid gap-1.5">
            {zones.map((row) => (
              <div key={row.label} className="flex flex-wrap items-center gap-2 rounded-xl bg-moon-bg/60 px-3 py-2">
                <span className="w-14 shrink-0 text-[11px] font-bold text-moon-muted/60">{row.label}</span>
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  <span className="rounded-lg bg-[#EFF9F0] px-2 py-0.5 text-[11px] font-semibold text-[#3a7d44]">
                    🟢 {row.green}
                  </span>
                  {row.yellow && (
                    <span className="rounded-lg bg-[#FFFBEA] px-2 py-0.5 text-[11px] font-semibold text-[#8a6a00]">
                      🟡 {row.yellow}
                    </span>
                  )}
                </div>
                {row.note && (
                  <span className="basis-full text-[10px] font-semibold text-moon-accent sm:ml-auto sm:basis-auto">{row.note}</span>
                )}
              </div>
            ))}
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-moon-muted/50">Today's plate</p>
          <div className="mt-2 grid gap-1.5">
            {plateGoals.map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-xl bg-moon-bg/60 px-3 py-2.5">
                <span className="mt-0.5 text-xl leading-none">{item.emoji}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <p className="text-[11px] font-bold text-moon-text">{item.label}</p>
                    <p className="text-[11px] font-semibold text-moon-accent">{item.amount}</p>
                  </div>
                  <p className="mt-0.5 text-[11px] leading-snug text-moon-muted/55">{item.why}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.18em] text-moon-muted/50">Meal rhythm</p>
          <div className="mt-2 grid gap-1.5">
            {mealRhythm.map((meal) => (
              <div key={meal.label} className="flex flex-wrap items-center gap-2 rounded-xl bg-moon-bg/60 px-3 py-2.5 sm:gap-3">
                <span className="text-lg">{meal.emoji}</span>
                <span className="text-[12px] font-semibold text-moon-text">{meal.label}</span>
                <span className="text-[12px] font-semibold text-moon-accent sm:ml-auto">{meal.target}</span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-moon-muted/50">
            You don't need to hit exact numbers every day to make progress. The green zone is a range, not a report card.
          </p>
        </div>
      )}
    </div>
  );
}

function SettingsPage({ settings, refresh }: { settings: ReturnType<typeof useLiveData>['settings']; refresh: () => void }) {
  const [startDate, setStartDate] = useState(settings.startDate);
  const [message, setMessage] = useState('');

  const saveSettings = async () => {
    await db.settings.put({ ...settings, startDate });
    refresh();
    setMessage('Start date saved.');
  };

  const handleExport = async () => {
    const payload = await exportBackup();
    downloadJson(`grow-strong-backup-${new Date().toISOString().slice(0, 10)}.json`, payload);
  };

  const handleImport = async (file?: File) => {
    if (!file) return;
    const payload = JSON.parse(await file.text()) as BackupPayload;
    await importBackup(payload);
    refresh();
    setMessage('Backup imported.');
  };

  const handleReset = async () => {
    const confirmed = window.confirm('Reset all Grow Strong data on this device? This cannot be undone.');
    if (!confirmed) return;
    await resetAllData();
    refresh();
    setMessage('Fresh plan planted.');
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <section className="rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
        <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">Plan start</h2>
        <TextInput label="Start date" type="date" value={startDate} onChange={setStartDate} />
        <button
          type="button"
          onClick={saveSettings}
          className="mt-4 min-h-12 w-full rounded-2xl bg-moon-accent px-4 text-[13px] font-bold text-white transition"
          style={{ boxShadow: '0 4px 18px rgba(191, 162, 220, 0.40)' }}
        >
          Save start date
        </button>
      </section>
      <section className="rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
        <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">Local data</h2>
        <div className="mt-4 grid gap-3">
          <button
            type="button"
            onClick={handleExport}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-moon-bg/70 px-4 text-[13px] font-semibold transition hover:bg-moon-bg"
          >
            <Download size={17} aria-hidden="true" /> Export JSON backup
          </button>
          <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-2xl bg-moon-bg/70 px-4 text-[13px] font-semibold transition hover:bg-moon-bg">
            <Upload size={17} aria-hidden="true" /> Import JSON backup
            <input type="file" accept="application/json" className="sr-only" onChange={(event) => handleImport(event.target.files?.[0])} />
          </label>
          <button
            type="button"
            onClick={handleReset}
            className="flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-moon-border/50 px-4 text-[13px] font-semibold text-moon-muted/70 transition hover:border-moon-border"
          >
            <RotateCcw size={17} aria-hidden="true" /> Reset data
          </button>
        </div>
        {message && (
          <p className="mt-4 rounded-2xl bg-moon-surface/50 p-3 text-[13px] font-semibold">{message}</p>
        )}
      </section>
      <section className="rounded-[2rem] border border-moon-border/35 bg-moon-surface/50 p-5 shadow-soft lg:col-span-2">
        <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">GitHub Pages note</h2>
        <p className="mt-2 text-[13px] leading-relaxed text-moon-muted/60">
          This repo publishes with GitHub Actions. In GitHub, choose Settings, Pages, then GitHub Actions as the source.
        </p>
      </section>
    </div>
  );
}

function WorkoutGuide({ workout }: { workout: WorkoutDay }) {
  const warmUpNames = namesForIds(workout.warmUp ?? []);
  const coolDownNames = namesForIds(workout.coolDown ?? []);
  return (
    <div className="mt-4 grid gap-3">
      {workout.effortTarget && <MiniBlock title="Effort target" body={workout.effortTarget} />}
      {workout.coachNote && <MiniBlock title="Coach's note" body={workout.coachNote} />}
      {workout.walkingTarget && <MiniBlock title="Walking target" body={workout.walkingTarget} />}
      {warmUpNames.length > 0 && <MiniBlock title="Warm-up, 5-8 minutes" body={warmUpNames.join(', ')} />}
      {coolDownNames.length > 0 && <MiniBlock title="Cool-down, 5-10 minutes" body={coolDownNames.join(', ')} />}
    </div>
  );
}

function ExerciseChips({ ids }: { ids: string[] }) {
  if (!ids.length) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {ids.map((id) => (
        <span key={id} className="rounded-full border border-moon-border/40 bg-white px-3 py-1.5 text-[11px] font-semibold text-moon-muted/60">
          {exerciseById.get(id)?.name ?? id}
        </span>
      ))}
    </div>
  );
}

function namesForIds(ids: string[]) {
  return ids.map((id) => exerciseById.get(id)?.name ?? id);
}

function checklistItems(workout: WorkoutDay): ChecklistItem[] {
  if (workout.type === 'Rest') {
    return [{ key: `${workout.id}-rest`, label: 'Complete rest day', section: 'Rest' }];
  }
  const isStrength = workout.type.startsWith('Strength');
  const hasWalkExercise = workout.exercises.includes('walking');
  return [
    ...(workout.warmUp ?? []).map((id, index) => checklistItem(workout.id, 'Warm-up', id, index, warmUpPrescriptionFor(id))),
    ...workout.exercises.map((id, index) =>
      checklistItem(workout.id, 'Workout', id, index,
        isStrength ? workoutPrescriptionFor(id, workout.week) : mobilityPrescriptionFor(id)
      )
    ),
    ...(workout.walkingTarget && !hasWalkExercise
      ? [{ key: `${workout.id}-walk`, label: `Walk — ${workout.walkingTarget}`, section: 'Walk' as const, exerciseId: 'walking' }]
      : []),
    ...(workout.coolDown ?? []).map((id, index) => checklistItem(workout.id, 'Cool-down', id, index, coolDownPrescriptionFor(id)))
  ];
}

function checklistItem(workoutId: string, section: ChecklistItem['section'], exerciseId: string, index: number, prescription?: string): ChecklistItem {
  const name = exerciseById.get(exerciseId)?.name ?? exerciseId;
  return {
    key: `${workoutId}-${section.toLowerCase()}-${index}-${exerciseId}`,
    label: prescription ? `${name} — ${prescription}` : name,
    section,
    exerciseId
  };
}

function checkedCount(workout: WorkoutDay) {
  const items = checklistItems(workout);
  if (workout.completed && !workout.itemCompletions) return items.length;
  return items.filter((item) => itemIsDone(workout, item)).length;
}

function dailyProgressRows(workouts: WorkoutDay[], week: number) {
  return workouts
    .filter((workout) => workout.week === week)
    .map((workout) => {
      const total = checklistItems(workout).length;
      const completed = completedItemsForWorkout(workout);
      return {
        label: workout.day.slice(0, 3),
        type: workout.type,
        completed,
        total,
        value: total ? Math.round((completed / total) * 100) : 0
      };
    });
}

function completedItemsForWorkout(workout: WorkoutDay) {
  return checkedCount(workout);
}

function movementTotals(workouts: WorkoutDay[]) {
  const totals = new Map<string, { id: string; name: string; count: number }>();
  workouts.forEach((workout) => {
    checklistItems(workout).forEach((item) => {
      if (!item.exerciseId || !itemIsDone(workout, item)) return;
      const exercise = exerciseById.get(item.exerciseId);
      const current = totals.get(item.exerciseId) ?? {
        id: item.exerciseId,
        name: exercise?.name ?? item.exerciseId,
        count: 0
      };
      current.count += 1;
      totals.set(item.exerciseId, current);
    });
  });
  return Array.from(totals.values()).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function itemCompletionMap(items: ChecklistItem[], value: boolean) {
  return Object.fromEntries(items.map((item) => [item.key, value]));
}

function itemIsDone(workout: WorkoutDay, item: ChecklistItem) {
  if (workout.completed && !workout.itemCompletions) return true;
  return Boolean(workout.itemCompletions?.[item.key]);
}

function ElbowNote({ value }: { value?: number }) {
  const rule = value === undefined ? elbowRules[0] : value <= 2 ? elbowRules[0] : value <= 4 ? elbowRules[1] : elbowRules[2];
  return (
    <div className="mt-3 rounded-2xl bg-moon-surface/45 p-3 text-[13px] leading-relaxed text-moon-text">
      {rule}
    </div>
  );
}

function NumberInput({ label, min, max, value, onChange }: { label: string; min: number; max: number; value?: number; onChange: (value?: number) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-moon-muted/55">{label}</span>
      <input
        type="number"
        min={min}
        max={max}
        value={value ?? ''}
        onChange={(event) => onChange(event.target.value === '' ? undefined : Number(event.target.value))}
        className="mt-2 min-h-12 w-full rounded-2xl border border-moon-border/40 bg-moon-bg px-4 text-base font-semibold"
      />
    </label>
  );
}

function SliderInput({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return (
    <label className="block rounded-2xl bg-moon-bg/50 px-3 py-3">
      <span className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-moon-muted/55">{label}</span>
        <span
          className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-moon-text"
          style={{ boxShadow: '0 1px 4px rgba(71,44,89,0.07)' }}
        >
          {value}/10
        </span>
      </span>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 w-full"
      />
    </label>
  );
}

function TextInput({ label, type, value, onChange }: { label: string; type: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-moon-muted/55">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-12 w-full rounded-2xl border border-moon-border/40 bg-moon-bg px-4 text-base"
      />
    </label>
  );
}

function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-moon-muted/55">{label}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={3}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-moon-border/40 bg-moon-bg p-3 text-[13px] leading-relaxed"
      />
    </label>
  );
}

function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-12 w-full appearance-none rounded-2xl border border-moon-border/40 bg-moon-bg px-4 pr-9 text-[13px] font-semibold"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-3.5 text-moon-muted/35" size={15} aria-hidden="true" />
    </label>
  );
}

function Pill({ icon: Icon, text }: { icon: typeof Sparkles; text: string }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-white/68 px-3 py-1.5 text-[11px] font-semibold tracking-wide text-moon-muted/70"
      style={{ boxShadow: '0 1px 4px rgba(71, 44, 89, 0.07)' }}
    >
      <Icon size={12} aria-hidden="true" className="opacity-55" />
      {text}
    </span>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-14 w-14 shrink-0" aria-label={`${percent}% complete`} role="img">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={radius} fill="none" stroke="#EFE3FA" strokeWidth="4.5" />
        <circle
          cx="28"
          cy="28"
          r={radius}
          fill="none"
          stroke="#BFA2DC"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] font-black text-moon-text">{percent}%</span>
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, detail }: { icon: typeof Flame; label: string; value: string; detail: string }) {
  return (
    <div className="rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-moon-muted/50">{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-moon-surface/55">
          <Icon size={14} className="text-moon-accent" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-2.5 font-display text-4xl leading-none tracking-[-0.02em]">{value}</p>
      <p className="mt-2 text-[12px] leading-relaxed text-moon-muted/55">{detail}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
      <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">{title}</h2>
      <div className="mt-4 h-[240px] w-full">{children}</div>
    </section>
  );
}

function GuideCard({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="rounded-[2rem] border border-moon-border/40 bg-white p-5 shadow-soft">
      <h2 className="font-display text-2xl leading-tight tracking-[-0.01em]">{title}</h2>
      <ul className="mt-4 grid gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-moon-bg/55 px-4 py-3 text-[13px] font-medium leading-relaxed text-moon-muted/70">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function DetailBlock({ title, body }: { title: string; body: string }) {
  return (
    <section className="mt-5">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-moon-muted/55">{title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-moon-muted/70">{body}</p>
    </section>
  );
}

function DetailList({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="mt-5">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-moon-muted/55">{title}</h3>
      <ul className="mt-2 grid gap-2">
        {items.map((item) => (
          <li key={item} className="rounded-2xl bg-moon-bg/55 px-4 py-3 text-[13px] leading-relaxed text-moon-muted/65">
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function MiniBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-2xl bg-moon-bg/55 px-4 py-3">
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-moon-muted/50">{title}</p>
      <p className="mt-1.5 text-[13px] font-semibold leading-snug">{body}</p>
    </div>
  );
}

function titleForRoute(route: Route) {
  const titles: Record<Route, string> = {
    dashboard: 'Today',
    plan: 'Plan',
    exercises: 'Moves',
    progress: 'Progress',
    nutrition: 'Food',
    settings: 'Settings'
  };
  return titles[route];
}


function numberOrUndefined(value: string) {
  return value.trim() === '' ? undefined : Number(value);
}

function capitalize(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}
