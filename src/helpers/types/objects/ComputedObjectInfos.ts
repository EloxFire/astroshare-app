import {ImageSourcePropType} from "react-native";
import {Dayjs} from "dayjs";

export type ComputedObjectInfos = {
  base:{
    family: "DSO" | "Star" | "Planet" | "Other";
    common_name: string;
    ra: string | number;
    dec: string | number;
    mag: number | string
  },
  visibilityInfos: {
    isCurrentlyVisible: boolean;
    isVisibleThisNight: boolean;
    visibilityLabel: string;
    visibilityBackgroundColor: string;
    visibilityForegroundColor: string;
    visibilityIcon: ImageSourcePropType;
    objectNextRise: Dayjs;
    objectNextSet: Dayjs;
    nakedEye: {
      label: string;
      icon: ImageSourcePropType;
      backgroundColor: string;
      foregroundColor: string;
    },
    binoculars: {
      label: string;
      icon: ImageSourcePropType;
      backgroundColor: string;
      foregroundColor: string;
    },
    telescope: {
      label: string;
      icon: ImageSourcePropType;
      backgroundColor: string;
      foregroundColor: string;
    },
    visibilityGraph: {
      altitudes: number[];
      hours: string[];
    };
  }
  error: string;
}