import { DSO } from "../DSO";
import { GlobalPlanet } from "../GlobalPlanet";
import { Star } from "../Star";

export type ObservationPlannerResultList = {
  dsoResults: DSO[];
  planetResults: GlobalPlanet[];
  starResults: Star[];
}