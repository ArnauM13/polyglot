import type { ComparisonSection } from "@/lib/types";

interface Props {
  section: ComparisonSection;
}

export default function ComparisonBlock({ section }: Props) {
  return (
    <div className="rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30 p-5 space-y-3">
      <h3 className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2">
        <span>🔄</span> {section.title}
      </h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-3 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Català
          </div>
          <div className="text-base font-medium text-gray-800 dark:text-gray-200">
            {section.catalan}
          </div>
        </div>
        <div className="bg-navy-50 dark:bg-navy-900 rounded-lg p-3 text-center">
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
            Rus
          </div>
          <div className="text-base font-medium text-navy-800 dark:text-gold-300">
            {section.russian}
          </div>
        </div>
      </div>
      <p className="text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
        {section.explanation}
      </p>
    </div>
  );
}
