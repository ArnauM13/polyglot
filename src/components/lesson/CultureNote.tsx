import type { CultureSection } from "@/lib/types";

interface Props {
  section: CultureSection;
}

export default function CultureNote({ section }: Props) {
  return (
    <div className="rounded-xl border-l-4 border-gold-500 bg-amber-50 dark:bg-amber-950/30 p-5 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{section.emoji}</span>
        <h3 className="font-bold text-amber-900 dark:text-amber-300">
          {section.title}
        </h3>
      </div>
      <div
        className="text-amber-800 dark:text-amber-200 text-sm leading-relaxed"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
    </div>
  );
}
