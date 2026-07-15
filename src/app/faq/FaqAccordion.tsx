"use client";

import { useState } from "react";

export default function FaqAccordion({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gold-500/5 transition-colors"
      >
        <span className="text-white font-medium pr-4">{question}</span>
        <span className={`text-gold-400 text-xl transition-transform duration-200 shrink-0 ${open ? "rotate-45" : ""}`}>
          +
        </span>
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-400 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}
