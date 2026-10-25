// Design tokens de l'app — équivalent de variables CSS custom properties.
// Une seule source de vérité pour couleurs, espacements, rayons, typographie, icônes.
// Quand une valeur de la spec est une fourchette (ex: "11–13 px"), on prend le milieu
// et on garde la fourchette d'origine en commentaire pour ne rien perdre au passage.

// Applique une opacité (0–1) à une couleur hex pleine (#RRGGBB) en ajoutant le suffixe alpha hex.
// RN ne supporte pas rgba() en tant que fonction : seule une string hex/rgba littérale fonctionne.
export const withOpacity = (hexColor: string, opacity: number): string => {
  const alpha = Math.round(opacity * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hexColor}${alpha}`;
};

const hexToRgb = (hexColor: string): [number, number, number] => {
  const sanitized = hexColor.replace("#", "");
  return [
    parseInt(sanitized.slice(0, 2), 16),
    parseInt(sanitized.slice(2, 4), 16),
    parseInt(sanitized.slice(4, 6), 16),
  ];
};

const rgbToHex = (r: number, g: number, b: number): string =>
  `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;

// Pré-mélange foregroundHex à opacity sur backgroundHex et renvoie une couleur SOLIDE (sans canal
// alpha) visuellement identique à withOpacity(foregroundHex, opacity) sur ce fond précis — mais
// qui ne se recompose plus avec ce qu'il y a derrière au rendu. Nécessaire pour un SVG (icône
// lucide-react-native) dont les traits se croisent : une vraie transparence (withOpacity) double
// l'effet aux intersections, perceptible comme une transparence inégale/"multiplicative".
export const flattenOpacity = (foregroundHex: string, opacity: number, backgroundHex: string): string => {
  const [fr, fg, fb] = hexToRgb(foregroundHex);
  const [br, bg, bb] = hexToRgb(backgroundHex);
  return rgbToHex(
    fr * opacity + br * (1 - opacity),
    fg * opacity + bg * (1 - opacity),
    fb * opacity + bb * (1 - opacity)
  );
};

export const app_colors = {
  black: "#000000",
  white: "#FFFFFF",
  grey: "#dcdcdc",
  primary: {
    light: "#230B5A16", // 16% opacity
    medium: "#230B5A80", // 50% opacity
    main: "#230B5A",
  },
  accent: {
    light: "#F2D7FF",
    main: "#8E01F9",
  },
  yellow: {
    light: "#FFE993",
    main: "#FFD700",
  },
  // Rouge "danger" (erreurs, suppression) — pas un rouge pur (#FF0000), qui tranche trop avec
  // le reste de la palette (violets/jaunes) ; une teinte un peu moins saturée s'y fond mieux.
  red: {
    light: "#FFD9D9",
    main: "#E5484D",
  },
  green: {
    light: "#D7F5E3",
    main: "#1FAD5D",
  },
  background: "#FCF4FF",
  bortleScale: {
    1: '#000000', // Black – Bortle 1
    2: '#4A4A4A', // Dark grey – Bortle 2
    3: '#878787', // Grey – Bortle 3
    4: '#0064FF', // Blue – Bortle 4
    5: '#41A600', // Green – Bortle 5
    6: '#A3C000', // Yellow-green – Bortle 6
    7: '#E6C200', // Yellow – Bortle 7
    8: '#FF5A00', // Orange-red – Bortle 8
    9: '#FF0000', // Red – Bortle 9
  }
};

// Dégradé officiel NOAA pour les échelles de météo spatiale (voir helpers/api/spaceWeather/scales.ts
// et types/spaceWeather/NoaaScales.ts) : G (tempête géomagnétique), R (coupure radio), S (tempête de
// radiations solaires) partagent le même dégradé jaune → rouge sombre, seul le chiffre de sévérité
// (1 à 5) compte — voir getNoaaScaleColor ci-dessous plutôt que d'indexer ceci directement. Séparé
// de app_colors (plutôt qu'imbriqué dedans) car 0 référence app_colors.accent.light, inaccessible
// depuis l'intérieur du même objet littéral.
const noaaScaleSeverityColors: Record<number, string> = {
  0: app_colors.accent.light, // aucun évènement
  1: '#FFFF00', // Jaune – mineur (G1/R1/S1)
  2: '#FFCC00', // Ambre – modéré (G2/R2/S2)
  3: '#FF9900', // Orange – fort (G3/R3/S3)
  4: '#FF0000', // Rouge – sévère (G4/R4/S4)
  5: '#C80000', // Rouge sombre – extrême (G5/R5/S5)
};

// Couleur officielle NOAA pour un code d'échelle de météo spatiale ("G0".."G5", "R0".."R5",
// "S0".."S5") — seul le chiffre final (sévérité) détermine la couleur, la lettre n'a pas d'incidence.
export const getNoaaScaleColor = (scale: string | null | undefined): string => {
  const severity = Number(scale?.slice(1));
  return noaaScaleSeverityColors[severity] ?? app_colors.grey;
};

// Paliers du score d'observabilité (0-100, voir helpers/weather/observabilityScore.ts) : mauvais
// sous le seuil bas (conditions nettement mauvaises), mitigé entre les deux, bon au-dessus — mêmes
// paliers nets que getNoaaScaleColor ci-dessus, pas de dégradé continu. Même fonction de palier
// réutilisée pour la couleur (cercle de score, barres de chaque donnée) ET le verdict textuel.
const OBSERVABILITY_SCORE_LOW_THRESHOLD = 40;
const OBSERVABILITY_SCORE_HIGH_THRESHOLD = 70;

export type ObservabilityScoreBand = "bad" | "medium" | "good";

export const getObservabilityScoreBand = (score: number | null | undefined): ObservabilityScoreBand | null => {
  if (score == null) return null;
  if (score < OBSERVABILITY_SCORE_LOW_THRESHOLD) return "bad";
  if (score < OBSERVABILITY_SCORE_HIGH_THRESHOLD) return "medium";
  return "good";
};

const observabilityScoreBandColors: Record<ObservabilityScoreBand, string> = {
  bad: app_colors.red.main,
  medium: app_colors.accent.main,
  good: app_colors.green.main,
};

export const getObservabilityScoreColor = (score: number | null | undefined): string => {
  const band = getObservabilityScoreBand(score);
  return band ? observabilityScoreBandColors[band] : app_colors.primary.medium;
};

export const spacing = {
  screenMargin: 16,

  screen: {
    horizontal: 16,
    top: 0, // la nav se place en dessous, pas de padding réservé en haut
  },

  modalSheet: {
    top: 14,
    horizontal: 18,
    bottom: 22,
    bottomWithKeyboard: 0, // clavier ouvert : plus de marge basse
  },

  toolCard: 12, // spec: 11–13px — carte outil / carte lavande

  listRow: {
    vertical: 8.5, // spec: 8–9px
    horizontal: 0, // séparateur pleine largeur
  },

  banner: {
    vertical: 12,
    horizontal: 13.5, // spec: 13–14px — bandeau jaune (verdict, conseil)
  },

  pillButtonPrimary: {
    vertical: 13, // pleine largeur
  },
  pillButtonSecondarySize: 48, // 48 × 48

  chip: {
    vertical: 7,
    horizontal: 11.5, // spec: 11–12px
  },

  badge: {
    vertical: 3.5, // spec: 3–4px
    horizontal: 7.5, // spec: 7–8px
  },

  navBar: {
    top: 9,
    horizontal: 12,
    bottom: 20,
  },
};

export const radius = {
  modalSheetTop: 32, // haut uniquement
  screenBezel: 38, // bezel maquette
  heroCard: 21, // spec: 20–22px — grande carte / image héro
  mediumCard: 17, // spec: 16–18px — carte moyenne, bandeau
  searchField: 14,

  badge44: 15, // pastille icône 44px
  badge38: 13, // pastille icône 38px
  badge32: 10.5, // spec: 10–11px — pastille icône 30–32px

  pill: 99, // chips, boutons, pilules
  keyboardKey: 5,
};

// Polices chargées via src/hooks/useAppFonts.ts (branché dans app/_layout.tsx).
// ZT Nature remplace Outfit pour la marque (titres). Seuls Regular/Bold/Italic sont fournis
// pour ZT Nature (pas de fichier "SemiBold" séparé) : les rôles ci-dessous, prévus en 600,
// utilisent donc ZTNatureBold — c'est la seule graisse marquée disponible en dehors de Regular.
//
// ⚠️ Pas de fichier DMMono-SemiBold.ttf fourni : "DMMonoMedium" ci-dessous ne charge rien et
// retombe sur la police système tant que ce fichier n'est pas ajouté dans assets/fonts/ +
// useAppFonts.ts. Ne pas le remplacer par DMMonoMedium (500) en attendant : la règle de graisse
// réserve explicitement le 500 à la texture système (barre d'état, clavier), jamais à la marque.
//
// Règle de graisse — deux graisses de marque seulement, jamais une troisième :
// - ZT Nature Bold : tous les titres, noms d'outils, valeurs chiffrées, libellés de cartes.
// - DM Mono SemiBold (600) : dès qu'un texte est en capitales + letter-spacing (labels de section,
//   chips/filtres, badges, libellés de tuiles, libellés de nav, micro-labels sur fond sombre),
//   + valeurs en gras des lignes clé/valeur, + boutons pilules.
// - DM Mono Regular (400) : toute phrase en casse normale (sous-lignes, méta de ligne, texte
//   courant des cartes, notes de bas, placeholder du champ de recherche).
// - DM Mono Medium (500) : seule exception aux deux graisses ci-dessus — barre d'état et touches
//   du clavier uniquement (texture système, pas la marque).
// La hiérarchie visuelle se fait par la taille/couleur/opacité, jamais par une graisse de plus.
export const typography = {
  ztNature: {
    screenTitle: { fontFamily: "ZTNatureBold", fontSize: 27, lineHeight: 27 }, // line-height 1
    toolTitleOpen: { fontFamily: "ZTNatureBold", fontSize: 19 },
    cardTitle: { fontFamily: "ZTNatureBold", fontSize: 14 },
    rowName: { fontFamily: "ZTNatureBold", fontSize: 11.5 },
    numericValue: { fontFamily: "ZTNatureBold", fontSize: 18 },
  },
  dmMono: {
    semiBold: {
      // ⚠️ DMMonoMedium non chargée (voir avertissement ci-dessus) — fallback système en attendant.
      sectionLabel: { fontFamily: "DMMonoMedium", fontSize: 9.5, letterSpacing: 9.5 * 0.16 },
      chip: { fontFamily: "DMMonoMedium", fontSize: 9, letterSpacing: 9 * 0.06 },
      badge: { fontFamily: "DMMonoMedium", fontSize: 7.5, letterSpacing: 7.5 * 0.1 },
      tileLabel: { fontFamily: "DMMonoMedium", fontSize: 8, lineHeight: 8 * 1.25 },
      // Taille non spécifiée par la spec — à fixer au moment de l'implémentation du composant.
      navLabel: { fontFamily: "DMMonoMedium" }, // libellés de nav
      microLabelOnDark: { fontFamily: "DMMonoMedium" }, // micro-labels sur fond sombre
      keyValueBoldValue: { fontFamily: "DMMonoMedium" }, // valeur en gras d'une ligne clé/valeur
      pillButton: { fontFamily: "DMMonoMedium" }, // texte des boutons pilules
    },
    regular: {
      subline: { fontFamily: "DMMonoRegular", fontSize: 9, lineHeight: 9 * 1.35 },
      rowMeta: { fontFamily: "DMMonoRegular", fontSize: 8.5 },
      footnote: { fontFamily: "DMMonoRegular", fontSize: 8.5, lineHeight: 8.5 * 1.5 },
      searchPlaceholder: { fontFamily: "DMMonoRegular", fontSize: 11.5 },
      // Taille non spécifiée par la spec — à fixer au moment de l'implémentation du composant.
      cardBody: { fontFamily: "DMMonoRegular" }, // texte courant des cartes
    },
  },
  // Exception unique aux deux graisses de marque : texture système, pas la marque.
  system: {
    keyboardKey: { fontFamily: "DMMonoMedium", fontSize: 15 },
    // Taille non spécifiée par la spec — à fixer au moment de l'implémentation du composant.
    statusBar: { fontFamily: "DMMonoMedium" },
  },
  minFontSize: 7.5, // plancher réservé aux badges en capitales, rien en dessous
};

export const icons = {
  nav: 19,
  navCenterButton: { icon: 21, circle: 46 },

  badge44: 20, // pastille 44px
  badge38: 19, // pastille 38px
  badge32: 16.5, // spec: 16–17px — pastille 30–32px

  rowChevron: 14.5, // spec: 14–15px
  inlineInChipOrBanner: 12, // spec: 11–13px

  partnerDot: 12, // disque sans glyphe, ancré au coin de la pastille
};

export const gaps = {
  gridTile: { vertical: 8, horizontal: 6, columns: 4 },
  sideBySideCards: 9,
  chips: 7,
  iconToText: 11.5, // spec: 11–12px

  sectionSeparator: {
    height: 1,
    color: withOpacity(app_colors.primary.main, 0.16),
    before: 9,
    after: 10,
  },
};
