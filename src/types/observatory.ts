import { GpsLocation } from "./gpsLocation";

// Liste fermée d'équipements possibles — sert aussi côté UI pour générer les cases à cocher
// (une case par valeur de ObservatoryEquipment).
export type ObservatoryEquipment = "electricity" | "parking" | "shelter" | "toilet" | "wifi" | "bedding";
export type ObservatoryType = "home" | "private" | "public" | "observatory" | "other";
export type ObservatoryAccess = "car" | "foot";

export type Observatory = GpsLocation & {
  id: string; //uuid
  display_name: string;
  shared: boolean;
  tags?: string[];
  type?: ObservatoryType;
  access?: ObservatoryAccess;
  equipment?: ObservatoryEquipment[];
  notes?: string;
  image?: string; // base64 de l'image apres compression
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}