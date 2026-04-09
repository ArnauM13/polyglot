import Link from "next/link";
import russianMeta from "@/data/languages/russian/meta.json";

const languages = [russianMeta];

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-navy-900 dark:text-gold-400">
            Polyglot
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Aprèn idiomes activament. Escriu, no triïs.
          </p>
        </div>

        {/* Language cards */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            Idiomes disponibles
          </h2>
          {languages.map((lang) => (
            <Link
              key={lang.id}
              href={`/${lang.id}`}
              className="flex items-center gap-4 p-5 rounded-xl border-2 border-gray-200 dark:border-gray-800
                bg-white dark:bg-gray-900 hover:border-navy-400 dark:hover:border-gold-500
                transition-all duration-200 group"
            >
              <span className="text-4xl">{lang.flag}</span>
              <div className="flex-1">
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-navy-700 dark:group-hover:text-gold-400 transition-colors">
                  {lang.name}
                  <span className="ml-2 text-gray-400 dark:text-gray-500 font-normal text-base">
                    {lang.nativeName}
                  </span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {lang.description}
                </div>
              </div>
              <span className="text-navy-400 dark:text-gold-500 group-hover:translate-x-1 transition-transform">
                →
              </span>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 dark:text-gray-600">
          Mètode SRS · Producció activa · Sense gamificació buida
        </p>
      </div>
    </main>
  );
}
