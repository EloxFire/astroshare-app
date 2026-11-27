import { app_colors, withOpacity } from "../../variables";

// Palette "verre sombre" commune aux menus du planétarium (boutons, panneaux, modale de recherche,
// carte d'horloge) — reprend le style déjà existant sur la branche main pour cet écran (fond noir
// translucide, bordure blanche fine, icônes blanches à opacité réduite) plutôt que le style clair/
// accent utilisé ailleurs dans l'app : ces menus flottent au-dessus du ciel nocturne, pas d'un fond
// blanc. Un seul endroit pour ces couleurs, réutilisé par chaque composant du dossier
// `src/screens/Explore/components/`.
export const DARK_GLASS_BG = withOpacity(app_colors.black, 0.62);
export const DARK_GLASS_BORDER = withOpacity(app_colors.white, 0.16);
export const DARK_GLASS_BG_ACTIVE = withOpacity(app_colors.white, 0.12);
export const DARK_GLASS_BORDER_ACTIVE = withOpacity(app_colors.white, 0.5);
export const DARK_GLASS_ICON = withOpacity(app_colors.white, 0.75);
export const DARK_GLASS_ICON_ACTIVE = app_colors.white;
export const DARK_GLASS_TEXT = withOpacity(app_colors.white, 0.9);
export const DARK_GLASS_TEXT_MUTED = withOpacity(app_colors.white, 0.55);
