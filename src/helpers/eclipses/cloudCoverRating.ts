// Verdict "conditions d'observation" d'après le taux de nuages — port de
// astroshare-public-tools/src/helpers/cloudCoverRating.ts, adapté pour réutiliser les couleurs de
// `app_colors` plutôt que des valeurs hexadécimales propres à ce fichier, et pour renvoyer une clé
// (jamais un texte déjà rédigé, voir CLAUDE.md : jamais traduire au chargement d'un module) — c'est à
// l'écran de composer le libellé via t(`details.weather.rating.${level}`).
import { app_colors } from "../variables";

export type CloudCoverLevel = "ideal" | "possible" | "difficult";

export type CloudCoverRating = {
  level: CloudCoverLevel;
  color: string;
};

export const getCloudCoverRating = (cloudsPercent: number): CloudCoverRating => {
  if (cloudsPercent <= 20) return { level: "ideal", color: app_colors.green.main };
  if (cloudsPercent <= 60) return { level: "possible", color: app_colors.yellow.main };
  return { level: "difficult", color: app_colors.red.main };
};
