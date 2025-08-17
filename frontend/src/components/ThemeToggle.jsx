import React, { useEffect, useState } from 'react';

const STORAGE_KEY = 'minutesai-theme';

function getInitial() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'dark') return true;
  if (saved === 'light') return false;
  // No saved pref → follow system
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(getInitial);

  useEffect(() => {
    const root = document.documentElement; // <html>
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem(STORAGE_KEY, 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem(STORAGE_KEY, 'light');
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(v => !v)}
      className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-200 px-3 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
      title="Toggle theme"
      aria-label="Toggle dark mode"
    >
      {dark ? '🌙' : '☀️'}
    </button>
  );
}
