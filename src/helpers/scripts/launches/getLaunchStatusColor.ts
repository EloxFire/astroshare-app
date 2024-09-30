import { app_colors } from "../../constants";

type StatusColor = {
  backgroundColor: string;
  textColor: string;
};

export const getLaunchStatusColor = (statusId: number): StatusColor => {
  switch (statusId) {
    case 1: // Go for Launch
      return { backgroundColor: "#00FF00", textColor: "#000000" }; // Vert fond, noir texte
    case 2: // To Be Determined
      return { backgroundColor: "#808080", textColor: "#FFFFFF" }; // Gris fond, blanc texte
    case 3: // Launch Successful
      return { backgroundColor: "#0000FF", textColor: "#FFFFFF" }; // Bleu fond, blanc texte
    case 4: // Launch Failure
      return { backgroundColor: "#FF0000", textColor: "#FFFFFF" }; // Rouge fond, blanc texte
    case 5: // On Hold
      return { backgroundColor: "#FFA500", textColor: "#000000" }; // Orange fond, noir texte
    case 6: // Launch in Flight
      return { backgroundColor: "#FFD700", textColor: "#000000" }; // Jaune doré fond, noir texte
    case 7: // Launch was a Partial Failure
      return { backgroundColor: "#FF6347", textColor: "#000000" }; // Rouge tomate fond, noir texte
    case 8: // To Be Confirmed
      return { backgroundColor: "#808000", textColor: "#FFFFFF" }; // Olive fond, blanc texte
    case 9: // Payload Deployed
      return { backgroundColor: "#4B0082", textColor: "#FFFFFF" }; // Indigo fond, blanc texte
    default:
      return { backgroundColor: app_colors.white_no_opacity, textColor: "#FFFFFF" }; // Noir fond, blanc texte
  }
}