import {showToast} from "../showToast";

export const calculateMagnification = (focal: number | undefined, eyepiece: number | undefined): string | undefined => {
  if(!focal && !eyepiece){
    return '\\text{Focale télescope et oculaire non renseignées}';
  }

  if(!focal){
    return '\\text{Focale télescope non renseignée}';
  }

  if(!eyepiece){
    return '\\text{Focale oculaire non renseignée}';
  }

  if (focal && eyepiece) {
    const magnification = focal / eyepiece;
    const formatted = magnification.toFixed(2).replace(/\.?0+$/, '');
    return `M = \\frac{F}{E} = \\frac{${focal}}{${eyepiece}} = ${formatted}\\text{x}`;
  }
}