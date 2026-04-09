"use client";

import { useState } from "react";
import type { FillBlankExercise as FillBlankType } from "@/lib/types";
import AudioButton from "@/components/ui/AudioButton";

interface Props {
  exercise: FillBlankType;
  onComplete: (correct: boolean) => void;
}

function normalize(text: string): string {
  return text.trim().toLowerCase().replace(/ё/g, "е").replace(/\s+/g, " ");
}

export default function FillBlankExercise({ exercise, onComplete }: Props) {
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  function handleSubmit() {
    if (!input.trim()) return;
    const normalized = normalize(input);
    const correct =
      normalized === normalize(exercise.blank) ||
      exercise.alternativeAnswers?.some((a) => normalize(a) === normalized) ||
      false;
    setIsCorrect(correct);
    setSubmitted(true);
    onComplete(correct);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !submitted) handleSubmit();
  }

  const fullSentence = exercise.sentence.replace("___", exercise.blank);

  return (
    <div className="space-y-4">
      <div className="text-lg font-medium text-gray-800 dark:text-gray-200">
        Omple el buit:
      </div>

      <div className="text-xl text-gray-800 dark:text-gray-200">
        {exercise.sentence.split("___").map((part, i, arr) => (
          <span key={i}>
            {part}
            {i < arr.length - 1 && (
              <span className="inline-block min-w-[80px] mx-1 border-b-2 border-navy-500 dark:border-gold-500">
                {submitted ? (
                  <span
                    className={`font-bold ${
                      isCorrect ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {input}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full bg-transparent outline-none text-center text-xl font-bold
                      text-navy-700 dark:text-gold-400"
                    autoFocus
                    lang="ru"
                  />
                )}
              </span>
            )}
          </span>
        ))}
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
        Pista: {exercise.hint}
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
            <span className="font-bold">{isCorrect ? "Correcte!" : "Incorrecte"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Frase completa:</span>
            <span className="text-lg">{fullSentence}</span>
            <AudioButton text={fullSentence} size="sm" />
          </div>
          {!isCorrect && (
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Resposta correcta: <strong>{exercise.blank}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
