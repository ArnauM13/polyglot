"use client";

/**
 * Web Speech API wrapper for Russian pronunciation
 */

let speechSynthesis: SpeechSynthesis | null = null;

function getSpeechSynthesis(): SpeechSynthesis | null {
  if (typeof window === "undefined") return null;
  if (!speechSynthesis) {
    speechSynthesis = window.speechSynthesis;
  }
  return speechSynthesis;
}

/**
 * Speak text in Russian using Web Speech API
 */
export function speakRussian(text: string, rate = 0.85): Promise<void> {
  return new Promise((resolve, reject) => {
    const synth = getSpeechSynthesis();
    if (!synth) {
      reject(new Error("Speech synthesis not available"));
      return;
    }

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ru-RU";
    utterance.rate = rate;
    utterance.pitch = 1;

    // Try to find a Russian voice
    const voices = synth.getVoices();
    const russianVoice = voices.find((v) => v.lang.startsWith("ru"));
    if (russianVoice) {
      utterance.voice = russianVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    synth.speak(utterance);
  });
}

/**
 * Speak text in any language
 */
export function speak(text: string, lang: string, rate = 0.85): Promise<void> {
  return new Promise((resolve, reject) => {
    const synth = getSpeechSynthesis();
    if (!synth) {
      reject(new Error("Speech synthesis not available"));
      return;
    }

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = rate;
    utterance.pitch = 1;

    const voices = synth.getVoices();
    const voice = voices.find((v) => v.lang.startsWith(lang.split("-")[0]));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = (e) => reject(e);

    synth.speak(utterance);
  });
}

/**
 * Check if speech synthesis is available
 */
export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}
