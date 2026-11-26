import { app_colors, spacing } from "../../../helpers/variables";

export const glossaryScreenStyles = {
  screen: {
    flex: 1,
    backgroundColor: app_colors.background,
  },

  // Englobe la ScrollView et l'overlay sticky de l'index A-Z : lui seul sert de repère de
  // positionnement à cet overlay (`position: relative` implicite de toute View RN), pour qu'il
  // commence à exactement 0 ici plutôt que d'avoir à tenir compte de la hauteur du ScreenHeader
  // au-dessus (qui, lui, n'est pas dans ce wrapper).
  scrollArea: {
    flex: 1,
  },

  content: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 16,
    padding: spacing.screenMargin,
    paddingBottom: 60,
  },

  // Recherche + mot du jour + pilules — mesuré (onLayout) pour savoir jusqu'où l'index A-Z doit
  // descendre avant de coller en haut de la zone de défilement (voir stickyIndexTranslateY).
  headerBlock: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 16,
  },

  // Laisse la place à l'index A-Z en superposition (voir stickyIndexWrap) — seule la liste des
  // entrées est concernée, pas le mot du jour/les pilules au-dessus (demande explicite : ces blocs
  // restent pleine largeur).
  entriesColumn: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 16,
    paddingRight: 20,
  },

  stickyIndexWrap: {
    position: "absolute" as const,
    top: 0,
    right: 0,
  },

  letterGroup: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  letterHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,

    letter: {
      fontFamily: "ZTNatureBold",
      fontSize: 20,
      color: app_colors.accent.main,
    },

    rule: {
      flex: 1,
      height: 1,
      backgroundColor: app_colors.accent.light,
    },
  },

  entriesList: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 10,
  },

  emptyState: {
    alignItems: "center" as const,
    paddingVertical: 40,

    text: {
      fontFamily: "DMMonoRegular",
      fontSize: 13,
      color: app_colors.primary.medium,
      textAlign: "center" as const,
    },
  },
};
