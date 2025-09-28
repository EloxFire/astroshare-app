import { DSO } from "../../../types/DSO"
import { DSOCatalog } from "../../../types/DSOCatalogs"
import {GlobalPlanet} from "../../../types/GlobalPlanet";
import {Star} from "../../../types/Star";
import {getObjectFamily} from "./getObjectFamily";
import {getBrightStarName} from "./getBrightStarName";
import {i18n} from "../../i18n";

export const getObjectName = (object: DSO | Star | GlobalPlanet, currentCatalog: DSOCatalog, full?: boolean): string => {
  const objectFamily = getObjectFamily(object)

  switch (objectFamily) {
    case "Star":
      const star = object as Star;
      return getBrightStarName(star.ids)
    case "Planet":
      const planet = object as GlobalPlanet
      return i18n.t('common.planets.' + planet.name)
    case "DSO":
      const dso = object as DSO
      if (dso.m !== "") {
        if (full) return `Messier ${dso.m}`
        if (currentCatalog === 'ngc') return dso.name
        if (currentCatalog === 'ic') return dso.name
        return `M${dso.m}`
      } else if (dso.ngc !== "") {
        return `NGC${dso.ngc}`
      } else if (dso.ic !== "") {
        return `IC${dso.ic}`
      } else if (dso.name !== "") {
        return dso.name
      } else {
        return i18n.t('common.errors.unknown')
      }
    default:
      return i18n.t('common.errors.unknown')
  }



}