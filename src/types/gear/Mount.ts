export type Mount = {
  id: string; // uuid
  name?: string | null; // nom personnalisé facultatif, pour mieux identifier la fiche
  brand: string | null;
  model: string | null;
  // "altAzEquatorial" : monture convertible, utilisable en azimutal ou en équatorial selon le
  // montage (ex: SkyWatcher AZ-EQ, iOptron CEM) — distincte des deux montures mono-mode.
  type: "altazimuth" | "equatorial" | "altAzEquatorial" | "dobsonian" | "other";
  motorized: boolean;
  maxPayload?: number | null; // charge utile maximale, en kilogrammes
}