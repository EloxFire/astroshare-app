export type Focuser = {
  id: string; // uuid
  name?: string | null; // nom personnalisé facultatif, pour mieux identifier la fiche
  brand: string | null;
  model: string | null;
  type: "manual" | "motorized" | "other";
  travel: number; // in millimeters
}