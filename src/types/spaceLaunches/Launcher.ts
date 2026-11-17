import { LaunchImage } from "./Launch";

// Forme (sous-ensemble) de la réponse LL2 relayée par /v3/launchers/:id, vérifiée contre un
// exemple réel (Starship, SpaceX) — contrairement à la première version de ce fichier, qui ne
// s'appuyait que sur la doc publique. Champs confirmés absents de ce qui avait été supposé au
// départ : `active` (et non une déduction depuis `reusable`), les statistiques d'atterrissage
// (distinctes des statistiques de lancement), `geo_capacity`/`sso_capacity` en plus de
// `leo_capacity`/`gto_capacity`. `launch_mass` est en TONNES, pas en kg (vérifié : Starship donne
// 5000, soit ~5000 t au décollage — cohérent avec la réalité, alors que 5000 kg ne le serait pas).
export type Launcher = {
  id: number;
  name: string;
  full_name: string;
  // "N/A" en pratique quand il n'y a pas de variante (ex: Starship) — à traiter comme absent,
  // voir getLauncherVariantLabel.
  variant?: string | null;
  description?: string | null;
  image?: LaunchImage;
  manufacturer?: { id: number; name: string; abbrev: string } | null;
  active?: boolean | null;
  reusable?: boolean | null;

  // Caractéristiques techniques. length/diameter en mètres, launch_mass en TONNES, les capacités
  // en kg, to_thrust en kN, apogee en km.
  length?: number | null;
  diameter?: number | null;
  launch_mass?: number | null;
  leo_capacity?: number | null;
  gto_capacity?: number | null;
  geo_capacity?: number | null;
  sso_capacity?: number | null;
  to_thrust?: number | null;
  apogee?: number | null;
  min_stage?: number | null;
  max_stage?: number | null;
  maiden_flight?: string | null; // ISO 8601

  // Statistiques de lancement.
  total_launch_count?: number | null;
  successful_launches?: number | null;
  failed_launches?: number | null;
  pending_launches?: number | null;
  consecutive_successful_launches?: number | null;

  // Statistiques d'atterrissage (distinctes des lancements : un lancement réussi peut avoir un
  // atterrissage raté, ex: Starship).
  attempted_landings?: number | null;
  successful_landings?: number | null;
  failed_landings?: number | null;
  consecutive_successful_landings?: number | null;

  info_url?: string | null;
  wiki_url?: string | null;
}
