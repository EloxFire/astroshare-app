import { GpsLocation } from "./gpsLocation";
import { Observatory } from "./observatory";
import { Telescope } from "./gear/Telescope";
import { Mount } from "./gear/Mount";
import { AstronomySession } from "./statistics/AstronomySession";
import { Camera } from "./gear/Camera";
import { Eyepiece } from "./gear/Eyepiece";
import { Filter } from "./gear/Filter";
import { GuideScope } from "./gear/GuideScope";
import { Focuser } from "./gear/Focuser";
import { Setup } from "./gear/Setup";

export type UserSettingsState = {
  nightMode: false | true;
  locale: string | null; // null = automatique (langue de l'appareil) ; sinon choix explicite de l'utilisateur
  pinnedTools: [string?, string?, string?, string?, string?]; // Max 5 outils épinglés
  observatories: Observatory[];
  activeObservatoryId: string | null; //uuid d'un observatoire - null = position gps actuelle
  lastKnownLocation: GpsLocation | null; // null = pas encore de position gps connue
  units: {
    time: "utc" | "local";
    // Ne compte que si time === "local" : null = fuseau horaire de l'appareil (défaut),
    // sinon fuseau IANA explicite (ex: "Europe/Paris") choisi par l'utilisateur — utile
    // quand l'observateur (position GPS ou observatoire enregistré) n'est pas dans le
    // même fuseau que l'appareil, sinon les heures de lever/coucher affichées sont fausses.
    timezone: string | null;
    distance: "km" | "mi";
    temperature: "celsius" | "fahrenheit";
  },
  statistics: {
    astronomySessions: AstronomySession[];
    objectsObserved: {
      
    }
  },
  gear: {
    telescopes: Telescope[];
    mounts: Mount[];
    eyepieces: Eyepiece[];
    filters: Filter[];
    cameras: Camera[];
    guideScopes: GuideScope[];
    focusers: Focuser[];
    setups: Setup[];
  }
}

export type UserSettingsActions = {
  setNightMode: (newNightModeValue: boolean) => void;
  setLocale: (newLocale: string | null) => void;
  setLastKnownLocation: (newLastKnownLocation: GpsLocation | null) => void;
  addObservatory: (newObservatory: Observatory) => void;
  removeObservatory: (observatoryIdToRemove: string) => void;
  setActiveObservatoryId: (newActiveObservatoryId: string | null) => void;
  setPinnedTools: (newPinnedTools: [string?, string?, string?, string?, string?]) => void;
  setTimeUnit: (newTimeUnit: "utc" | "local") => void;
  setTimezone: (newTimezone: string | null) => void;
  setDistanceUnit: (newDistanceUnit: "km" | "mi") => void;
  setTemperatureUnit: (newTemperatureUnit: "celsius" | "fahrenheit") => void;
  resetUserData: () => void;
  // Gear management actions
  addTelescope: (newTelescope: Telescope) => void;
  removeTelescope: (telescopeIdToRemove: string) => void;
  addMount: (newMount: Mount) => void;
  removeMount: (mountIdToRemove: string) => void;
  addEyepiece: (newEyepiece: Eyepiece) => void;
  removeEyepiece: (eyepieceIdToRemove: string) => void;
  addFilter: (newFilter: Filter) => void;
  removeFilter: (filterIdToRemove: string) => void;
  addCamera: (newCamera: Camera) => void;
  removeCamera: (cameraIdToRemove: string) => void;
  addGuideScope: (newGuideScope: GuideScope) => void;
  removeGuideScope: (guideScopeIdToRemove: string) => void;
  addFocuser: (newFocuser: Focuser) => void;
  removeFocuser: (focuserIdToRemove: string) => void;
  addSetup: (newSetup: Setup) => void;
  removeSetup: (setupIdToRemove: string) => void;
}

export type UserSettingsData = UserSettingsState & UserSettingsActions;