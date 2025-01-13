import {ImageSourcePropType} from "react-native";
import {Dayjs} from "dayjs";

export type ComputedObjectInfos = {
  visibilityInfos: {
    isCurrentlyVisible: boolean;
    isVisibleThisNight: boolean;
    visibilityLabel: string;
    visibilityBackgroundColor: string;
    visibilityForegroundColor: string;
    visibilityIcon: ImageSourcePropType;
    objectNextRise: Dayjs;
    objectNextSet: Dayjs;
  }
  error: string;
}