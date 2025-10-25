import { app_colors } from "../../../helpers/constants";

export const changelogStyles = {
  content: {
    display: "flex" as "flex",
    flexDirection: "column" as "column",

    change: {
      display: "flex" as "flex",
      flexDirection: "column" as "column",
      padding: 10,
      marginBottom: 10,
      backgroundColor: app_colors.white_no_opacity,
      borderColor: app_colors.white_no_opacity,
      borderWidth: 1,
      borderRadius: 10,

      header: {
        display: "flex" as "flex",
        flexDirection: "row" as "row",
        justifyContent: "space-between" as "space-between",

        title: {
          fontFamily: 'GilroyBlack',
          fontSize: 20,
          textTransform: 'uppercase' as 'uppercase',
          color: app_colors.white,
        },
  
        subtitle: {
          fontFamily: 'GilroyRegular',
          fontSize: 15,
          color: app_colors.white,
          maxWidth: 210,
        },

        date: {
          fontFamily: 'DMMonoRegular',
          fontSize: 12,
          color: app_colors.white_eighty,
          textAlign: 'right' as 'right',
        },

        date_title: {
          fontFamily: 'GilroyRegular',
          fontSize: 12,
          color: app_colors.white_eighty,
          textAlign: 'right' as 'right',
        }
      },

      list: {
        display: "flex" as "flex",
        flexDirection: "column" as "column",
        marginTop: 10,
        paddingTop: 10,
        borderTopColor: app_colors.white_twenty,
        borderTopWidth: 1,
        
        item: {
          fontFamily: 'GilroyRegular',
          fontSize: 15,
          color: app_colors.white,
          marginBottom: 10,
        }
      }
    }
  }
}