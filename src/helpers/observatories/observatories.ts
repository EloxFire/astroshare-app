import { HatGlassesIcon, HomeIcon, MountainIcon, TelescopeIcon } from "lucide-react-native";
import i18next from "../../i18n";

export const observatoriesTypes = [
  {
    id: "home",
    label: i18next.t("addObservatory.stepTwo.observatoryType.types.home", {ns: "settings"}),
    icon: HomeIcon
  },
  {
    id: "private",
    label: i18next.t("addObservatory.stepTwo.observatoryType.types.private", {ns: "settings"}),
    icon: HatGlassesIcon
  },
  {
    id: "public",
    label: i18next.t("addObservatory.stepTwo.observatoryType.types.public", {ns: "settings"} ),
    icon: MountainIcon
  },
  {
    id: "observatory",
    label: i18next.t("addObservatory.stepTwo.observatoryType.types.observatory", {ns: "settings"}),
    icon: TelescopeIcon
  }
]