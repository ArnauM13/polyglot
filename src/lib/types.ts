// ============================================================
// Polyglot — Core Types
// ============================================================

// --- Language ---
export interface LanguageMeta {
  id: string;
  name: string;
  nativeName: string;
  flag: string;
  description: string;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: string[]; // lesson IDs
}

// --- Lessons ---
export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  order: number;
  sections: LessonSection[];
}

export type LessonSection =
  | TheorySection
  | CultureSection
  | ComparisonSection
  | ExerciseSection;

export interface TheorySection {
  type: "theory";
  title: string;
  content: string; // markdown-like
  examples: Example[];
}

export interface CultureSection {
  type: "culture";
  title: string;
  content: string;
  emoji: string;
}

export interface ComparisonSection {
  type: "comparison";
  title: string;
  catalan: string;
  russian: string;
  explanation: string;
}

export interface ExerciseSection {
  type: "exercise";
  exercise: Exercise;
}

export interface Example {
  russian: string;
  transliteration: string;
  catalan: string;
  emoji?: string;
  audio?: boolean;
}

// --- Exercises ---
export type Exercise =
  | WritingExercise
  | SentenceBuilderExercise
  | FillBlankExercise
  | DictationExercise
  | TranslationExercise;

export interface WritingExercise {
  type: "writing";
  prompt: string; // in Catalan
  answer: string; // expected Russian
  alternativeAnswers?: string[];
  hint?: string;
  transliteration: string;
}

export interface SentenceBuilderExercise {
  type: "sentence-builder";
  prompt: string; // instruction in Catalan
  words: string[]; // shuffled Russian words
  correctOrder: string[]; // correct order
  translation: string; // Catalan meaning
}

export interface FillBlankExercise {
  type: "fill-blank";
  sentence: string; // Russian sentence with ___ for blank
  blank: string; // correct answer
  hint: string; // e.g. infinitive form or Catalan
  alternativeAnswers?: string[];
}

export interface DictationExercise {
  type: "dictation";
  text: string; // Russian text to dictate
  transliteration: string;
  catalan: string;
}

export interface TranslationExercise {
  type: "translation";
  russian: string;
  correctTranslation: string;
  alternativeTranslations?: string[];
}

// --- SRS (Spaced Repetition) ---
export interface SRSCard {
  id: string;
  language: string;
  deck: string;
  front: string; // Catalan + emoji
  back: string; // Russian
  transliteration: string;
  emoji?: string;
  // SM-2 fields
  easeFactor: number;
  interval: number; // days
  repetitions: number;
  nextReview: string; // ISO date
  lastReview: string | null;
}

export type SRSQuality = 0 | 1 | 2 | 3 | 4 | 5;

export interface SRSReviewResult {
  cardId: string;
  quality: SRSQuality;
  responseTimeMs: number;
  timestamp: string;
}

// --- Progress ---
export interface LessonProgress {
  lessonId: string;
  language: string;
  completed: boolean;
  score: number; // 0.0 - 1.0
  completedAt: string | null;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  language: string;
  cardsReviewed: number;
  cardsCorrect: number;
  newCardsLearned: number;
  timeSpentSeconds: number;
}

// --- Vocabulary deck (static data) ---
export interface VocabularyDeck {
  id: string;
  name: string;
  description: string;
  cards: VocabularyCard[];
}

export interface VocabularyCard {
  id: string;
  catalan: string;
  russian: string;
  transliteration: string;
  emoji?: string;
  category?: string;
}
