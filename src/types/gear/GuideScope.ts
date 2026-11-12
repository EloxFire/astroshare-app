export type GuideScope = {
  id: string; // uuid
  name?: string | null; // nom personnalisé facultatif, pour mieux identifier la fiche
  brand: string | null;
  model: string | null;
  type: "refractor" | "reflector" | "catadioptric" | "dobsonian" | "other";
  aperture: number; // in millimeters
  focalLength: number; // in millimeters
}