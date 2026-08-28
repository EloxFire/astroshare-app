import { Observatory } from "./observatory";

export type UserSettingsState = {
  nightMode: false | true;
  locale: string;
  pinnedTools: [string?, string?, string?, string?, string?]; // Max 5 outils épinglés
  observatories: Observatory[];
  activeObservatoryId: string | null; //uuid d'un observatoire - null = position gps actuelle
}

export type UserSettingsActions = {
  setNightMode: (newNightModeValue: boolean) => void;
  setLocale: (newLocale: string) => void;
  addObservatory: (newObservatory: Observatory) => void;
  removeObservatory: (observatoryIdToRemove: string) => void;
  setActiveObservatoryId: (newActiveObservatoryId: string | null) => void;
  setPinnedTools: (newPinnedTools: [string?, string?, string?, string?, string?]) => void;
}

export type UserSettingsData = UserSettingsState & UserSettingsActions;