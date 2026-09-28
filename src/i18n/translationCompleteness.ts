import { resources } from "./resources";
import type { SupportedLanguage } from "./index";

type TranslationTree = { [key: string]: string | string[] | TranslationTree };

const RESOURCES: Record<SupportedLanguage, Record<string, TranslationTree>> = resources;

const REFERENCE_LANGUAGE: SupportedLanguage = "fr";

// Les JSON de traduction peuvent nicher des clés par écran/section (ex: { moon: { phases: { ... } } }),
// donc on aplatit récursivement en chemins ("phases.new") pour pouvoir les compter et les comparer.
const flattenKeys = (tree: TranslationTree, prefix = ""): string[] =>
  Object.entries(tree).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string" || Array.isArray(value)) return [path];
    return flattenKeys(value, path);
  });

const getValueAtPath = (tree: TranslationTree, path: string): unknown =>
  path.split(".").reduce<unknown>((node, segment) => {
    if (node && typeof node === "object" && segment in (node as object)) {
      return (node as TranslationTree)[segment];
    }
    return undefined;
  }, tree);

// Pourcentage de clés traduites dans `language`, par rapport au français (référence) :
// nombre de clés françaises qui existent aussi côté `language` avec une valeur non vide,
// divisé par le nombre total de clés françaises. 100% si le français n'a aucune clé
// (rien à traduire pour l'instant, cf. docs/v3-i18n-architecture.md).
export const getTranslationCompleteness = (language: SupportedLanguage): number => {
  const referenceKeys = Object.entries(RESOURCES[REFERENCE_LANGUAGE]).flatMap(([namespace, tree]) =>
    flattenKeys(tree).map((key) => `${namespace}.${key}`)
  );

  if (referenceKeys.length === 0) return 100;

  const translatedCount = referenceKeys.filter((fullKey) => {
    const [namespace, ...rest] = fullKey.split(".");
    const value = getValueAtPath(RESOURCES[language][namespace], rest.join("."));
    if (Array.isArray(value)) return value.length > 0;
    return typeof value === "string" && value.trim().length > 0;
  }).length;

  return Math.round((translatedCount / referenceKeys.length) * 100);
};
