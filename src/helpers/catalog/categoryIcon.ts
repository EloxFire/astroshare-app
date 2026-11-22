import { Circle, CircleDotDashed, Cloud, LucideIcon, Orbit, Sparkles, Star, Telescope } from "lucide-react-native";
import type { CatalogObjectCategory } from "../../types/catalog/CatalogObject";

// Aucune icône par catégorie n'existait dans l'app avant (catégories jusqu'ici seulement
// traduites en texte, voir getCatalogObjectSubtitle). Utilisé pour le pictogramme rond des lignes
// de résultat de la recherche globale et le halo décoratif de la fiche objet. `CircleDotDashed`
// pour `cluster` reprend l'icône déjà utilisée pour l'outil Simulateur de champ ailleurs dans
// l'app — un cercle en pointillés évoque bien un amas de points, et évite une icône "étoile" déjà
// prise par la catégorie `star`. kind/category ne sont jamais garantis figés par l'API (voir le
// commentaire sur CatalogObjectKind), d'où le `string & {}` dans le type et un repli générique.
const CATEGORY_ICONS: Record<CatalogObjectCategory, LucideIcon> = {
  galaxy: Sparkles,
  nebula: Cloud,
  cluster: CircleDotDashed,
  star: Star,
  solar_system: Orbit,
  other: Circle,
};

export const getCatalogObjectIcon = (category: CatalogObjectCategory | (string & {})): LucideIcon =>
  CATEGORY_ICONS[category as CatalogObjectCategory] ?? Telescope;
