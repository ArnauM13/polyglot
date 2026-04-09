interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
}

export default function Card({ children, className = "", padding = "md" }: CardProps) {
  const paddings = {
    sm: "p-3",
    md: "p-5",
    lg: "p-7",
  };

  return (
    <div
      className={`bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm ${paddings[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
