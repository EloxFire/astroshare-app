import { Observatory } from "./observatory";

export type UserSettingsData = {
  nightMode: false | true;
  locale: string;
  pinnedTools: [string?, string?, string?, string?, string?]; // Max 5 outils épinglés
  observatories: Observatory[];
  activeObservatoryId: string | null; //uuid d'un observatoire - null = position gps actuelle
}