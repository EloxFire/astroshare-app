import {DSO} from "../../../types/DSO";
import {astroImages} from "../../loadImages";
import {Star} from "../../../types/Star";
import {GlobalPlanet} from "../../../types/GlobalPlanet";
import {getObjectFamily} from "./getObjectFamily";

export const getObjectIcon = (object: DSO | Star | GlobalPlanet) => {
  const objectFamily = getObjectFamily(object)

  switch (objectFamily) {
    case "Star":
      return astroImages['BRIGHTSTAR']
    case "Planet":
      const planet = object as GlobalPlanet
      return astroImages[planet.name.toUpperCase()]
    case "DSO":
      const dso = object as DSO
      return astroImages[dso.type.toUpperCase()]
    default:
      return astroImages['OTHER']
  }
}
