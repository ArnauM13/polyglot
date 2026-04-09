"use client";

import { useState } from "react";
import type { SentenceBuilderExercise } from "@/lib/types";
import AudioButton from "@/components/ui/AudioButton";

interface Props {
  exercise: SentenceBuilderExercise;
  onComplete: (correct: boolean) => void;
}

export default function SentenceBuilder({ exercise, onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([...exercise.words]);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function selectWord(word: string, index: number) {
    if (submitted) return;
    setSelected([...selected, word]);
    const newAvailable = [...available];
    newAvailable.splice(index, 1);
    setAvailable(newAvailable);
  }

  function removeWord(index: number) {
    if (submitted) return;
    const word = selected[index];
    const newSelected = [...selected];
    newSelected.splice(index, 1);
    setSelected(newSelected);
    setAvailable([...available, word]);
  }

  function handleSubmit() {
    if (selected.length === 0) return;
    const correct =
      JSON.stringify(selected) === JSON.stringify(exercise.correctOrder);
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct);
  }

  const correctSentence = exercise.correctOrder.join(" ");

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
        Ordena les paraules:
      </div>
      <div className="text-base text-navy-700 dark:text-gold-400">
        {exercise.prompt}
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400">
        ({exercise.translation})
      </div>

      {/* Selected words area */}
      <div
        className={`min-h-[60px] p-3 rounded-lg border-2 border-dashed flex flex-wrap gap-2
          ${
            submitted
              ? isCorrect
                ? "border-green-400 bg-green-50 dark:bg-green-950"
                : "border-red-400 bg-red-50 dark:bg-red-950"
              : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
          }`}
      >
        {selected.length === 0 && (
          <span className="text-gray-400 text-sm">
            Toca les paraules per ordenar-les...
          </span>
        )}
        {selected.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => removeWord(i)}
            disabled={submitted}
            className="px-3 py-1.5 rounded-md bg-navy-600 text-white text-lg
              hover:bg-navy-700 dark:bg-gold-600 dark:hover:bg-gold-700
              disabled:opacity-70 transition-colors"
          >
            {word}
          </button>
        ))}
      </div>

      {/* Available words */}
      <div className="flex flex-wrap gap-2">
        {available.map((word, i) => (
          <button
            key={`${word}-${i}`}
            onClick={() => selectWord(word, i)}
            disabled={submitted}
            className="px-3 py-1.5 rounded-md border-2 border-gray-300 dark:border-gray-600
              text-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200
              hover:border-navy-400 dark:hover:border-gold-500
              disabled:opacity-50 transition-colors"
          >
            {word}
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected.length === 0}
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
            <span className="font-bold">{isCorrect ? "Correcte!" : "Incorrecte"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Frase correcta:</span>
            <span className="text-lg">{correctSentence}</span>
            <AudioButton text={correctSentence} size="sm" />
          </div>
        </div>
      )}
    </div>
  );
}
