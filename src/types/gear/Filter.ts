export type Filter = {
  id: string; // uuid
  brand: string | null;
  model: string | null;
  type: "uv" | "ir" | "polarizing" | "nebula" | "color" | "other";
  size: "1.25\"" | "2\""; // in inches
  wavelengthRange: {
    min: number; // in nanometers
    max: number; // in nanometers
  };
}