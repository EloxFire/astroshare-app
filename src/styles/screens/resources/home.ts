import { app_colors } from "../../../helpers/constants";

export const resourcesHomeStyles = {
  header: {
    display: "flex" as "flex",
    flexDirection: "row" as "row",
    justifyContent: "flex-end" as "flex-end",
    alignItems: "center" as "center",
    marginBottom: 20,

    number:{
      fontSize: 12,
      color: app_colors.white_eighty,
      fontFamily: "DMMonoRegular"
    }
  }
}