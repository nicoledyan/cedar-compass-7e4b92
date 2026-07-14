import { useMemo, useState } from 'react';

const STORAGE_KEY = 'cedar-compass:springs-guide:completed';

function readCompleted(): Set<string> {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return new Set(Array.isArray(value) ? value.filter((id): id is string => typeof id === 'string') : []);
  } catch {
    return new Set();
  }
}

export function useGuideProgress() {
  const [completed, setCompleted] = useState<Set<string>>(readCompleted);
  const persist = (next: Set<string>) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]));
    setCompleted(next);
  };
  return useMemo(() => ({
    completed,
    toggle(id: string) {
      const next = new Set(completed);
      next.has(id) ? next.delete(id) : next.add(id);
      persist(next);
    },
    clear() { persist(new Set()); }
  }), [completed]);
}
