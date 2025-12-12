import {ImageSourcePropType} from "react-native";
import {Dayjs} from "dayjs";

export type ComputedSunInfos = {
  base: {
    family: 'Sun';
    name: string;
    ra: number;
    dec: number;
    alt: number;
    az: number;
    angularDiameter: number;
    distance: number;
    constellation: string;
    icon: ImageSourcePropType;
  },
  visibility: {
    isCurrentlyVisible: boolean;
    isVisibleToday: boolean;
    visibilityLabel: string;
    visibilityBackgroundColor: string;
    visibilityForegroundColor: string;
    visibilityIcon: ImageSourcePropType;
    sunrise: Dayjs | null;
    sunset: Dayjs | null;
    visibilityGraph: {
      altitudes: number[];
      hours: string[];
    };
  }
}
