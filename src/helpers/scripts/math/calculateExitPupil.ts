export const calculateExitPupil = (diameter: number | undefined, focalLength: number | undefined, eyepieceFocalLength: number | undefined): string | undefined => {
  if(!focalLength || !eyepieceFocalLength || !diameter){
    return '\\text{Focale ou focale oculaire ou diamètre non renseigné}';
  }

  const magnification = focalLength / eyepieceFocalLength;
  return `P = \\frac{D}{G} = \\frac{D}{f_{oculaire}}{f_{telescope}} = \\frac{${diameter} \\times ${eyepieceFocalLength}}{${focalLength}} = ${(diameter * eyepieceFocalLength / focalLength).toFixed(2)}\\text{mm}`;
}