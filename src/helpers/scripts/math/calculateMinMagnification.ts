export const calculateMinMagnification = (diameter: number | undefined, exitPupil: number = 7): string | undefined => {
  if(!diameter){
    return '\\text{Diamètre non renseigné}';
  }

  const formattedPupil = Number.isInteger(exitPupil) ? exitPupil.toString() : exitPupil.toFixed(2).replace(/\.?0+$/, '');
  const minMagnification = diameter / exitPupil;

  return `G_{min} = \\frac{D}{${formattedPupil}} = \\frac{${diameter}}{${formattedPupil}} = ${minMagnification.toFixed(2)}\\text{x}`;
}
