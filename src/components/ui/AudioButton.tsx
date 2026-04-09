"use client";

import { useState } from "react";
import { speakRussian, isSpeechAvailable } from "@/lib/speech";

interface AudioButtonProps {
  text: string;
  lang?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function AudioButton({
  text,
  size = "md",
  className = "",
}: AudioButtonProps) {
  const [playing, setPlaying] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-xl",
    lg: "w-12 h-12 text-2xl",
  };

  async function handlePlay() {
    if (!isSpeechAvailable() || playing) return;
    setPlaying(true);
    try {
      await speakRussian(text);
    } catch {
      // Speech failed silently
    } finally {
      setPlaying(false);
    }
  }

  if (!isSpeechAvailable()) return null;

  return (
    <button
      onClick={handlePlay}
      disabled={playing}
      className={`inline-flex items-center justify-center rounded-full
        bg-navy-100 dark:bg-navy-800 hover:bg-navy-200 dark:hover:bg-navy-700
        text-navy-700 dark:text-navy-200
        transition-all duration-200
        ${playing ? "animate-pulse" : ""}
        ${sizeClasses[size]}
        ${className}`}
      aria-label={`Escoltar: ${text}`}
    >
      {playing ? "..." : "\u{1F50A}"}
    </button>
  );
}
