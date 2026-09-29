// Stops d'un dégradé d'opacité adouci, pour les <LinearGradient> de react-native-svg.
// Courbe smoothstep (pente nulle aux deux extrémités) plutôt que linéaire : un dégradé linéaire
// laisse une ligne visible là où il commence et là où il se termine. `from`/`to` sont des offsets
// (0–1) le long du dégradé ; avant le premier stop et après le dernier, SVG prolonge leur valeur.
// Plus il y a de `steps`, plus la courbe est fidèle (les stops sont reliés linéairement entre eux).
export const easedGradientStops = (from: number, to: number, startOpacity: number, endOpacity: number, steps = 10) =>
  Array.from({ length: steps + 1 }, (_, step) => {
    const progress = step / steps;
    const eased = progress * progress * (3 - 2 * progress);
    return {
      offset: from + progress * (to - from),
      opacity: startOpacity + eased * (endOpacity - startOpacity),
    };
  });
