"use client";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export default function ProgressBar({
  value,
  label,
  size = "md",
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const height = size === "sm" ? "h-2" : "h-3";

  return (
    <div className={className}>
      {label && (
        <div className="flex justify-between mb-1 text-sm text-gray-600 dark:text-gray-400">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden`}>
        <div
          className={`${height} bg-gold-500 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
