import { DSO } from "../../types/DSO"
import { DSOCatalog } from "../../types/DSOCatalogs"

export const getObjectType = (object: DSO) => {
  switch (object.type) {
    case "Cl+N":
      return "Amas ouvert + Nébuleuse"
    case "DRKN":
      return "Nébuleuse sombre"
    case "G":
      return "Galaxie"
    case "GCl":
      return "Amas globulaire"
    case "GGroup":
      return "Groupe de galaxies"
    case "GPair":
      return "Paire de galaxies"
    case "GTrpl":
      return "Trio de galaxies"
    case "HII":
      return "Région HII"
    case "Neb":
      return "Nébuleuse"
    case "OCl":
      return "Amas ouvert"
    case "PN":
      return "Nébuleuse planétaire"
    case "SNR":
      return "Reste de supernova"
    case "RfN":
      return "Nébuleuse en réflexion"
    case "*":
      return "Étoile"
    case "*Ass":
      return "Astérisme"
    case "**":
      return "Étoile double"
    case "Other":
      return "Autre"
    default:
      return "Autre"
  }
}