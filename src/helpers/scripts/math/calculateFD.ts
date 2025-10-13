export const calculateFD = (focal: number | undefined, diameter: number | undefined): string | undefined => {
  if(diameter === 0 ){
    return '\\text{Le diamètre ne peut pas être égal à 0}';
  }

  if(!focal && !diameter){
    return '\\text{Focale et diamètre non renseignés}';
  }

  if(!focal){
    return '\\text{Focale non renseignée}';
  }

  if(!diameter){
    return '\\text{Diamètre non renseigné}';
  }

  if (focal && diameter) {
    const ratio = parseFloat((focal / diameter).toFixed(2));
    return `f/D = \\frac{F}{D} = \\frac{${focal}}{${diameter}} = ${ratio}`;
  }
}