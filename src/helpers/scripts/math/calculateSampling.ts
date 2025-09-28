export const calculateSampling = (focal: number | undefined, pixel: number | string | undefined) => {
  if(!focal && !pixel){
    return '\\text{Focale et pixel non renseignés}';
  }

  if(!focal){
    return '\\text{Focale non renseignée}';
  }

  if(!pixel){
    return '\\text{Taille de pixel non renseignée}';
  }

  if (focal && pixel) {
    const formattedPixel = typeof pixel === 'string' ? parseFloat(pixel) : pixel;
    return `\\text{E} = 206\\times\\frac{P}{F} = 206\\times\\frac{${formattedPixel}}{${focal}} = ${(206*(formattedPixel / focal)).toFixed(2)}\\text{'d'arc/px}`;
  }
}