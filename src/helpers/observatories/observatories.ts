import { BathIcon, Bed, CarIcon, CookingPot, FootprintsIcon, HatGlassesIcon, HomeIcon, LucideIcon, MountainIcon, ParkingCircle, PlugZap, TelescopeIcon, WifiIcon } from "lucide-react-native";
import i18next from "../../i18n";
import { ObservatoryType } from "../../types/observatory";

// `id` typé ObservatoryType (et non string) : utilisable tel quel comme valeur d'un état
// ObservatoryType, par exemple via les options d'un SelectInput.
export const observatoriesTypes: { id: ObservatoryType; label: string; icon: LucideIcon }[] = [
  {
    id: "home",
    label: i18next.t("stepTwo.observatoryType.types.home", {ns: "settings/addObservatory"}),
    icon: HomeIcon
  },
  {
    id: "private",
    label: i18next.t("stepTwo.observatoryType.types.private", {ns: "settings/addObservatory"}),
    icon: HatGlassesIcon
  },
  {
    id: "public",
    label: i18next.t("stepTwo.observatoryType.types.public", {ns: "settings/addObservatory"} ),
    icon: MountainIcon
  },
  {
    id: "observatory",
    label: i18next.t("stepTwo.observatoryType.types.observatory", {ns: "settings/addObservatory"}),
    icon: TelescopeIcon
  }
]

export const observatoriesEquipments = [
  {
    id: "electricity",
    label: i18next.t("stepTwo.equipments.types.electricity", {ns: "settings/addObservatory"}),
    icon: PlugZap
  },
  {
    id: "internet",
    label: i18next.t("stepTwo.equipments.types.internet", {ns: "settings/addObservatory"}),
    icon: WifiIcon
  },
  {
    id: "parking",
    label: i18next.t("stepTwo.equipments.types.parking", {ns: "settings/addObservatory"}),
    icon: ParkingCircle
  },
  {
    id: "shelter",
    label: i18next.t("stepTwo.equipments.types.shelter", {ns: "settings/addObservatory"}),
    icon: Bed
  },
  {
    id: "bathroom",
    label: i18next.t("stepTwo.equipments.types.bathroom", {ns: "settings/addObservatory"}),
    icon: BathIcon
  },
  {
    id: "kitchen",
    label: i18next.t("stepTwo.equipments.types.kitchen", {ns: "settings/addObservatory"}),
    icon: CookingPot
  }
]

export const observatoriesAccessTypes = [
  {
    id: "car",
    label: i18next.t("stepTwo.observatoryAccess.types.car", {ns: "settings/addObservatory"}),
    icon: CarIcon
  },
  {
    id: "foot",
    label: i18next.t("stepTwo.observatoryAccess.types.foot", {ns: "settings/addObservatory"}),
    icon: FootprintsIcon
  }
]