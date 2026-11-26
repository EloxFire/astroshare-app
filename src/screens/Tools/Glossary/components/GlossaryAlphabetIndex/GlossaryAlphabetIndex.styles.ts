import { app_colors } from "../../../../../helpers/variables";

export const glossaryAlphabetIndexStyles = {
  // Pas de position absolue ici : c'est GlossaryScreen (voir stickyIndexWrap) qui positionne et
  // anime ce composant en entier (sticky top) — lui n'est qu'une colonne de lettres à sa hauteur
  // naturelle.
  container: {
    width: 30,
    alignItems: "center" as const,
    gap: 10,
  },

  letter: {
    fontFamily: "DMMonoRegular",
    fontSize: 15,
    lineHeight: 15 * 1.4,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
    width: 30,

    active: {
      fontFamily: "ZTNatureBold",
      color: app_colors.accent.main,
    },

    // Lettre de la section actuellement visible à l'écran — par-dessus `active` (voir l'ordre des
    // styles dans GlossaryAlphabetIndex.tsx : une lettre "courante" est forcément "disponible").
    current: {
      fontFamily: "ZTNatureBold",
      color: app_colors.yellow.main,
    },

    disabled: {
      color: app_colors.grey,
    },
  },
};
