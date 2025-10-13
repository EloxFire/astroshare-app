import { parse } from "@babel/core";

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
    const apparentFov = parseFloat((fovEyepiece / (focal / eyepieceFocalLength)).toFixed(2));
    return `FoV = \\frac{C}{G} = \\frac{${fovEyepiece}}{\\frac{${focal}}{${eyepieceFocalLength}}} = ${apparentFov}'`;
  }
}