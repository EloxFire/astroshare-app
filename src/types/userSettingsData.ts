import { Observatory } from "./observatory";

export type UserSettingsState = {
  nightMode: false | true;
  locale: string | null; // null = automatique (langue de l'appareil) ; sinon choix explicite de l'utilisateur
  pinnedTools: [string?, string?, string?, string?, string?]; // Max 5 outils épinglés
  observatories: Observatory[];
  activeObservatoryId: string | null; //uuid d'un observatoire - null = position gps actuelle
  units: {
    time: "utc" | "local";
    // Ne compte que si time === "local" : null = fuseau horaire de l'appareil (défaut),
    // sinon fuseau IANA explicite (ex: "Europe/Paris") choisi par l'utilisateur — utile
    // quand l'observateur (position GPS ou observatoire enregistré) n'est pas dans le
    // même fuseau que l'appareil, sinon les heures de lever/coucher affichées sont fausses.
    timezone: string | null;
    distance: "km" | "mi";
    temperature: "celsius" | "fahrenheit";
  }
}

export type UserSettingsActions = {
  setNightMode: (newNightModeValue: boolean) => void;
  setLocale: (newLocale: string | null) => void;
  addObservatory: (newObservatory: Observatory) => void;
  removeObservatory: (observatoryIdToRemove: string) => void;
  setActiveObservatoryId: (newActiveObservatoryId: string | null) => void;
  setPinnedTools: (newPinnedTools: [string?, string?, string?, string?, string?]) => void;
  setTimeUnit: (newTimeUnit: "utc" | "local") => void;
  setTimezone: (newTimezone: string | null) => void;
  setDistanceUnit: (newDistanceUnit: "km" | "mi") => void;
  setTemperatureUnit: (newTemperatureUnit: "celsius" | "fahrenheit") => void;
}

export type UserSettingsData = UserSettingsState & UserSettingsActions;