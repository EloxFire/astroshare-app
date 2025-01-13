export const getObjectFamily = (object: any): "DSO" | "Star" | "Planet" | 'Other' => {
  // Use type predicate to determine the type of object
  if (object.hasOwnProperty('ngc')) {
    return 'DSO'
  } else if (object.hasOwnProperty('isInferior')) {
    return 'Planet'
  } else if (object.hasOwnProperty('sp_type')) {
    return 'Star'
  }else {
    return 'Other'
  }
}