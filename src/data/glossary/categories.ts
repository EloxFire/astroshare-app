import { app_colors } from "../../helpers/variables";
import type { GlossaryCategoryId } from "../../types/glossary/GlossaryEntry";

// Couleur de pastille par catégorie — reprend des tokens existants quand ils correspondent déjà
// (seules "astrophysics"/"spaceflight" sont des teintes dédiées au glossaire, pas réutilisées
// ailleurs). Libellé affiché via `t(\`categories.${id}\`)` (namespace tools/astroGlossary), jamais
// stocké ici (voir CLAUDE.md : jamais de texte traduit dans un fichier de config).
export const GLOSSARY_CATEGORY_ORDER: GlossaryCategoryId[] = ["observing", "spotting", "astrophysics", "equipment", "spaceflight"];

export const GLOSSARY_CATEGORY_COLORS: Record<GlossaryCategoryId, string> = {
  observing: app_colors.accent.main,
  spotting: app_colors.ambre.main,
  astrophysics: "#B98CE8",
  equipment: app_colors.primary.main,
  spaceflight: "#2E86DE",
};
