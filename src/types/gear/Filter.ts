export type Filter = {
  id: string; // uuid
  name?: string | null; // nom personnalisé facultatif, pour mieux identifier la fiche
  brand: string | null;
  model: string | null;
  type: "uv" | "ir" | "polarizing" | "nebula" | "color" | "other";
  size: "1.25\"" | "2\""; // in inches
  wavelengthRange: {
    min: number; // in nanometers
    max: number; // in nanometers
  };
}