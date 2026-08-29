import { Languages, MapPin, MoonStar } from "lucide-react-native";
import { AppSetting } from "../../types/settings/appSetting";

export const settingsList: AppSetting[] = [
  {
    id: "display-night-mode",
    route: "/displaySetting",
    category: "appearance",
    icon: MoonStar,
  },
  {
    id: "language",
    route: "/settings/language",
    category: "appearance",
    icon: Languages
  },
  {
    id: "observatories",
    route: "/settings/observatories",
    category: "observation",
    icon: MapPin,
  }
];