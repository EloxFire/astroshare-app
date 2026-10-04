export type Camera = {
  id: string; // uuid
  brand: string | null;
  model: string | null;
  type: "dslr" | "mirrorless" | "ccd" | "cmos" | "other";
  sensorSize: {
    width: number; // in millimeters
    height: number; // in millimeters
  };
  pixelSize: number; // in micrometers
}