import { ImageSourcePropType } from "react-native";

export type ThreeDModel = {
  id: string;
  category: string;
  illustration?: ImageSourcePropType;
}

export type ThreeDModelCategory = {
  id: string;
  color: string;
}