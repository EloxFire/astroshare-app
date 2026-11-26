import type { GlossaryCategoryId, GlossaryEntryConfig } from "../../types/glossary/GlossaryEntry";

export type ResolvedGlossaryEntry = {
  config: GlossaryEntryConfig;
  term: string;
  shortDefinition: string;
  fullDefinition: string;
  // Libellés déjà résolus des `relatedIds` existants (un id sans entrée correspondante est
  // silencieusement ignoré) — précalculé une fois par GlossaryScreen plutôt que recalculé à chaque
  // rendu de chaque ligne, voir le commentaire dans GlossaryScreen.tsx.
  relatedTerms: { id: string; term: string }[];
};

export const ALPHABET: string[] = Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index));

// Insensible aux accents ET à la casse (même technique que SelectInput.tsx) : "zenith" retrouve
// "Zénith", "ecliptique" retrouve "Écliptique".
export const normalizeForSearch = (text: string): string =>
  text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

// Catégorie ET recherche se combinent (les deux filtres s'appliquent ensemble, pas l'un ou l'autre —
// même principe que ToolsScreen). `category` null = "Tous".
export const filterGlossaryEntries = (
  entries: ResolvedGlossaryEntry[],
  category: GlossaryCategoryId | null,
  query: string
): ResolvedGlossaryEntry[] => {
  const normalizedQuery = normalizeForSearch(query.trim());
  return entries.filter((entry) => {
    const matchesCategory = category === null || entry.config.category === category;
    const matchesQuery =
      normalizedQuery === "" ||
      normalizeForSearch(entry.term).includes(normalizedQuery) ||
      normalizeForSearch(entry.shortDefinition).includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
};

export type GlossaryLetterGroup = { letter: string; entries: ResolvedGlossaryEntry[] };

// Groupe par première lettre (du terme normalisé, donc "Écliptique" tombe sous "E"), triés
// alphabétiquement — `localeCompare` plutôt qu'un tri ASCII brut pour un ordre correct malgré les
// accents/la casse.
export const groupEntriesByLetter = (entries: ResolvedGlossaryEntry[]): GlossaryLetterGroup[] => {
  const sorted = [...entries].sort((a, b) => a.term.localeCompare(b.term, undefined, { sensitivity: "base" }));
  const groups: GlossaryLetterGroup[] = [];
  for (const entry of sorted) {
    const letter = normalizeForSearch(entry.term).charAt(0).toUpperCase();
    const lastGroup = groups[groups.length - 1];
    if (lastGroup?.letter === letter) lastGroup.entries.push(entry);
    else groups.push({ letter, entries: [entry] });
  }
  return groups;
};
