import Toast from "react-native-root-toast";
import { app_colors } from "../constants";
import { i18n } from "./i18n";

interface showToasInterface {
  message: string;
  duration?: number;
  type?: 'error' | 'success';
}

export const showToast = ({ message, duration, type}: showToasInterface ) => {
  Toast.show(message, {
    textColor: type === 'error' ? app_colors.red : app_colors.white,
    backgroundColor: app_colors.black,
    position: Toast.positions.BOTTOM - 30,
    duration: duration || 2500,
    shadow: true,
    animation: true,
  });
};

export const showAchievementToast = ({ title }: { title: string }) => {
  const message = `🎁 ${i18n.t("dashboard.toast.unlocked", { title })}`;

  Toast.show(message, {
    duration: 4000,
    position: Toast.positions.BOTTOM - 40,
    shadow: true,
    animation: true,
    opacity: 1,
    backgroundColor: app_colors.black,
    textColor: app_colors.white,
    containerStyle: {
      borderRadius: 10,
      borderWidth: 1,
      borderColor: app_colors.white_twenty,
      paddingHorizontal: 10,
      paddingVertical: 10,
    },
  });
};
