"use client";

import { useState } from "react";
import type { DictationExercise as DictationType } from "@/lib/types";
import { speakRussian, isSpeechAvailable } from "@/lib/speech";

interface Props {
  exercise: DictationType;
  onComplete: (correct: boolean) => void;
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ");
}

export default function DictationExercise({ exercise, onComplete }: Props) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [played, setPlayed] = useState(false);
  const [playing, setPlaying] = useState(false);

  async function handlePlay() {
    if (playing) return;
    setPlaying(true);
    try {
      await speakRussian(exercise.text);
      setPlayed(true);
    } finally {
      setPlaying(false);
    }
  }

  function handleSubmit() {
    if (!input.trim()) return;
    const correct = normalize(input) === normalize(exercise.text);
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct);
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
        Escolta i escriu:
      </div>

      <button
        onClick={handlePlay}
        disabled={playing}
        className={`flex items-center gap-3 mx-auto px-8 py-5 rounded-xl text-white font-medium text-lg
          transition-all duration-200
          ${playing
            ? "bg-navy-400 dark:bg-gold-700 animate-pulse"
            : "bg-navy-600 hover:bg-navy-700 dark:bg-gold-600 dark:hover:bg-gold-700"
          }`}
      >
        <span className="text-3xl">{playing ? "..." : "\u{1F3A7}"}</span>
        <span>{played ? "Tornar a escoltar" : "Reprodueix"}</span>
      </button>

      {!isSpeechAvailable() && (
        <div className="text-sm text-amber-600 dark:text-amber-400 text-center">
          El teu navegador no suporta àudio. Consulta la transliteració:
          <br />
          <strong>{exercise.transliteration}</strong>
        </div>
      )}

      {played && (
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !submitted && handleSubmit()}
          disabled={submitted}
          placeholder="Escriu el que has escoltat..."
          className={`w-full p-4 text-xl rounded-lg border-2 transition-colors outline-none
            bg-white dark:bg-gray-800
            ${submitted
              ? isCorrect
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
              : "border-gray-300 dark:border-gray-600 focus:border-navy-500 dark:focus:border-gold-500"
            }`}
          autoFocus
          lang="ru"
        />
      )}

      {played && !submitted && (
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-full py-3 px-6 rounded-lg font-medium text-white
            bg-navy-600 hover:bg-navy-700 disabled:bg-gray-300 disabled:text-gray-500
            dark:bg-gold-600 dark:hover:bg-gold-700 dark:disabled:bg-gray-700
            transition-colors"
        >
          Comprova
        </button>
      )}

      {submitted && (
        <div className={`p-4 rounded-lg ${
          isCorrect
            ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{isCorrect ? "\u2705" : "\u274C"}</span>
            <span className="font-bold">{isCorrect ? "Perfecte!" : "Incorrecte"}</span>
          </div>
          <div>
            <span className="font-medium">Text: </span>
            <span className="text-lg">{exercise.text}</span>
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {exercise.transliteration} · {exercise.catalan}
          </div>
        </div>
      )}
    </div>
  );
}
