// Forme de la réponse de /v3/norad (catalogue CelesTrak relayé par l'API Astroshare). Tous les
// champs sont nullable sauf les 6 listés en premier — voir la doc de la route.
export type NoradSatellite = {
  norad_id: number;
  norad_id_str: string;
  object_name: string;
  // `label` est un identifiant stable en anglais à traduire côté front, pas du texte affichable —
  // voir getSatelliteObjectTypeLabel / getSatelliteOpsStatusLabel.
  object_type: { code: string; label: string };
  ops_status: { code: string; label: string };
  imported_at: string; // ISO 8601

  object_id: string | null; // désignateur COSPAR, ex: "1998-067A"
  owner: string | null;
  launch_date: string | null; // ISO 8601 (date seule)
  launch_site: string | null; // code catalogue brut (ex: "TTMTR"), pas de table de correspondance fournie
  decay_date: string | null; // ISO 8601, non nul si désorbité
  period: number | null; // minutes
  inclination: number | null; // degrés
  apogee: number | null; // km
  perigee: number | null; // km
  rcs: number | null; // m², taille radar équivalente
  orbit_type: string | null;
}
