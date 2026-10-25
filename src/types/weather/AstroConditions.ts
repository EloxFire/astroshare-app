// Forme de la réponse 7Timer ASTRO, relayée par /v3/weather/astro. Contrairement à /v3/weather,
// cette réponse n'est PAS enveloppée dans { data: ... } — modelRun et data sont au premier niveau.
// seeing/transparency/instability sont des estimations dérivées d'un modèle météo global (GFS), pas
// des mesures — à traiter comme indicatif, jamais comme une donnée engageante.

export type CloudCoverCondition = {
  code: number; // 1-9, plus bas = plus dégagé
  range: string; // ex: "69-81%"
  label: string;
}

export type SeeingCondition = {
  code: number; // 1-8, plus bas = meilleur
  range: string; // ex: "1-1.25\""
  label: string;
}

export type TransparencyCondition = {
  code: number; // 1-8, plus bas = meilleur
  range: string; // ex: "0.4-0.5"
  label: string;
}

export type InstabilityCondition = {
  value: number; // lifted index
  label: string;
}

export type WindCondition = {
  code: number; // 1-8, plus bas = plus calme
  direction: string; // "N", "NE", "E"...
  label: string;
}

export type PrecipitationType = "none" | "rain" | "snow";

export type PrecipitationCondition = {
  type: PrecipitationType;
  label: string;
}

export type AstroConditionPoint = {
  time_tag: string;
  cloudcover: CloudCoverCondition;
  seeing: SeeingCondition;
  transparency: TransparencyCondition;
  instability: InstabilityCondition;
  temperature: number; // °C
  humidity: number; // %
  wind: WindCondition;
  precipitation: PrecipitationCondition;
}

export type AstroConditionsData = {
  modelRun: string; // heure UTC d'initialisation du modèle GFS sous-jacent
  data: AstroConditionPoint[]; // ~24 points par pas de 3h, 3 jours max
}
