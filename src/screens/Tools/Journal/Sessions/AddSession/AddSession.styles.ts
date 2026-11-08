import { app_colors, radius, withOpacity } from "../../../../../helpers/variables";

export const addSessionStyles = {
  dateSection: {
    display: "flex" as const,
    flexDirection: "column" as const,

    datePickerCard: {
      backgroundColor: app_colors.primary.main,
      padding: 10,
      borderRadius: radius.heroCard,
      display: "flex" as const,
      flexDirection: "column" as const,
      gap: 10,


      datePickerContainer: {
        display: "flex" as const,
        flexDirection: 'row' as const,
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        gap: 20,

        picker: {
          display: "flex" as const,
          flexDirection: 'column' as const,
          flex: 1,
          backgroundColor: withOpacity(app_colors.white, 0.2),
          borderRadius: radius.heroCard,
          padding: 10,
          
          text: {
            fontFamily: "DMMonoRegular",
            fontSize: 12,
            color: app_colors.grey,
            textTransform: "uppercase" as const,
            marginBottom: 10,
          },

          time: {
            fontFamily: "ZTNatureBold",
            fontSize: 25,
            lineHeight: 25,
            color: app_colors.white,
          },

          date: {
            fontFamily: "DMMonoRegular",
            fontSize: 12,
            color: app_colors.grey,
          }
        },
      }
    }
  }
}