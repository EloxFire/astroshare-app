import { Languages, MapPin, MoonStar, Ruler } from "lucide-react-native";
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
    id: "units",
    route: "/settings/units",
    category: "appearance",
    icon: Ruler,
  },
  {
    id: "observatories",
    route: "/settings/observatories",
    category: "observation",
    icon: MapPin,
  }
];