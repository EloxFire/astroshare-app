import { app_colors, radius, withOpacity } from "../../../helpers/variables";

export const sessionCardStyles = {
  // Carte sombre : en-tête (pastille de date + lieu et horaires), puis une ligne de notes.
  card: {
    padding: 10,
    borderRadius: radius.heroCard,
    display: "flex" as const,
    flexDirection: "column" as const,
    backgroundColor: app_colors.primary.main,

    header: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "flex-start" as const,
      alignItems: "center" as const,

      // Pastille de date : jour au-dessus du mois abrégé (même présentation que la pastille date
      // d'IconButtonCard, en plus grand).
      date: {
        backgroundColor: app_colors.yellow.main,
        borderRadius: radius.badge44,
        padding: 10,
        width: 60,
        height: 60,
        display: "flex" as const,
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        alignItems: "center" as const,

        day: {
          fontSize: 25,
          lineHeight: 25,
          fontFamily: "ZTNatureBold" as const,
          color: app_colors.primary.main,
        },

        month: {
          fontSize: 12,
          lineHeight: 12,
          fontFamily: "DMMonoMedium" as const,
          textTransform: "uppercase" as const,
          color: app_colors.primary.main,
        },
      },

      content: {
        display: "flex" as const,
        flexDirection: "column" as const,
        justifyContent: "center" as const,
        alignItems: "flex-start" as const,
        marginLeft: 10,

        label: {
          fontSize: 12,
          fontFamily: "DMMonoMedium" as const,
          color: app_colors.accent.light,
          textTransform: "uppercase" as const,
        },

        title: {
          fontSize: 18,
          fontFamily: "ZTNatureBold" as const,
          color: app_colors.white,
        },

        details: {
          fontSize: 12,
          fontFamily: "DMMonoMedium" as const,
          color: withOpacity(app_colors.white, 0.5),
        },
      },
    },

    // Notes de la session (ex: seeing, transparence, noirceur), une colonne chacune.
    grades: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      gap: 10,
      marginTop: 10,

      gradeCard: {
        backgroundColor: withOpacity(app_colors.white, 0.1),
        borderRadius: radius.badge32,
        flex: 1,
        padding: 10,

        title: {
          fontSize: 12,
          fontFamily: "DMMonoMedium" as const,
          color: app_colors.grey,
        },

        // Note sur MAX_GRADE, en segments : allumés jusqu'à la note, éteints au-delà.
        segments: {
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          gap: 3,

          segment: {
            flex: 1,
            height: 5,
            backgroundColor: withOpacity(app_colors.white, 0.2),
            borderRadius: radius.heroCard,
            marginTop: 5,

            active: {
              backgroundColor: app_colors.yellow.main,
            },
          },
        },
      },
    },
  },
};
