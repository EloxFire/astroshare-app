import i18next from "../../i18n";

export const getBortleMpsas = (bortle: number): number => {
  return parseFloat(i18next.t(`lightPollution.sqm.numeric.${bortle}`));
};

// Magnitude à l'œil nu limite (NELM), borne haute de la plage usuellement citée pour chaque classe
// de l'échelle de Bortle (échelle originale de J. Bortle, Sky & Telescope, 2001) — ce n'est pas une
// donnée renvoyée par /v3/lightpollution, qui ne donne que mpsas/bortle. Valeur de référence fixe,
// pas calculée à partir du mpsas réel (pas de formule mpsas→NELM fiable implémentée ici).
export const getLightPollutionLimitingMagnitude = (bortle: number): string =>
  i18next.t(`lightPollution.limitingMagnitude.${bortle}`, { ns: "common" });

// Convention simple (pas de donnée API) : à partir de la classe 6, les descriptions existantes
// (common.json, lightPollution.indicatorDescriptions) ne mentionnent plus la Voie lactée que comme
// invisible ; en dessous, elle reste au moins partiellement visible (classe 5 : "à peine visible").
export const isMilkyWayVisible = (bortle: number): boolean => bortle <= 5;