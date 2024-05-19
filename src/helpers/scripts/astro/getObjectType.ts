import { DSO } from "../../types/DSO"
import { DSOCatalog } from "../../types/DSOCatalogs"

export const getObjectType = (object: DSO) => {
  switch (object.type) {
    case "CL+N":
      return "Amas ouvert + Nébuleuse"
    case "DRKN":
      return "Nébuleuse sombre"
    case "G":
      return "Galaxie"
    case "GCL":
      return "Amas globulaire"
    case "GGROUP":
      return "Groupe de galaxies"
    case "GPAIR":
      return "Paire de galaxies"
    case "GTRPL":
      return "Trio de galaxies"
    case "HII":
      return "Région HII"
    case "NEB":
      return "Nébuleuse"
    case "OCL":
      return "Amas ouvert"
    case "PN":
      return "Nébuleuse planétaire"
    case "SNR":
      return "Reste de supernova"
    case "STAR":
      return "Étoile"
    case "STARASS":
      return "Astérisme"
    case "STARSTAR":
      return "Étoile double"
    case "OTHER":
      return "Autre"
    default:
      return "Inconnu"
  }
}