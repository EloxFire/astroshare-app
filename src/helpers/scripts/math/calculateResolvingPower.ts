export const calculateResolvingPower = (diameter: number | undefined): string | undefined => {
  if(!diameter){
    return '\\text{Diamètre non renseigné}';
  }

  if (diameter) {
    return `R = \\frac{120}{D} = \\frac{120}{${diameter}} = ${(120 / diameter).toFixed(2)}\\text{secondes d\'arc}`;
  }
}