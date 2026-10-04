export type Telescope = {
  id: string; // uuid
  brand: string | null;
  model: string | null;
  type: "refractor" | "reflector" | "catadioptric" | "dobsonian" | "other";
  aperture: number; // in millimeters
  focalLength: number; // in millimeters
  eyepieceConnection: ("1.25\"" | "2\"")[];
}