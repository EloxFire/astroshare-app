import { useMemo } from "react";
import { getLunarAngularDiameter } from "@observerly/astrometry";
import { getNextFullMoon } from "../helpers/astrometry/moon/moonHelpers";

// Date et diamètre apparent de la prochaine pleine lune réelle (varie ±quelques % avec la distance
// Terre-Lune) : repère commun aux visualisations "Lune à l'échelle" (champ réel de l'oculaire,
// champ de la caméra), pour ne pas dupliquer ce calcul dans chacune.
export const useFullMoonAngularDiameter = (): { fullMoonDate: Date; angularDiameter: number } => {
  const fullMoonDate = useMemo(() => getNextFullMoon(new Date()), []);
  const angularDiameter = useMemo(() => getLunarAngularDiameter(fullMoonDate), [fullMoonDate]);
  return { fullMoonDate, angularDiameter };
};
