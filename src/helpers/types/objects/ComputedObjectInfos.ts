import {ImageSourcePropType} from "react-native";
import {Dayjs} from "dayjs";

export type ComputedObjectInfos = {
  base:{
    family: "DSO" | "Star" | "Planet" | "Other";
    common_name: string;
    ra: string | number;
    dec: string | number;
    mag: number | string;
    alt: string;
    az: string;
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
  },
  dsoAdditionalInfos?: {
    image: ImageSourcePropType | {uri: string};
    distance: string;
    dimensions: string;
    discovered_by: string;
    discovery_year: string;
    apparent_size: string;
    age: number | string
  },
  planetAdditionalInfos?: {
    symbol: string;
    solarSystemPosition: string;
    inclination: string;
    mass: string;
    orbitalPeriod: string;
    distanceToSun: string;
    diameter: string;
    surfaceTemperature: string;
    naturalSatellites: string;
  }
  error: string;
}