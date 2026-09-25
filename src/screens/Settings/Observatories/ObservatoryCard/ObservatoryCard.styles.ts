import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors, radius } from "../../../../helpers/variables";

export const observatoryCardStyles = {
  card: {
    ...globalStyles.defaultCard,

    active: {
      borderWidth: 1,
      borderColor: app_colors.accent.main,
    },

    body: {
      display: "flex" as const,
      flexDirection: 'row' as const,
      justifyContent: "space-between" as const,
      gap: 10,
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: app_colors.primary.light,

      chevronRight: {
        display: "flex" as const,
        alignItems: "flex-end" as const,
        justifyContent: "center" as const,
        flex: 1,
      },

      bortleBadge: {
        display: "flex" as const,
        flexDirection: "column" as const,
        alignItems: "center" as const,
        justifyContent: "center" as const,
        backgroundColor: app_colors.primary.main,
        borderRadius: radius.badge32,
        padding: 10,
        width: 52,
        height: 52,

        label: {
          color: app_colors.white,
          fontFamily: "DMMonoMedium" as const,
          fontSize: 8,
        },

        value: {
          color: app_colors.white,
          fontSize: 30,
          lineHeight: 30,
          fontFamily: "ZTNatureBold" as const,
        }
      },

      observatoryInfos: {
        display: "flex" as const,
        flexDirection: "column" as const,

        observatoryNameContainer: {
          display: "flex" as const,
          flexDirection: "row" as const,
          alignItems: "center" as const,
          justifyContent: "flex-start" as const,
          gap: 10,
          
          observatoryName: {
            fontFamily: "ZTNatureBold" as const,
            fontSize: 16,
            lineHeight: 16,
            color: app_colors.primary.main,
          },
        },

        observatoryLocation: {
          fontFamily: "DMMonoRegular" as const,
          fontSize: 10,
          color: app_colors.primary.medium,
        },

        quickInfos: {
          display: "flex" as const,
          flexDirection: "row" as const,
          gap: 10,
          marginTop: 5,

          quickInfo: {
            display: "flex" as const,
            flexDirection: "row" as const,
            alignItems: "center" as const,
            gap: 2,

            value: {
              fontFamily: "DMMonoMedium" as const,
              fontSize: 10,
              color: app_colors.primary.main,
            }
          }
        }
      }
    },

    footer: {
      display: "flex" as const,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      gap: 15,

      observatoryEquipments: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "flex-start" as const,
        gap: 15,
      },

      communityInfos: {
        display: "flex" as const,
        flexDirection: "row" as const,
        justifyContent: "flex-end" as const,
        gap: 15,
      }
    }
  }
}