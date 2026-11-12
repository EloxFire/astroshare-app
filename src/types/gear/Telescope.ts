export type Telescope = {
  id: string; // uuid
  name?: string | null; // optional user-defined name for the telescope, e.g. "My first telescope"
  brand: string | null;
  model: string | null;
  type: "refractor" | "reflector" | "catadioptric" | "dobsonian" | "other";
  aperture: number; // in millimeters
  focalLength: number; // in millimeters
  eyepieceConnection: (1.25 | 2)[];
  notes?: string | null;
  usages: TelescopeUsage[];
}

export type TelescopeUsage = "visual" | "planetary" | "deepSky" | "photo"