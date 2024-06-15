import { useSettings } from "../../contexts/AppSettingsContext";
import { EFeatureRequirements } from "../types/FeatureRequirements";
import { Route } from "../types/Route";

export const checkFeatureRequirements = (requirements: EFeatureRequirements[], route: Route): {meetRequirements: boolean, missingRequirements: EFeatureRequirements[]} => {
  if (route.requirements.length === 0) return { meetRequirements: true, missingRequirements: [] };

  const {currentUserLocation} = useSettings();

  return {meetRequirements: false, missingRequirements: [EFeatureRequirements.LOCATION]}
}