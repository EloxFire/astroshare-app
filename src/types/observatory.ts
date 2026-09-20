import { GpsLocation } from "./gpsLocation";

// Liste fermée d'équipements possibles — sert aussi côté UI pour générer les cases à cocher
// (une case par valeur de ObservatoryEquipment).
export type ObservatoryEquipment = "electricity" | "parking" | "shelter" | "toilet" | "wifi" | "bedding";

export type Observatory = GpsLocation & {
  id: string; //uuid
  display_name: string;
  shared: boolean;
  tag?: string;
  type?: "home" | "private" | "public" | "observatory" | "other";
  access?: "car" | "foot";
  equipment?: ObservatoryEquipment[];
  notes?: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}