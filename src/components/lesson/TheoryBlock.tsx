import type { TheorySection } from "@/lib/types";
import AudioButton from "@/components/ui/AudioButton";

interface Props {
  section: TheorySection;
}

export default function TheoryBlock({ section }: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-navy-800 dark:text-gold-300">
        {section.title}
      </h2>
      <div
        className="text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: section.content }}
      />
      {section.examples.length > 0 && (
        <div className="space-y-3 mt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Exemples
          </h3>
          <div className="grid gap-2">
            {section.examples.map((ex, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-lg bg-navy-50 dark:bg-navy-900/50"
              >
                {ex.emoji && <span className="text-2xl flex-shrink-0">{ex.emoji}</span>}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-semibold text-navy-800 dark:text-gold-300">
                      {ex.russian}
                    </span>
                    <AudioButton text={ex.russian} size="sm" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      [{ex.transliteration}]
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                    {ex.catalan}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
