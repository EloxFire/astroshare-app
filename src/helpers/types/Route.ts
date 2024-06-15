import { EFeatureRequirements } from "./FeatureRequirements";

export type Route = {
  path: string;
  requirements: EFeatureRequirements[];
}