export type Eyepiece = {
  id: string; // uuid
  brand: string | null;
  model: string | null;
  type: "plossl" | "super-wide-angle" | "ultra-wide-angle" | "extreme-wide-angle" | "zoom" | "reticle" | "other";
  focalLength: number; // in millimeters
  afov: number; // in degrees
}