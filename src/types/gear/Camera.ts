export type Camera = {
  id: string; // uuid
  name?: string | null; // nom personnalisé facultatif, pour mieux identifier la fiche
  brand: string | null;
  model: string | null;
  type: "dslr" | "mirrorless" | "ccd" | "cmos" | "other";
  sensorSize: {
    width: number; // in millimeters
    height: number; // in millimeters
  };
  pixelSize: number; // in micrometers
  resolution?: {
    width: number; // in pixels
    height: number; // in pixels
  }
}