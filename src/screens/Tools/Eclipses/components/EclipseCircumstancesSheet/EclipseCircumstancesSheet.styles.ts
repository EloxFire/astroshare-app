import { app_colors, radius } from "../../../../../helpers/variables";

export const eclipseCircumstancesSheetStyles = {
  // Plein-bord (pas de marge gauche/droite/bas) — une vraie feuille accrochée au bas de l'écran,
  // pas une carte flottante : seuls les coins du haut sont arrondis (retour utilisateur : "le
  // container de la modale a des marges en trop").
  card: {
    position: "absolute" as const,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: app_colors.background,
    borderTopLeftRadius: radius.heroCard,
    borderTopRightRadius: radius.heroCard,
    paddingTop: 10,
    paddingHorizontal: 20,
    shadowColor: app_colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },

  // Zone de prise élargie autour de la poignée (padding généreux) — la barre visible reste fine,
  // mais la cible tactile est bien plus grande qu'elle (retour utilisateur : trop petite à saisir).
  handleHitArea: {
    alignSelf: "center" as const,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 2,
  },

  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: app_colors.primary.medium,
  },

  closeButton: {
    position: "absolute" as const,
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: app_colors.accent.light,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    zIndex: 1,
  },

  // Englobe la poignée + le bloc d'en-tête (icône/lieu/titre) fourni par l'écran appelant — TOUJOURS
  // visible, replié ou non (voir image de référence : seul ce qui est en dessous se replie).
  headerWrap: {
    paddingRight: 36, // laisse la place au bouton de fermeture
  },

  scrollContent: {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    paddingTop: 12,
    paddingBottom: 16,
  },

  hint: {
    fontFamily: "DMMonoRegular",
    fontSize: 13,
    color: app_colors.primary.medium,
    textAlign: "center" as const,
  },
};
