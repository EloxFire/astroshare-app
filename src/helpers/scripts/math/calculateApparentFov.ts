export const calculateApparentFov = (focal: number | undefined, eyepieceFocalLength: number | undefined, fovEyepiece: number | undefined): string | undefined => {
  if(!focal){
    return '\\text{Focale non renseignée}';
  }

  if(!eyepieceFocalLength){
    return '\\text{Focale de l’oculaire non renseigné}';
  }

  if (!fovEyepiece) {
    return '\\text{Champ de l’oculaire non renseigné}';
  }

  if (focal && eyepieceFocalLength) {
    return `FoV = \\frac{C}{G} = \\frac{${fovEyepiece}}{\\frac{${focal}}{${eyepieceFocalLength}}} = ${fovEyepiece / (focal / eyepieceFocalLength)}'`;
  }
}