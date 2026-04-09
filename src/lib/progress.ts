"use client";

import type { SRSCard, LessonProgress, DailyStats, SRSReviewResult } from "./types";
import { calculateNextReview } from "./srs";

// ============================================================
// Progress Management — localStorage with future Supabase sync
// ============================================================

const STORAGE_KEYS = {
  srsCards: (lang: string) => `polyglot_srs_${lang}`,
  lessonProgress: (lang: string) => `polyglot_lessons_${lang}`,
  dailyStats: (lang: string) => `polyglot_stats_${lang}`,
  reviewHistory: () => `polyglot_review_history`,
};

// --- SRS Cards ---

export function getSRSCards(language: string): SRSCard[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.srsCards(language));
  return data ? JSON.parse(data) : [];
}

export function saveSRSCards(language: string, cards: SRSCard[]): void {
  localStorage.setItem(STORAGE_KEYS.srsCards(language), JSON.stringify(cards));
}

export function addSRSCard(language: string, card: SRSCard): void {
  const cards = getSRSCards(language);
  const existing = cards.findIndex((c) => c.id === card.id);
  if (existing >= 0) {
    cards[existing] = card;
  } else {
    cards.push(card);
  }
  saveSRSCards(language, cards);
}

export function reviewSRSCard(
  language: string,
  result: SRSReviewResult
): SRSCard | null {
  const cards = getSRSCards(language);
  const cardIndex = cards.findIndex((c) => c.id === result.cardId);
  if (cardIndex < 0) return null;

  const card = cards[cardIndex];
  const updates = calculateNextReview(card, result.quality);
  const updatedCard = { ...card, ...updates };
  cards[cardIndex] = updatedCard;
  saveSRSCards(language, cards);

  // Save review history
  saveReviewResult(result);

  // Update daily stats
  updateDailyStats(language, {
    reviewed: 1,
    correct: result.quality >= 3 ? 1 : 0,
    newLearned: card.repetitions === 0 && result.quality >= 3 ? 1 : 0,
  });

  return updatedCard;
}

// --- Lesson Progress ---

export function getLessonProgress(language: string): LessonProgress[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.lessonProgress(language));
  return data ? JSON.parse(data) : [];
}

export function saveLessonProgress(
  language: string,
  lessonId: string,
  score: number,
  completed: boolean
): void {
  const allProgress = getLessonProgress(language);
  const existing = allProgress.findIndex((p) => p.lessonId === lessonId);
  const progress: LessonProgress = {
    lessonId,
    language,
    completed,
    score,
    completedAt: completed ? new Date().toISOString() : null,
  };

  if (existing >= 0) {
    allProgress[existing] = progress;
  } else {
    allProgress.push(progress);
  }

  localStorage.setItem(
    STORAGE_KEYS.lessonProgress(language),
    JSON.stringify(allProgress)
  );
}

export function isLessonCompleted(language: string, lessonId: string): boolean {
  const progress = getLessonProgress(language);
  return progress.some((p) => p.lessonId === lessonId && p.completed);
}

// --- Daily Stats ---

export function getDailyStats(language: string): DailyStats[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(STORAGE_KEYS.dailyStats(language));
  return data ? JSON.parse(data) : [];
}

export function getTodayStats(language: string): DailyStats {
  const today = new Date().toISOString().split("T")[0];
  const allStats = getDailyStats(language);
  const existing = allStats.find((s) => s.date === today);
  return (
    existing || {
      date: today,
      language,
      cardsReviewed: 0,
      cardsCorrect: 0,
      newCardsLearned: 0,
      timeSpentSeconds: 0,
    }
  );
}

function updateDailyStats(
  language: string,
  update: { reviewed: number; correct: number; newLearned: number }
): void {
  const today = new Date().toISOString().split("T")[0];
  const allStats = getDailyStats(language);
  const existingIndex = allStats.findIndex((s) => s.date === today);

  if (existingIndex >= 0) {
    allStats[existingIndex].cardsReviewed += update.reviewed;
    allStats[existingIndex].cardsCorrect += update.correct;
    allStats[existingIndex].newCardsLearned += update.newLearned;
  } else {
    allStats.push({
      date: today,
      language,
      cardsReviewed: update.reviewed,
      cardsCorrect: update.correct,
      newCardsLearned: update.newLearned,
      timeSpentSeconds: 0,
    });
  }

  localStorage.setItem(
    STORAGE_KEYS.dailyStats(language),
    JSON.stringify(allStats)
  );
}

// --- Review History ---

function saveReviewResult(result: SRSReviewResult): void {
  const data = localStorage.getItem(STORAGE_KEYS.reviewHistory());
  const history: SRSReviewResult[] = data ? JSON.parse(data) : [];
  history.push(result);
  // Keep last 1000 reviews
  if (history.length > 1000) {
    history.splice(0, history.length - 1000);
  }
  localStorage.setItem(STORAGE_KEYS.reviewHistory(), JSON.stringify(history));
}

// --- Aggregate Stats ---

export function getLanguageStats(language: string) {
  const cards = getSRSCards(language);
  const lessons = getLessonProgress(language);
  const stats = getDailyStats(language);
  const today = getTodayStats(language);
  const dueCards = cards.filter(
    (c) => new Date(c.nextReview) <= new Date()
  );

  // Calculate streak
  let streak = 0;
  const sortedStats = [...stats].sort((a, b) => b.date.localeCompare(a.date));
  const todayDate = new Date();
  for (let i = 0; i < sortedStats.length; i++) {
    const expectedDate = new Date(todayDate);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = expectedDate.toISOString().split("T")[0];
    if (sortedStats[i]?.date === expected && sortedStats[i].cardsReviewed > 0) {
      streak++;
    } else {
      break;
    }
  }

  return {
    totalCards: cards.length,
    dueCards: dueCards.length,
    completedLessons: lessons.filter((l) => l.completed).length,
    totalLessons: lessons.length,
    todayStats: today,
    streak,
    totalWordsLearned: cards.filter((c) => c.repetitions > 0).length,
  };
}
