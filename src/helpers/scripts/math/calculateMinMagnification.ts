export const calculateMinMagnification = (diameter: number | undefined): string | undefined => {
  if(!diameter){
    return '\\text{Diamètre non renseigné}';
  }

  if (diameter) {
    return `G_{min} = \\frac{D}{7} = \\frac{${diameter}}{7} = ${(diameter / 7).toFixed(2)}\\text{x}`;
  }
}