"use client";

import { useState } from "react";
import type { WritingExercise as WritingExerciseType } from "@/lib/types";
import AudioButton from "@/components/ui/AudioButton";

interface Props {
  exercise: WritingExerciseType;
  onComplete: (correct: boolean) => void;
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ");
}

export default function WritingExercise({ exercise, onComplete }: Props) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function handleSubmit() {
    if (!input.trim()) return;
    const normalized = normalize(input);
    const correct =
      normalized === normalize(exercise.answer) ||
      exercise.alternativeAnswers?.some((a) => normalize(a) === normalized) ||
      false;
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !submitted) {
      handleSubmit();
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
        Escriu en rus:
      </div>
      <div className="text-xl text-navy-700 dark:text-gold-400 font-semibold">
        {exercise.prompt}
      </div>

      {exercise.hint && !submitted && (
        <div className="text-sm text-gray-500 dark:text-gray-400 italic">
          Pista: {exercise.hint}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitted}
          placeholder="Escriu aquí en ciríl·lic..."
          className={`w-full p-4 text-xl rounded-lg border-2 transition-colors
            bg-white dark:bg-gray-800
            ${
              submitted
                ? isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-950"
                  : "border-red-500 bg-red-50 dark:bg-red-950"
                : "border-gray-300 dark:border-gray-600 focus:border-navy-500 dark:focus:border-gold-500"
            }
            outline-none`}
          autoFocus
          lang="ru"
        />
      </div>

      {!submitted && (
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
        <div
          className={`p-4 rounded-lg ${
            isCorrect
              ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
              : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{isCorrect ? "\u2705" : "\u274C"}</span>
            <span className="font-bold text-lg">
              {isCorrect ? "Correcte!" : "Incorrecte"}
            </span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">Resposta:</span>
              <span className="text-xl font-semibold">{exercise.answer}</span>
              <AudioButton text={exercise.answer} size="sm" />
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Transliteració: {exercise.transliteration}
            </div>
            {!isCorrect && input.trim() && (
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Has escrit: <span className="font-mono">{input}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
