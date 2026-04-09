"use client";

import { useState } from "react";
import type { SRSCard } from "@/lib/types";
import type { QualityButton } from "@/lib/srs";
import { getIntervalLabel, QUALITY_MAP } from "@/lib/srs";
import { reviewSRSCard } from "@/lib/progress";
import AudioButton from "@/components/ui/AudioButton";

interface Props {
  cards: SRSCard[];
  language: string;
  onSessionComplete: (reviewed: number, correct: number) => void;
}

export default function FlashcardDeck({ cards, language, onSessionComplete }: Props) {
  const [queue, setQueue] = useState<SRSCard[]>([...cards]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [inputSubmitted, setInputSubmitted] = useState(false);
  const [stats, setStats] = useState({ reviewed: 0, correct: 0 });

  const current = queue[currentIndex];

  if (!current) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold text-navy-800 dark:text-gold-300">
          Sessió completada!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {stats.reviewed} targetes · {stats.correct} correctes (
          {stats.reviewed > 0 ? Math.round((stats.correct / stats.reviewed) * 100) : 0}%)
        </p>
        <button
          onClick={() => onSessionComplete(stats.reviewed, stats.correct)}
          className="px-6 py-3 bg-navy-600 dark:bg-gold-600 text-white rounded-lg font-medium hover:bg-navy-700 dark:hover:bg-gold-700 transition-colors"
        >
          Tornar al dashboard
        </button>
      </div>
    );
  }

  function handleInputSubmit() {
    if (!userInput.trim()) return;
    setInputSubmitted(true);
  }

  function handleQuality(quality: QualityButton) {
    const result = {
      cardId: current.id,
      quality: QUALITY_MAP[quality],
      responseTimeMs: 0,
      timestamp: new Date().toISOString(),
    };
    reviewSRSCard(language, result);

    const correct = QUALITY_MAP[quality] >= 3;
    const newStats = {
      reviewed: stats.reviewed + 1,
      correct: stats.correct + (correct ? 1 : 0),
    };
    setStats(newStats);

    // If "again", put card back later
    if (quality === "again") {
      const newQueue = [...queue];
      const card = newQueue.splice(currentIndex, 1)[0];
      const insertAt = Math.min(currentIndex + 3, newQueue.length);
      newQueue.splice(insertAt, 0, card);
      setQueue(newQueue);
    } else {
      setCurrentIndex((i) => i + 1);
    }

    setRevealed(false);
    setUserInput("");
    setInputSubmitted(false);
  }

  const qualityButtons: { key: QualityButton; label: string; color: string }[] = [
    { key: "again", label: "Again", color: "bg-red-500 hover:bg-red-600" },
    { key: "hard", label: "Difícil", color: "bg-orange-500 hover:bg-orange-600" },
    { key: "good", label: "Bé", color: "bg-blue-500 hover:bg-blue-600" },
    { key: "easy", label: "Fàcil", color: "bg-green-500 hover:bg-green-600" },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Progress */}
      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{currentIndex + 1} / {queue.length}</span>
        <span>{stats.correct} correctes</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full">
        <div
          className="h-1.5 bg-navy-500 dark:bg-gold-500 rounded-full transition-all"
          style={{ width: `${(currentIndex / queue.length) * 100}%` }}
        />
      </div>

      {/* Card front */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 text-center space-y-3">
        {current.emoji && <div className="text-6xl">{current.emoji}</div>}
        <div className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          {current.front}
        </div>
      </div>

      {/* Input area — write before revealing */}
      {!revealed && (
        <div className="space-y-3">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !inputSubmitted && handleInputSubmit()}
            disabled={inputSubmitted}
            placeholder="Escriu en rus i comprova..."
            className="w-full p-4 text-xl rounded-lg border-2 border-gray-300 dark:border-gray-600
              focus:border-navy-500 dark:focus:border-gold-500 outline-none
              bg-white dark:bg-gray-800 transition-colors"
            autoFocus
            lang="ru"
          />
          <button
            onClick={() => setRevealed(true)}
            className="w-full py-3 rounded-lg font-medium border-2 border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-300 hover:border-navy-400 dark:hover:border-gold-500
              transition-colors"
          >
            Revelar resposta
          </button>
        </div>
      )}

      {/* Revealed back */}
      {revealed && (
        <div className="space-y-3">
          <div className="bg-navy-50 dark:bg-navy-900 rounded-xl p-5 text-center space-y-2">
            <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-bold text-navy-800 dark:text-gold-300">
                {current.back}
              </span>
              <AudioButton text={current.back} size="md" />
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {current.transliteration}
            </div>
          </div>

          {userInput && (
            <div className="text-sm text-center text-gray-500 dark:text-gray-400">
              Has escrit: <span className="font-mono font-medium">{userInput}</span>
            </div>
          )}

          {/* SM-2 quality buttons */}
          <div className="grid grid-cols-4 gap-2">
            {qualityButtons.map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => handleQuality(key)}
                className={`${color} text-white py-3 rounded-lg text-sm font-medium transition-colors`}
              >
                <div>{label}</div>
                <div className="text-xs opacity-75 mt-0.5">
                  {getIntervalLabel(current, key)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
