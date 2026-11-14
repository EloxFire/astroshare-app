import { app_colors, radius } from "../../helpers/variables";

export const buttonStyles = {
  base: {
    display: "flex" as const,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 10,

    text: {
      fontFamily: "DMMonoMedium",
      fontSize: 14,
      lineHeight: 16,
    },
  },

  // Action principale (ex: Enregistrer) — même couleur que les boutons pilules déjà utilisés
  // partout ailleurs (accent.main).
  color: {
    backgroundColor: app_colors.accent.main,
    padding: 15,
    borderRadius: radius.badge32,

    text: {
      color: app_colors.white,
    },
  },

  // Action destructive (ex: Supprimer) — fond rouge plein, même traitement que le bouton de
  // déconnexion du profil (déjà existant), pas la variante atténuée red.light/red.main utilisée
  // ailleurs pour d'autres usages (badges, textes d'alerte).
  danger: {
    backgroundColor: app_colors.red.main,
    padding: 15,
    borderRadius: radius.badge32,

    text: {
      color: app_colors.white,
    },
  },

  // Action secondaire — même habillage que defaultCard (globalStyles.ts) pour se fondre dans une
  // liste de cartes plutôt que ressortir comme une action principale ; texte/icône en accent.main
  // (plutôt que primary.main) pour rester lisible comme un CTA malgré le fond neutre — reprend le
  // bouton "Ajouter une session" du Journal, seul précédent de ce style dans l'app avant ce composant.
  info: {
    backgroundColor: app_colors.white,
    borderWidth: 1,
    borderColor: app_colors.accent.light,
    padding: 10,
    borderRadius: radius.heroCard,

    text: {
      color: app_colors.accent.main,
    },
  },
}
