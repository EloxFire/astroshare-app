import { Languages, MapPin, MoonStar } from "lucide-react-native";
import { AppSetting } from "../../types/settings/appSetting";

export const settingsList: AppSetting[] = [
  {
    id: "display-night-mode",
    name: "Affichage et mode nuit",
    description: "Activez ou désactivez le mode nuit",
    route: "/displaySetting",
    category: "appearance",
    icon: MoonStar,
  },
  {
    id: "language",
    name: "Langue",
    description: "Choisissez la langue de l'application",
    route: "/languageSetting",
    category: "appearance",
    icon: Languages
  },
  {
    id: "observatories",
    name: "Observatoires",
    description: "Gérez vos lieux d'observation",
    route: "/settings/observatories",
    category: "observation",
    icon: MapPin,
  }
];