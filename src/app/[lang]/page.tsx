"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { use } from "react";
import { getLanguageStats } from "@/lib/progress";
import russianMeta from "@/data/languages/russian/meta.json";
import ProgressBar from "@/components/ui/ProgressBar";

interface Stats {
  totalCards: number;
  dueCards: number;
  completedLessons: number;
  totalLessons: number;
  streak: number;
  totalWordsLearned: number;
  todayStats: {
    cardsReviewed: number;
    cardsCorrect: number;
  };
}

const metaMap: Record<string, typeof russianMeta> = {
  russian: russianMeta,
};

const totalLessonsMap: Record<string, number> = {
  russian: 24,
};

export default function LanguageDashboard({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const meta = metaMap[lang];
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const s = getLanguageStats(lang);
    setStats({
      ...s,
      totalLessons: totalLessonsMap[lang] ?? 0,
    });
  }, [lang]);

  if (!meta) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Idioma no trobat.</p>
      </div>
    );
  }

  const progressPct =
    stats && stats.totalLessons > 0
      ? (stats.completedLessons / stats.totalLessons) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top bar */}
      <header className="bg-navy-900 dark:bg-navy-950 text-white px-4 py-4 flex items-center gap-3">
        <Link href="/" className="text-gold-400 hover:text-gold-300 transition-colors text-sm">
          ← Inici
        </Link>
        <span className="text-2xl">{meta.flag}</span>
        <h1 className="text-xl font-bold">{meta.name}</h1>
        <span className="ml-auto text-gold-400 text-sm font-medium">{meta.nativeName}</span>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Review CTA — most prominent */}
        {stats && stats.dueCards > 0 ? (
          <Link
            href={`/${lang}/review`}
            className="flex items-center justify-between p-5 rounded-xl
              bg-navy-700 hover:bg-navy-600 dark:bg-navy-800 dark:hover:bg-navy-700
              text-white transition-colors"
          >
            <div>
              <div className="text-2xl font-bold">{stats.dueCards}</div>
              <div className="text-sm text-navy-200">targetes pendents de review</div>
            </div>
            <div className="text-4xl">🗂️</div>
          </Link>
        ) : (
          <div className="flex items-center justify-between p-5 rounded-xl
            bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <div>
              <div className="text-lg font-bold text-green-800 dark:text-green-300">
                Tot al dia! ✅
              </div>
              <div className="text-sm text-green-600 dark:text-green-400">
                Cap targeta pendent
              </div>
            </div>
            <div className="text-4xl">🎉</div>
          </div>
        )}

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-navy-700 dark:text-gold-400">
                {stats.totalWordsLearned}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">paraules</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-navy-700 dark:text-gold-400">
                {stats.streak}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">dies seguits</div>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl p-4 text-center border border-gray-200 dark:border-gray-800">
              <div className="text-2xl font-bold text-navy-700 dark:text-gold-400">
                {stats.todayStats.cardsReviewed > 0
                  ? Math.round((stats.todayStats.cardsCorrect / stats.todayStats.cardsReviewed) * 100)
                  : "-"}
                {stats.todayStats.cardsReviewed > 0 ? "%" : ""}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">precisió avui</div>
            </div>
          </div>
        )}

        {/* Overall progress */}
        <div className="bg-white dark:bg-gray-900 rounded-xl p-5 border border-gray-200 dark:border-gray-800 space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-800 dark:text-gray-200">Progrés general</span>
            <span className="text-sm text-gray-500">{stats?.completedLessons ?? 0}/{stats?.totalLessons ?? 24} lliçons</span>
          </div>
          <ProgressBar value={progressPct} size="md" />
        </div>

        {/* Modules */}
        <div className="space-y-3">
          <h2 className="font-bold text-gray-800 dark:text-gray-200">Mòduls</h2>
          {meta.modules.map((mod) => (
            <div
              key={mod.id}
              className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">{mod.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{mod.description}</p>
              </div>
              <div className="p-2 flex flex-wrap gap-1">
                {mod.lessons.map((lessonId, i) => (
                  <Link
                    key={lessonId}
                    href={`/${lang}/lesson/${lessonId}`}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium
                      bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                      hover:bg-navy-100 dark:hover:bg-navy-900 hover:text-navy-700 dark:hover:text-gold-400
                      transition-colors"
                  >
                    {i + 1}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
