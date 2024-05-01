import Toast from "react-native-root-toast";
import { app_colors } from "../constants";

interface showToasInterface {
  message: string;
  duration?: number;
  type?: 'error' | 'success';
}

export const showToast = ({ message, duration, type}: showToasInterface ) => {
  let toast = Toast.show(message, {
    textColor: type === 'error' ? app_colors.red : app_colors.white,
  });
}