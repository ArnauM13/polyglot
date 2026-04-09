"use client";

import { useState } from "react";
import type { Lesson, LessonSection } from "@/lib/types";
import TheoryBlock from "./TheoryBlock";
import CultureNote from "./CultureNote";
import ComparisonBlock from "./ComparisonBlock";
import ExerciseRunner from "./ExerciseRunner";
import ProgressBar from "@/components/ui/ProgressBar";

interface Props {
  lesson: Lesson;
  onComplete: (score: number) => void;
}

export default function LessonView({ lesson, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [exerciseCount, setExerciseCount] = useState(0);

  const sections = lesson.sections;
  const current = sections[step];
  const progress = ((step + 1) / sections.length) * 100;

  function handleExerciseComplete(correct: boolean) {
    setExerciseCount((n) => n + 1);
    if (correct) setCorrectCount((n) => n + 1);
  }

  function handleNext() {
    if (step >= sections.length - 1) {
      const score = exerciseCount > 0 ? correctCount / exerciseCount : 1;
      onComplete(score);
    } else {
      setStep((s) => s + 1);
    }
  }

  function renderSection(section: LessonSection) {
    switch (section.type) {
      case "theory":
        return (
          <div className="space-y-4">
            <TheoryBlock section={section} />
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-lg font-medium text-white
                bg-navy-600 hover:bg-navy-700 dark:bg-gold-600 dark:hover:bg-gold-700
                transition-colors"
            >
              {step >= sections.length - 1 ? "Finalitzar lliçó" : "Continua →"}
            </button>
          </div>
        );
      case "culture":
        return (
          <div className="space-y-4">
            <CultureNote section={section} />
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-lg font-medium text-white
                bg-navy-600 hover:bg-navy-700 dark:bg-gold-600 dark:hover:bg-gold-700
                transition-colors"
            >
              {step >= sections.length - 1 ? "Finalitzar lliçó" : "Continua →"}
            </button>
          </div>
        );
      case "comparison":
        return (
          <div className="space-y-4">
            <ComparisonBlock section={section} />
            <button
              onClick={handleNext}
              className="w-full py-3 rounded-lg font-medium text-white
                bg-navy-600 hover:bg-navy-700 dark:bg-gold-600 dark:hover:bg-gold-700
                transition-colors"
            >
              {step >= sections.length - 1 ? "Finalitzar lliçó" : "Continua →"}
            </button>
          </div>
        );
      case "exercise":
        return (
          <ExerciseRunner
            exercise={section.exercise}
            onNext={() => {
              handleExerciseComplete(false);
              handleNext();
            }}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-navy-800 dark:text-gold-300">
            {lesson.title}
          </h1>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {step + 1}/{sections.length}
          </span>
        </div>
        <ProgressBar value={progress} size="sm" />
      </div>

      {/* Current section */}
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-5 shadow-sm">
        {current && renderSection(current)}
      </div>
    </div>
  );
}
