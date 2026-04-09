"use client";

import { useState } from "react";
import type { TranslationExercise as TranslationType } from "@/lib/types";
import AudioButton from "@/components/ui/AudioButton";

interface Props {
  exercise: TranslationType;
  onComplete: (correct: boolean) => void;
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ").replace(/[.,!?]/g, "");
}

export default function TranslationExercise({ exercise, onComplete }: Props) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function handleSubmit() {
    if (!input.trim()) return;
    const norm = normalize(input);
    const correct =
      norm === normalize(exercise.correctTranslation) ||
      exercise.alternativeTranslations?.some((a) => normalize(a) === norm) ||
      false;
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct);
  }

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
        Tradueix al català:
      </div>

      <div className="flex items-center gap-3 p-4 bg-navy-50 dark:bg-navy-900 rounded-xl">
        <span className="text-2xl font-semibold text-navy-800 dark:text-gold-300">
          {exercise.russian}
        </span>
        <AudioButton text={exercise.russian} size="md" />
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !submitted && handleSubmit()}
        disabled={submitted}
        placeholder="Traducció en català..."
        className={`w-full p-4 text-xl rounded-lg border-2 transition-colors outline-none
          bg-white dark:bg-gray-800
          ${submitted
            ? isCorrect
              ? "border-green-500 bg-green-50 dark:bg-green-950"
              : "border-red-500 bg-red-50 dark:bg-red-950"
            : "border-gray-300 dark:border-gray-600 focus:border-navy-500 dark:focus:border-gold-500"
          }`}
        autoFocus
      />

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
        <div className={`p-4 rounded-lg ${
          isCorrect
            ? "bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800"
            : "bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800"
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">{isCorrect ? "\u2705" : "\u274C"}</span>
            <span className="font-bold">{isCorrect ? "Correcte!" : "Incorrecte"}</span>
          </div>
          <div>
            <span className="font-medium">Traducció: </span>
            <span>{exercise.correctTranslation}</span>
          </div>
          {exercise.alternativeTranslations && exercise.alternativeTranslations.length > 0 && (
            <div className="text-sm text-gray-500 mt-1">
              També vàlid: {exercise.alternativeTranslations.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
