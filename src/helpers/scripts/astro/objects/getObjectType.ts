import { DSO } from "../../../types/DSO"
import { DSOCatalog } from "../../../types/DSOCatalogs"
import { i18n } from "../../i18n"
import {Star} from "../../../types/Star";
import {GlobalPlanet} from "../../../types/GlobalPlanet";
import {getObjectFamily} from "./getObjectFamily";

export const getObjectType = (object: DSO | Star | GlobalPlanet) => {
  const objectFamily = getObjectFamily(object)

  switch (objectFamily) {
    case "Star":
      return i18n.t('common.objects.types.star')
    case "Planet":
      return i18n.t('common.objects.types.planet')
    case "DSO":
      const dso = object as DSO
      if (dso.type === "Cl+N") {
        return i18n.t('objectTypes.cln')
      } else if (dso.type === "DRKN") {
        return i18n.t('objectTypes.drkn')
      } else if (dso.type === "G") {
        return i18n.t('objectTypes.g')
      } else if (dso.type === "GCl") {
        return i18n.t('objectTypes.gcl')
      } else if (dso.type === "GGroup") {
        return i18n.t('objectTypes.ggroup')
      } else if (dso.type === "GPair") {
        return i18n.t('objectTypes.gpair')
      } else if (dso.type === "GTrpl") {
        return i18n.t('objectTypes.gtrpl')
      } else if (dso.type === "HII") {
        return i18n.t('objectTypes.hii')
      } else if (dso.type === "Neb") {
        return i18n.t('objectTypes.neb')
      } else if (dso.type === "OCl") {
        return i18n.t('objectTypes.ocl')
      } else if (dso.type === "PN") {
        return i18n.t('objectTypes.pn')
      } else if (dso.type === "SNR") {
        return i18n.t('objectTypes.snr')
      } else if (dso.type === "RfN") {
        return i18n.t('objectTypes.rfn')
      } else if (dso.type === "*") {
        return i18n.t('objectTypes.star')
      } else if (dso.type === "*Ass") {
        return i18n.t('objectTypes.starass')
      } else if (dso.type === "**") {
        return i18n.t('objectTypes.dblstar')
      } else if (dso.type === "Other") {
        return i18n.t('common.errors.other')
      }
    default:
      return i18n.t('common.errors.unknown')
  }
}