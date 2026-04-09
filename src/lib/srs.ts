// ============================================================
// SM-2 Algorithm (SuperMemo 2) — The algorithm behind Anki
// ============================================================

import type { SRSCard, SRSQuality } from "./types";

/**
 * SM-2 Algorithm
 * Quality ratings:
 *   0 - Complete blackout
 *   1 - Incorrect, but remembered upon seeing answer
 *   2 - Incorrect, but answer seemed easy to recall
 *   3 - Correct with serious difficulty
 *   4 - Correct after hesitation
 *   5 - Perfect response
 */
export function calculateNextReview(
  card: SRSCard,
  quality: SRSQuality
): Pick<SRSCard, "easeFactor" | "interval" | "repetitions" | "nextReview" | "lastReview"> {
  const now = new Date();
  let { easeFactor, interval, repetitions } = card;

  if (quality < 3) {
    // Failed — reset repetitions, short interval
    repetitions = 0;
    interval = 0;
  } else {
    // Success
    if (repetitions === 0) {
      interval = 1; // 1 day
    } else if (repetitions === 1) {
      interval = 6; // 6 days
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update ease factor (minimum 1.3)
  easeFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  // Calculate next review date
  const nextReview = new Date(now);
  if (quality < 3) {
    // Review again in 1 minute (for "Again"), 10 minutes (for "Hard-ish fail")
    const minutes = quality === 0 ? 1 : quality === 1 ? 5 : 10;
    nextReview.setMinutes(nextReview.getMinutes() + minutes);
  } else {
    nextReview.setDate(nextReview.getDate() + interval);
  }

  return {
    easeFactor,
    interval,
    repetitions,
    nextReview: nextReview.toISOString(),
    lastReview: now.toISOString(),
  };
}

/**
 * Get cards due for review (nextReview <= now)
 */
export function getDueCards(cards: SRSCard[]): SRSCard[] {
  const now = new Date().toISOString();
  return cards
    .filter((card) => card.nextReview <= now)
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview));
}

/**
 * Create a new SRS card from vocabulary data
 */
export function createSRSCard(params: {
  id: string;
  language: string;
  deck: string;
  front: string;
  back: string;
  transliteration: string;
  emoji?: string;
}): SRSCard {
  return {
    ...params,
    easeFactor: 2.5,
    interval: 0,
    repetitions: 0,
    nextReview: new Date().toISOString(),
    lastReview: null,
  };
}

/**
 * Map button labels to SM-2 quality ratings
 */
export const QUALITY_MAP = {
  again: 0 as SRSQuality,  // Complete fail
  hard: 2 as SRSQuality,   // Incorrect but close
  good: 4 as SRSQuality,   // Correct after hesitation
  easy: 5 as SRSQuality,   // Perfect
};

export type QualityButton = keyof typeof QUALITY_MAP;

/**
 * Get interval description for display
 */
export function getIntervalLabel(card: SRSCard, quality: QualityButton): string {
  const result = calculateNextReview(card, QUALITY_MAP[quality]);
  const now = new Date();
  const next = new Date(result.nextReview);
  const diffMs = next.getTime() - now.getTime();
  const diffMinutes = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMinutes < 60) return `${diffMinutes}min`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 30) return `${diffDays}d`;
  return `${Math.round(diffDays / 30)}m`;
}
