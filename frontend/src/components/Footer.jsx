import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Minutes-AI · Built with React + Tailwind
      </div>
    </footer>
  );
}
