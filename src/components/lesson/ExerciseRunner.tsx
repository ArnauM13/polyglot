"use client";

import { useState } from "react";
import type { Exercise } from "@/lib/types";
import WritingExercise from "@/components/exercise/WritingExercise";
import SentenceBuilder from "@/components/exercise/SentenceBuilder";
import FillBlankExercise from "@/components/exercise/FillBlankExercise";
import DictationExercise from "@/components/exercise/DictationExercise";
import TranslationExercise from "@/components/exercise/TranslationExercise";

interface Props {
  exercise: Exercise;
  onNext: () => void;
}

export default function ExerciseRunner({ exercise, onNext }: Props) {
  const [done, setDone] = useState(false);

  function handleComplete(_correct: boolean) {
    setDone(true);
  }

  const labels: Record<Exercise["type"], string> = {
    writing: "✍️ Escriptura",
    "sentence-builder": "🔀 Ordena la frase",
    "fill-blank": "📝 Omple el buit",
    dictation: "🎧 Dictació",
    translation: "🔤 Traducció",
  };

  return (
    <div className="space-y-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
        {labels[exercise.type]}
      </div>

      {exercise.type === "writing" && (
        <WritingExercise exercise={exercise} onComplete={handleComplete} />
      )}
      {exercise.type === "sentence-builder" && (
        <SentenceBuilder exercise={exercise} onComplete={handleComplete} />
      )}
      {exercise.type === "fill-blank" && (
        <FillBlankExercise exercise={exercise} onComplete={handleComplete} />
      )}
      {exercise.type === "dictation" && (
        <DictationExercise exercise={exercise} onComplete={handleComplete} />
      )}
      {exercise.type === "translation" && (
        <TranslationExercise exercise={exercise} onComplete={handleComplete} />
      )}

      {done && (
        <button
          onClick={onNext}
          className="w-full py-3 px-6 rounded-lg font-medium text-white
            bg-navy-600 hover:bg-navy-700 dark:bg-gold-600 dark:hover:bg-gold-700
            transition-colors mt-4"
        >
          Continua →
        </button>
      )}
    </div>
  );
}
