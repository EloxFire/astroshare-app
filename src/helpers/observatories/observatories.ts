import { BathIcon, Bed, CarIcon, CookingPot, FootprintsIcon, HatGlassesIcon, HomeIcon, MountainIcon, ParkingCircle, PlugZap, TelescopeIcon, WifiIcon } from "lucide-react-native";
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

export const observatoriesEquipments = [
  {
    id: "electricity",
    label: i18next.t("addObservatory.stepTwo.equipments.types.electricity", {ns: "settings"}),
    icon: PlugZap
  },
  {
    id: "internet",
    label: i18next.t("addObservatory.stepTwo.equipments.types.internet", {ns: "settings"}),
    icon: WifiIcon
  },
  {
    id: "parking",
    label: i18next.t("addObservatory.stepTwo.equipments.types.parking", {ns: "settings"}),
    icon: ParkingCircle
  },
  {
    id: "shelter",
    label: i18next.t("addObservatory.stepTwo.equipments.types.shelter", {ns: "settings"}),
    icon: Bed
  },
  {
    id: "bathroom",
    label: i18next.t("addObservatory.stepTwo.equipments.types.bathroom", {ns: "settings"}),
    icon: BathIcon
  },
  {
    id: "kitchen",
    label: i18next.t("addObservatory.stepTwo.equipments.types.kitchen", {ns: "settings"}),
    icon: CookingPot
  }
]

export const observatoriesAccessTypes = [
  {
    id: "car",
    label: i18next.t("addObservatory.stepTwo.observatoryAccess.types.car", {ns: "settings"}),
    icon: CarIcon
  },
  {
    id: "foot",
    label: i18next.t("addObservatory.stepTwo.observatoryAccess.types.foot", {ns: "settings"}),
    icon: FootprintsIcon
  }
]