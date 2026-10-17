// Convertit une position polaire (rayon + angle) en coordonnées cartésiennes — convention
// commune aux réticules nord/sud : 0° = haut du cadran, angle croissant dans le sens horaire
// (c'est pourquoi on soustrait 90° : le repère trigonométrique standard place 0° à droite).
export const polarToCartesian = (centerX: number, centerY: number, radius: number, angleDegrees: number) => {
  const angleRadians = (angleDegrees - 90) * (Math.PI / 180);
  return {
    x: centerX + radius * Math.cos(angleRadians),
    y: centerY + radius * Math.sin(angleRadians),
  };
};
