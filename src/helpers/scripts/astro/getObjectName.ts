import { DSO } from "../../types/DSO"
import { DSOCatalog } from "../../types/DSOCatalogs"

export const getObjectName = (object: DSO, currentCatalog: DSOCatalog, full?: boolean) => {
  if (object.m !== "") {
    if (full) return `Messier ${object.m}`
    if (currentCatalog === 'ngc') return object.name
    if (currentCatalog === 'ic') return object.name
    return `M${object.m}`
  } else if (object.ngc !== "") {
    return `NGC${object.ngc}`
  } else if (object.ic !== "") {
    // if (currentCatalog === 'ic') return object.name
    return `IC${object.ic}`
  } else if (object.name !== "") {
    return object.name
  } else {
    return 'Objet non identifié'
  }
}