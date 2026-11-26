import type { ComponentType } from "react";
import type { ImageSourcePropType } from "react-native";

// Catégories du glossaire — chacune a une couleur de pastille (voir categories.ts) utilisée comme
// puce devant un terme et comme pilule de filtre. Union ouverte volontairement fermée (pas de
// `| (string & {})` comme ailleurs dans l'app, ex: CatalogObjectKind) : contrairement à un type
// renvoyé par une API externe, la liste des catégories est entièrement définie par l'app elle-même
// dans categories.ts — une catégorie manquante serait une erreur de configuration, pas un cas à
// tolérer.
export type GlossaryCategoryId = "observing" | "spotting" | "astrophysics" | "equipment" | "spaceflight";

// Illustration d'une entrée, affichée dans un encart sombre quand l'entrée est dépliée (ou à côté du
// mot du jour) — trois formes possibles, à la demande explicite de l'utilisateur :
// - "component" : un composant React dessiné pour cette entrée précise (ex: schéma du terminateur,
//   échelle de magnitude) — le cas le plus riche, voir src/screens/Tools/Glossary/illustrations/.
// - "image" : une image statique (PNG/JPG/WEBP...).
// - "gif" : une image animée — `Image` de React Native anime nativement un GIF sans code
//   supplémentaire, ce variant existe donc surtout pour que la config distingue intentionnellement
//   un gif d'une image fixe (ex: afficher une légende "animation" dans l'encart).
export type GlossaryIllustration =
  | { kind: "component"; Component: ComponentType<Record<string, never>> }
  | { kind: "image"; source: ImageSourcePropType; aspectRatio?: number }
  | { kind: "gif"; source: ImageSourcePropType; aspectRatio?: number };

export type GlossaryEntryConfig = {
  // Identifiant stable, utilisé comme clé i18n (`entries.<id>.term`/`short`/`full`, namespace
  // tools/astroGlossary) et comme cible de `relatedIds`/l'ancre de recherche — ne jamais le
  // renommer une fois des traductions écrites dessus.
  id: string;
  category: GlossaryCategoryId;
  illustration?: GlossaryIllustration;
  // "Voir aussi" : autres entrées liées par leur `id`, affichées en pastilles sous la définition
  // complète. Pas de réciprocité automatique : si A référence B, ajoute aussi B → A si pertinent.
  relatedIds?: string[];
  // Bouton d'action optionnel affiché quand cette entrée est mise en avant (mot du jour) — ex:
  // "Le voir sur la carte de la Lune". `labelKey` est une clé i18n, `route` un chemin expo-router.
  cta?: { labelKey: string; route: string };
};
