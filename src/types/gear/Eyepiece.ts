export type Eyepiece = {
  id: string; // uuid
  name?: string | null; // nom personnalisé facultatif, pour mieux identifier la fiche
  brand: string | null;
  model: string | null;
  type: "plossl" | "super-wide-angle" | "ultra-wide-angle" | "extreme-wide-angle" | "zoom" | "reticle" | "other";
  focalLength: number; // in millimeters
  afov: number; // in degrees
  barrelSize: 1.25 | 2; // in inches
}