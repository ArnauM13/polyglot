"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSRSCards } from "@/lib/progress";
import { getDueCards as filterDue } from "@/lib/srs";
import type { SRSCard } from "@/lib/types";
import FlashcardDeck from "@/components/srs/FlashcardDeck";
import Link from "next/link";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = use(params);
  const router = useRouter();
  const [dueCards, setDueCards] = useState<SRSCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const cards = getSRSCards(lang);
    const due = filterDue(cards);
    setDueCards(due);
    setLoaded(true);
  }, [lang]);

  function handleSessionComplete(reviewed: number, correct: number) {
    router.push(`/${lang}`);
  }

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Carregant targetes...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="bg-navy-900 dark:bg-navy-950 text-white px-4 py-4 flex items-center gap-3">
        <Link
          href={`/${lang}`}
          className="text-gold-400 hover:text-gold-300 transition-colors text-sm"
        >
          ← Dashboard
        </Link>
        <h1 className="text-base font-medium">Revisió SRS</h1>
        <span className="ml-auto text-navy-300 text-sm">{dueCards.length} targetes</span>
      </header>

      <main className="px-4 py-6">
        {dueCards.length === 0 ? (
          <div className="max-w-lg mx-auto text-center py-16 space-y-4">
            <div className="text-5xl">✅</div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
              Cap targeta pendent!
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Has completat totes les revisions d&apos;avui. Torna demà!
            </p>
            <Link
              href={`/${lang}`}
              className="inline-block px-6 py-3 bg-navy-600 dark:bg-gold-600 text-white rounded-lg font-medium hover:bg-navy-700 dark:hover:bg-gold-700 transition-colors"
            >
              Tornar al dashboard
            </Link>
          </div>
        ) : (
          <FlashcardDeck
            cards={dueCards}
            language={lang}
            onSessionComplete={handleSessionComplete}
          />
        )}
      </main>
    </div>
  );
}
