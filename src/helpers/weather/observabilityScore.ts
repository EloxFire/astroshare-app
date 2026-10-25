import type { WeatherData } from "../../types/weather/Weather";
import type { AstroConditionsData, AstroConditionPoint } from "../../types/weather/AstroConditions";

// Score indicatif de qualité des conditions d'observation (0-100), pas une mesure scientifique —
// pensé pour donner un repère simple à un débutant, pas pour du suivi de précision.
//
// Chaque facteur est normalisé en sous-score 0-100 (100 = idéal) puis combiné en moyenne pondérée.
// Les poids reflètent ce qui domine l'EXPÉRIENCE d'observation en pratique :
// - Couverture nuageuse (40%) : le facteur qui prime sur tout le reste — un ciel couvert annule
//   l'intérêt des autres facteurs, d'où le poids dominant. Toujours depuis OpenWeather
//   (weather.current.clouds), jamais astro.cloudcover — ce dernier est bien moins précis.
// - Seeing + transparence (25%) : spécifique à 7Timer/astro, sans équivalent dans /weather — ce
//   sont les deux métriques dédiées à l'observation (turbulence atmosphérique et clarté du ciel),
//   bien plus pertinentes que la seule couverture nuageuse pour juger du piqué/de la magnitude
//   limite. Repli sur 0 (poids redistribué aux autres facteurs) si /astro a échoué.
// - Lune (15%) : présence ET phase — une pleine lune bien haute écrase les objets faibles, mais
//   sous l'horizon elle n'a aucun effet quelle que soit sa phase.
// - Vent (10%) : fait vibrer l'instrument (surtout gênant en haute résolution/planétaire) et
//   trahit un air généralement plus turbulent.
// - Humidité (10%) : risque de buée sur l'optique (un vrai problème pratique, pas que du confort)
//   et corrélée à une transparence réduite.
//
// Si /astro est indisponible (échoue indépendamment de /weather, cf. doc API), le poids du seeing/
// transparence est redistribué proportionnellement aux autres facteurs plutôt que de pénaliser le
// score pour une donnée qu'on n'a simplement pas pu récupérer.
//
// Une précipitation en cours (pluie/neige, détectée côté weather OU astro) plafonne le score à 15 :
// aucune pondération ne doit pouvoir masquer une condition qui rend l'observation tout simplement
// impossible.

const WEIGHTS = {
  clouds: 0.40,
  seeingTransparency: 0.25,
  moon: 0.15,
  wind: 0.10,
  humidity: 0.10,
};

const PRECIPITATION_SCORE_CAP = 15;
// Couverture quasi totale (≥90%, OpenWeather) : un ciel couvert rend l'observation impossible point
// final, quels que soient le seeing/la transparence (sans trouée dans les nuages, ces deux métriques
// ne veulent rien dire) — même logique de plafond dur que pour la pluie, un peu plus permissive (de
// fines trouées restent parfois possibles).
const OVERCAST_SCORE_CAP = 20;
const OVERCAST_OPENWEATHER_CLOUDS_THRESHOLD = 90;
const WIND_SPEED_FOR_ZERO_SCORE = 10; // m/s (~36 km/h) — au-delà, score vent nul

export interface ObservabilityScore {
  total: number; // 0-100
  factors: {
    clouds: number;
    seeingTransparency: number | null; // null si /astro indisponible (poids redistribué)
    moon: number;
    wind: number;
    humidity: number;
  };
  cappedByPrecipitation: boolean;
  cappedByOvercast: boolean;
}

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

// Point /astro le plus proche de `now` — même principe de recherche du point le plus proche déjà
// utilisé ailleurs dans l'app pour les séries temporelles de météo spatiale. Exportée : l'UI du
// score (ex: pour afficher seeing/transparence) a besoin du même point que celui utilisé en interne
// par le calcul, plutôt que de le retrouver une seconde fois avec sa propre logique.
export const findClosestAstroPoint = (data: AstroConditionPoint[], now: Date): AstroConditionPoint | undefined => {
  if (data.length === 0) return undefined;
  return data.reduce((closest, point) => {
    const closestDiff = Math.abs(new Date(closest.time_tag).getTime() - now.getTime());
    const pointDiff = Math.abs(new Date(point.time_tag).getTime() - now.getTime());
    return pointDiff < closestDiff ? point : closest;
  });
};

// true si la lune est au-dessus de l'horizon à `now`, en gérant le cas où le coucher tombe avant le
// lever dans les données du jour (la lune était déjà levée depuis la veille). Exportée : l'UI du
// score (carte d'observabilité) en a besoin pour afficher l'état de la lune sans dupliquer cette
// logique — mêmes moonrise/moonset/now que ceux utilisés ici par computeMoonScore.
export const isMoonUp = (moonrise: number, moonset: number, nowSeconds: number): boolean => {
  if (moonrise <= moonset) return nowSeconds >= moonrise && nowSeconds < moonset;
  return nowSeconds >= moonrise || nowSeconds < moonset;
};

// Exportée (même raison que findClosestAstroPoint/isMoonUp ci-dessus) : la carte d'observabilité
// affiche ce facteur (teinte de la ligne "lune") sans le dupliquer, à partir du même calcul que
// celui utilisé en interne pour le score global.
export const computeMoonScore = (weather: WeatherData, now: Date): number => {
  const today = weather.daily[0];
  if (!today) return 100; // pas de donnée lunaire : on ne pénalise pas pour une donnée absente

  const nowSeconds = Math.floor(now.getTime() / 1000);
  if (!isMoonUp(today.moonrise, today.moonset, nowSeconds)) return 100; // lune sous l'horizon : aucun effet

  // Distance à la pleine lune (phase 0.5) : 0 = pleine lune (pire), 0.5 = nouvelle lune (idéal).
  const distanceFromFullMoon = Math.abs(today.moon_phase - 0.5);
  return clamp(distanceFromFullMoon * 200, 0, 100);
};

const computeCloudScore = (weather: WeatherData): number =>
  clamp(100 - weather.current.clouds, 0, 100);

const computeSeeingTransparencyScore = (astroPoint: AstroConditionPoint | undefined): number | null => {
  if (!astroPoint) return null;
  const averageCode = (astroPoint.seeing.code + astroPoint.transparency.code) / 2;
  return clamp(((8 - averageCode) / 7) * 100, 0, 100);
};

const computeWindScore = (weather: WeatherData): number =>
  clamp(100 - (weather.current.wind_speed / WIND_SPEED_FOR_ZERO_SCORE) * 100, 0, 100);

const computeHumidityScore = (weather: WeatherData): number =>
  clamp(100 - weather.current.humidity, 0, 100);

const hasPrecipitation = (weather: WeatherData, astroPoint: AstroConditionPoint | undefined): boolean =>
  !!weather.current.rain || !!weather.current.snow || (astroPoint !== undefined && astroPoint.precipitation.type !== "none");

const isOvercast = (weather: WeatherData): boolean =>
  weather.current.clouds >= OVERCAST_OPENWEATHER_CLOUDS_THRESHOLD;

export const computeObservabilityScore = (
  weather: WeatherData | null,
  astro: AstroConditionsData | null,
  now: Date = new Date()
): ObservabilityScore | null => {
  if (!weather) return null;

  const astroPoint = astro ? findClosestAstroPoint(astro.data, now) : undefined;

  const factors = {
    clouds: computeCloudScore(weather),
    seeingTransparency: computeSeeingTransparencyScore(astroPoint),
    moon: computeMoonScore(weather, now),
    wind: computeWindScore(weather),
    humidity: computeHumidityScore(weather),
  };

  // Redistribue le poids du seeing/transparence si absent, plutôt que de le compter comme 0 (ce qui
  // pénaliserait le score pour une donnée qu'on n'a simplement pas pu récupérer — /astro peut échouer
  // indépendamment de /weather).
  const availableWeights = factors.seeingTransparency === null
    ? { ...WEIGHTS, seeingTransparency: 0 }
    : WEIGHTS;
  const weightSum = Object.values(availableWeights).reduce((sum, weight) => sum + weight, 0);

  const weightedTotal =
    factors.clouds * availableWeights.clouds +
    (factors.seeingTransparency ?? 0) * availableWeights.seeingTransparency +
    factors.moon * availableWeights.moon +
    factors.wind * availableWeights.wind +
    factors.humidity * availableWeights.humidity;

  const cappedByPrecipitation = hasPrecipitation(weather, astroPoint);
  const cappedByOvercast = isOvercast(weather);
  const hardCap = Math.min(
    cappedByPrecipitation ? PRECIPITATION_SCORE_CAP : 100,
    cappedByOvercast ? OVERCAST_SCORE_CAP : 100
  );
  const total = Math.min(Math.round(weightedTotal / weightSum), hardCap);

  return { total: clamp(total, 0, 100), factors, cappedByPrecipitation, cappedByOvercast };
};
