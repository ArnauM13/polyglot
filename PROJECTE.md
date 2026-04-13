# Polyglot — Estat del projecte

> Última actualització: 2026-04-13  
> Repo: https://github.com/ArnauM13/polyglot  
> Local: `C:\polyglot`  
> Run: `npm run dev` → http://localhost:3000

---

## Què és

Plataforma web d'aprenentatge actiu d'idiomes. Enfocament **Anki-style** (SRS real amb algorisme SM-2), no Duolingo. L'usuari **escriu** en rus en lloc de triar opcions.

**Idioma actual:** Rus A1  
**Idiomes futurs:** Arquitectura multi-idioma ja preparada — afegir idioma = nova carpeta `/src/data/languages/[lang]/`

---

## Filosofia

- **Output > Input**: escriure, no reconèixer
- **SRS com a columna vertebral**: algorisme SM-2 real (el d'Anki)
- **Gramàtica per comprensió**: comparada amb català
- **Notes culturals** a cada lliçó
- **Sense gamificació buida**: progrés real, no punts ni ratxes artificials
- **Mobile-first**: teclat ciríl·lic del mòbil, sense virtual
- **Offline-capable**: PWA (pendent)

---

## Tech Stack

| Capa | Tecnologia |
|------|-----------|
| Framework | Next.js 16 (App Router) + TypeScript |
| Estils | Tailwind CSS v4 (paleta navy + gold custom) |
| Fonts | Inter (UI) + Noto Sans (ciríl·lic) |
| Backend (pendent) | Supabase (PostgreSQL free tier) |
| Persistència actual | `localStorage` |
| Àudio | Web Speech API (ru-RU) |
| Deploy (pendent) | Vercel |
| PWA (pendent) | next-pwa |

---

## Estructura de carpetes

```
C:\polyglot\
├── src/
│   ├── app/
│   │   ├── page.tsx                         ← Landing (selecció idioma)
│   │   ├── [lang]/
│   │   │   ├── page.tsx                     ← Dashboard (reviews pendents, stats, mòduls)
│   │   │   ├── lesson/[id]/page.tsx         ← Lliçó individual
│   │   │   └── review/page.tsx              ← Sessió SRS (flashcards)
│   │   ├── layout.tsx                       ← Root layout (Inter font, metadata PWA)
│   │   └── globals.css                      ← Paleta navy/gold, Tailwind theme
│   │
│   ├── components/
│   │   ├── exercise/
│   │   │   ├── WritingExercise.tsx          ← Escriu en rus (input + validació)
│   │   │   ├── SentenceBuilder.tsx          ← Reordena paraules
│   │   │   ├── FillBlankExercise.tsx        ← Omple el buit
│   │   │   ├── DictationExercise.tsx        ← Escolta + escriu
│   │   │   └── TranslationExercise.tsx      ← Rus → català
│   │   ├── lesson/
│   │   │   ├── LessonView.tsx               ← Orquestrador de seccions
│   │   │   ├── TheoryBlock.tsx              ← Teoria + exemples amb àudio
│   │   │   ├── CultureNote.tsx              ← Nota cultural (fons daurat)
│   │   │   ├── ComparisonBlock.tsx          ← Català ↔ Rus (fons blau)
│   │   │   └── ExerciseRunner.tsx           ← Dispatcher d'exercicis
│   │   ├── srs/
│   │   │   └── FlashcardDeck.tsx            ← Anki-style: escriu → revela → SM-2
│   │   └── ui/
│   │       ├── AudioButton.tsx              ← 🔊 Web Speech API
│   │       ├── Card.tsx                     ← Card base
│   │       └── ProgressBar.tsx              ← Barra de progrés
│   │
│   ├── data/languages/russian/
│   │   ├── meta.json                        ← Info idioma + estructura de mòduls
│   │   ├── lessons/
│   │   │   ├── 01-familiar-letters.json     ✅ Lliçó 1: Lletres familiars
│   │   │   ├── 02-false-friends.json        ✅ Lliçó 2: Falsos amics ciríl·lics
│   │   │   ├── 06-greetings.json            ✅ Lliçó 6: Salutacions
│   │   │   └── 07-introductions.json        ✅ Lliçó 7: Presentar-se
│   │   └── vocabulary/
│   │       └── basic.json                   ✅ 35 paraules bàsiques (deck SRS)
│   │
│   └── lib/
│       ├── types.ts                         ← Tots els tipus TypeScript
│       ├── srs.ts                           ← Algorisme SM-2 + helpers
│       ├── progress.ts                      ← CRUD localStorage (cards, lliçons, stats)
│       └── speech.ts                        ← Web Speech API wrapper (ru-RU)
│
├── PROJECTE.md                              ← Aquest fitxer
└── package.json
```

---

## Schema JSON d'una lliçó

Cada lliçó és un fitxer `[id].json` a `/src/data/languages/russian/lessons/`:

```json
{
  "id": "06-greetings",
  "moduleId": "module-2",
  "title": "Salutacions",
  "description": "...",
  "order": 6,
  "sections": [
    { "type": "theory", "title": "...", "content": "HTML...", "examples": [...] },
    { "type": "culture", "title": "...", "emoji": "🎩", "content": "HTML..." },
    { "type": "comparison", "title": "...", "catalan": "...", "russian": "...", "explanation": "..." },
    { "type": "exercise", "exercise": { "type": "writing", "prompt": "...", "answer": "..." } }
  ]
}
```

**Tipus d'exercicis disponibles:** `writing` | `sentence-builder` | `fill-blank` | `dictation` | `translation`

---

## Contingut A1 Rus — 24 lliçons en 6 mòduls

| # | Lliçó | Estat |
|---|-------|-------|
| **Mòdul 1: Alfabet ciríl·lic** | | |
| 01 | Lletres familiars (А, Е, К, М, О, Т) | ✅ fet |
| 02 | Falsos amics (В=V, Н=N, Р=R, С=S) | ✅ fet |
| 03 | Lletres noves I (Б, Г, Д, Ж, З, И, Й, Л) | ⬜ pendent |
| 04 | Lletres noves II (П, Ф, Ц, Ч, Ш, Щ, Ъ, Ь, Ы, Э, Ю, Я) | ⬜ pendent |
| 05 | Pràctica integral de lectura/escriptura | ⬜ pendent |
| **Mòdul 2: Primeres frases** | | |
| 06 | Salutacions (Привет / Здравствуйте / ты vs Вы) | ✅ fet |
| 07 | Presentar-se (Меня зовут...) | ✅ fet |
| 08 | Com estàs? (Как дела?) | ⬜ pendent |
| 09 | Comiat i cortesia (До свидания, Спасибо) | ⬜ pendent |
| **Mòdul 3: Gramàtica bàsica** | | |
| 10 | Gènere dels noms (-consonant/а/о) | ⬜ pendent |
| 11 | Pronoms + verb "ser" absent en present | ⬜ pendent |
| 12 | Conjugació 1a (-ать: читать, знать) | ⬜ pendent |
| 13 | Conjugació 2a (-ить: говорить, учить) | ⬜ pendent |
| 14 | Negació (не) + preguntes bàsiques | ⬜ pendent |
| **Mòdul 4: Vocabulari** | | |
| 15 | Números 1-100 | ⬜ pendent |
| 16 | Dies, mesos, estacions | ⬜ pendent |
| 17 | Família i relacions | ⬜ pendent |
| 18 | Menjar i begudes | ⬜ pendent |
| 19 | Ciutat i transport | ⬜ pendent |
| **Mòdul 5: Primers casos** | | |
| 20 | Nominatiu vs Acusatiu | ⬜ pendent |
| 21 | Cas preposicional (в/на + lloc) | ⬜ pendent |
| 22 | Pràctica de casos | ⬜ pendent |
| **Mòdul 6: Integració** | | |
| 23 | Lectura de textos curts | ⬜ pendent |
| 24 | Escriptura guiada | ⬜ pendent |

**Vocabulari SRS:** 35 paraules bàsiques creades (`basic.json`) — pendents lligar a la UI

---

## Estat de les funcionalitats

### ✅ Fet i funcionant

- **Build net**: `npm run build` passa sense errors
- **Landing page** `/` — selecció d'idioma amb card
- **Dashboard** `/russian` — reviews pendents, stats, progrés per mòdul
- **Pàgina de lliçó** `/russian/lesson/[id]` — carrega lliçó per ID, mostra seccions
- **Pàgina de review** `/russian/review` — sessió SRS completa
- **5 components d'exercici** (writing, sentence-builder, fill-blank, dictation, translation)
- **Flashcard SRS** — escriu → revela → botons Again/Difícil/Bé/Fàcil amb intervals SM-2
- **SM-2 algorisme** complet (`srs.ts`) — ease factor, intervals, repeticions
- **localStorage** per tot el progrés (lliçons, targetes SRS, stats diàries)
- **Web Speech API** — pronunciació en rus (botó 🔊 a cada exemple)
- **Comparació català ↔ rus** en blocs visuals a cada lliçó
- **Notes culturals** en cada lliçó
- **Paleta de colors** navy/gold custom (Tailwind v4)
- **4 lliçons** de contingut real (01, 02, 06, 07)
- **Repo GitHub** `ArnauM13/polyglot` — branca `main`

### ⬜ Pendent

#### Contingut
- [ ] Lliçons 03-05 (rest of alphabet)
- [ ] Lliçons 08-09 (rest of module 2)
- [ ] Lliçons 10-24 (modules 3-6)
- [ ] Vocabulari ampliat (família, menjar, números, etc.)

#### Funcionalitat
- [ ] **Seeding SRS** — botó/lògica per afegir `basic.json` al deck de l'usuari
- [ ] **Supabase** — schema SQL creat al pla, pendent implementar:
  - `lesson_progress`, `srs_cards`, `review_history`, `daily_stats`
  - Auth (email/password o magic link)
  - Sync offline → online
- [ ] **PWA** — `next-pwa`, `manifest.json`, service worker per offline
- [ ] **Dark mode** — paleta CSS definida, pendent toggle i aplicació consistent
- [ ] **Responsive polish** — mobile-first pendent de revisar en dispositiu real
- [ ] **Deploy Vercel** — quan el producte estigui validat

---

## Supabase — Schema planificat (pendent)

```sql
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  language TEXT NOT NULL,
  lesson_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  score REAL,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE srs_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  language TEXT NOT NULL,
  deck TEXT NOT NULL,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  emoji TEXT,
  ease_factor REAL DEFAULT 2.5,
  interval_days INTEGER DEFAULT 0,
  repetitions INTEGER DEFAULT 0,
  next_review TIMESTAMPTZ DEFAULT now(),
  last_review TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE review_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  card_id UUID REFERENCES srs_cards(id),
  quality INTEGER NOT NULL,   -- 0-5 (SM-2)
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  language TEXT NOT NULL,
  date DATE NOT NULL,
  cards_reviewed INTEGER DEFAULT 0,
  cards_correct INTEGER DEFAULT 0,
  new_cards_learned INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  UNIQUE(user_id, language, date)
);
```

---

## Com reprendre el treball

```bash
cd C:\polyglot
npm run dev          # Dev server → http://localhost:3000
npm run build        # Comprova que compila bé
git log --oneline    # Veure commits
```

### Ordre recomanat per continuar

1. **Lliçons 03-05** (alfabet complet) → fitxers JSON a `/src/data/languages/russian/lessons/`
2. **Seeding SRS** → lògica per carregar `basic.json` al deck de l'usuari
3. **Lliçons 08-24** (contingut complet A1)
4. **Supabase** → crear projecte, executar schema SQL, integrar client
5. **PWA** → `npm install next-pwa`, crear `manifest.json`, configurar `next.config.ts`
6. **Polish** → dark mode toggle, responsive mobile, animacions
7. **Deploy** → `vercel --prod`
