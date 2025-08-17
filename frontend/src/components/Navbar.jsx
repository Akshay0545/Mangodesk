import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  return (
    <header className="border-b bg-white/60 backdrop-blur dark:bg-gray-900/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
            M
          </span>
          <h1 className="text-lg font-semibold tracking-tight dark:text-gray-100">Minutes-AI</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-sm text-gray-500 dark:text-gray-400">
            AI-powered transcript summarization
          </span>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
