"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Lesson } from "@/lib/types";
import LessonView from "@/components/lesson/LessonView";
import { saveLessonProgress, addSRSCard } from "@/lib/progress";
import { createSRSCard } from "@/lib/srs";

// Dynamically import lesson JSON by ID
async function loadLesson(lang: string, id: string): Promise<Lesson | null> {
  try {
    const lesson = await import(`@/data/languages/${lang}/lessons/${id}.json`);
    return lesson.default as Lesson;
  } catch {
    return null;
  }
}

export default function LessonPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = use(params);
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLesson(lang, id).then((l) => {
      setLesson(l);
      setLoading(false);
    });
  }, [lang, id]);

  function handleComplete(score: number) {
    saveLessonProgress(lang, id, score, true);

    // Add lesson vocabulary to SRS deck if applicable
    // (Vocabulary is seeded separately via the vocab deck)

    // Navigate back to dashboard
    router.push(`/${lang}?completed=${id}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Carregant...</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="text-gray-500">Lliçó no trobada: {id}</div>
        <button
          onClick={() => router.push(`/${lang}`)}
          className="text-navy-600 dark:text-gold-400 underline"
        >
          Tornar al dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-navy-900 dark:bg-navy-950 text-white px-4 py-4 flex items-center gap-3">
        <button
          onClick={() => router.push(`/${lang}`)}
          className="text-gold-400 hover:text-gold-300 transition-colors text-sm"
        >
          ← Dashboard
        </button>
        <h1 className="text-base font-medium truncate">{lesson.title}</h1>
      </header>

      <main className="px-4 py-6">
        <LessonView lesson={lesson} onComplete={handleComplete} />
      </main>
    </div>
  );
}
