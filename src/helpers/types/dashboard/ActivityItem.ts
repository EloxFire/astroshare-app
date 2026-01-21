import { ImageSourcePropType } from "react-native";

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  icon: ImageSourcePropType
  timestamp?: string;
};