import { LaunchImage, LaunchServiceProvider } from "./Launch";

export type PadLocation = {
  name: string;
  country?: string | null;
  description?: string | null;
  total_launch_count?: number | null;
}

// Forme (sous-ensemble) de la réponse LL2 relayée par /v3/pads/:id — fiche complète, plus riche
// que le résumé embarqué dans un lancement (pad.name/pad.location).
export type Pad = {
  id: number;
  name: string;
  active?: boolean | null;
  agencies?: LaunchServiceProvider[];
  image?: LaunchImage;
  map_image?: LaunchImage;
  founding_year?: string | null;
  launchers?: string | null;
  spacecraft?: string | null;
  total_launch_count?: number | null;
  successful_launches?: number | null;
  failed_launches?: number | null;
  pending_launches?: number | null;
  consecutive_successful_launches?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  location?: PadLocation | null;
  info_url?: string | null;
  wiki_url?: string | null;
}
