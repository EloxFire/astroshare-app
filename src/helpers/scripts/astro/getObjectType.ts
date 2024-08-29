import { DSO } from "../../types/DSO"
import { DSOCatalog } from "../../types/DSOCatalogs"
import { i18n } from "../i18n"

export const getObjectType = (object: DSO) => {
  switch (object.type) {
    case "Cl+N":
      return i18n.t('objectTypes.cln')
    case "DRKN":
      return i18n.t('objectTypes.drkn')
    case "G":
      return i18n.t('objectTypes.g')
    case "GCl":
      return i18n.t('objectTypes.gcl')
    case "GGroup":
      return i18n.t('objectTypes.ggroup')
    case "GPair":
      return i18n.t('objectTypes.gpair')
    case "GTrpl":
      return i18n.t('objectTypes.gtrpl')
    case "HII":
      return i18n.t('objectTypes.hii')
    case "Neb":
      return i18n.t('objectTypes.neb')
    case "OCl":
      return i18n.t('objectTypes.ocl')
    case "PN":
      return i18n.t('objectTypes.pn')
    case "SNR":
      return i18n.t('objectTypes.snr')
    case "RfN":
      return i18n.t('objectTypes.rfn')
    case "*":
      return i18n.t('objectTypes.star')
    case "*Ass":
      return i18n.t('objectTypes.starass')
    case "**":
      return i18n.t('objectTypes.dblstar')
    case "Other":
      return i18n.t('common.errors.other')
    default:
      return i18n.t('common.errors.unknown')
  }
}