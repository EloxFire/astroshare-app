export type KpTrend = "rising" | "falling" | "stable";

export type KpLevel =
  | "quiet"
  | "unsettled"
  | "active"
  | "minor_storm"
  | "moderate_storm"
  | "strong_storm"
  | "severe_storm"
  | "extreme_storm";

export type KpPoint = {
  time_tag: string;
  kp: number;
  level: KpLevel;
  label: string; // déjà en FR, prêt à afficher
  scale: string | null; // "G1".."G5", ou null si pas de tempête géomagnétique
}

// current a tout ce qu'a un KpPoint, plus la tendance (absente de history/forecast).
export type KpCurrent = KpPoint & {
  trend: KpTrend;
}

export type KpData = {
  current: KpCurrent;
  history: KpPoint[]; // points observés aujourd'hui
  forecast: KpPoint[]; // points prévus par NOAA
}
