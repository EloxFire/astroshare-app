export type Focuser = {
  id: string; // uuid
  brand: string | null;
  model: string | null;
  type: "manual" | "motorized" | "other";
  travel: number; // in millimeters
}