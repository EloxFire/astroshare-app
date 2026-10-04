import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSettingsData, UserSettingsState } from "../types/userSettingsData";
import { create } from 'zustand'
import { Observatory } from "../types/observatory";
import { GpsLocation } from "../types/gpsLocation";

const defaultUserData: UserSettingsState = {
  nightMode: false,
  locale: null,
  pinnedTools: ["moon-phases-calendar", "polar-align"],
  observatories: [],
  lastKnownLocation: null,
  activeObservatoryId: null,
  units: {
    time: "local",
    timezone: null,
    distance: "km",
    temperature: "celsius",
  },
  statistics: {
    astronomySessions: [],
    objectsObserved: {
      
    }
  },
  gear: {
    telescopes: [],
    mounts: [],
    eyepieces: [],
    filters: [],
    cameras: [],
    guideScopes: [],
    focusers: [],
    setups: []
  }
}

export const useUserDataStore = create<UserSettingsData>()(
  persist(
    (set) => ({
      ...defaultUserData,
      setNightMode: (newNightModeValue: boolean) => set({nightMode: newNightModeValue}),
      setLocale: (newLocale: string | null) => set({locale: newLocale}),
      setLastKnownLocation: (newLastKnownLocation: GpsLocation | null) => set({lastKnownLocation: newLastKnownLocation}),
      addObservatory: (newObservatory: Observatory) => set((state) => ({observatories: [...state.observatories, newObservatory]})),
      removeObservatory: (observatoryIdToRemove: string) => set((state) => ({observatories: state.observatories.filter(obs => obs.id !== observatoryIdToRemove)})),
      setActiveObservatoryId: (newActiveObservatoryId: string | null) => set({activeObservatoryId: newActiveObservatoryId}),
      setPinnedTools: (newPinnedTools: [string?, string?, string?, string?, string?]) => set({pinnedTools: newPinnedTools}),
      setTimeUnit: (newTimeUnit: "utc" | "local") => set((state) => ({units: {...state.units, time: newTimeUnit}})),
      setTimezone: (newTimezone: string | null) => set((state) => ({units: {...state.units, timezone: newTimezone}})),
      setDistanceUnit: (newDistanceUnit: "km" | "mi") => set((state) => ({units: {...state.units, distance: newDistanceUnit}})),
      setTemperatureUnit: (newTemperatureUnit: "celsius" | "fahrenheit") => set((state) => ({units: {...state.units, temperature: newTemperatureUnit}})),
      resetUserData: () => set(defaultUserData),
      // Gear and statistics related data
      addTelescope: (newTelescope) => set((state) => ({gear: {...state.gear, telescopes: [...state.gear.telescopes, newTelescope]}})),
      addMount: (newMount) => set((state) => ({gear: {...state.gear, mounts: [...state.gear.mounts, newMount]}})),
      addEyepiece: (newEyepiece) => set((state) => ({gear: {...state.gear, eyepieces: [...state.gear.eyepieces, newEyepiece]}})),
      addFilter: (newFilter) => set((state) => ({gear: {...state.gear, filters: [...state.gear.filters, newFilter]}})),
      addCamera: (newCamera) => set((state) => ({gear: {...state.gear, cameras: [...state.gear.cameras, newCamera]}})),
      addGuideScope: (newGuideScope) => set((state) => ({gear: {...state.gear, guideScopes: [...state.gear.guideScopes, newGuideScope]}})),
      addFocuser: (newFocuser) => set((state) => ({gear: {...state.gear, focusers: [...state.gear.focusers, newFocuser]}})),
      addSetup: (newSetup) => set((state) => ({gear: {...state.gear, setups: [...state.gear.setups, newSetup]}})),
      removeTelescope: (telescopeIdToRemove) => set((state) => ({gear: {...state.gear, telescopes: state.gear.telescopes.filter(t => t.id !== telescopeIdToRemove)}})),
      removeMount: (mountIdToRemove) => set((state) => ({gear: {...state.gear, mounts: state.gear.mounts.filter(m => m.id !== mountIdToRemove)}})),
      removeEyepiece: (eyepieceIdToRemove) => set((state) => ({gear: {...state.gear, eyepieces: state.gear.eyepieces.filter(e => e.id !== eyepieceIdToRemove)}})),
      removeFilter: (filterIdToRemove) => set((state) => ({gear: {...state.gear, filters: state.gear.filters.filter(f => f.id !== filterIdToRemove)}})),
      removeCamera: (cameraIdToRemove) => set((state) => ({gear: {...state.gear, cameras: state.gear.cameras.filter(c => c.id !== cameraIdToRemove)}})),
      removeGuideScope: (guideScopeIdToRemove) => set((state) => ({gear: {...state.gear, guideScopes: state.gear.guideScopes.filter(g => g.id !== guideScopeIdToRemove)}})),
      removeFocuser: (focuserIdToRemove) => set((state) => ({gear: {...state.gear, focusers: state.gear.focusers.filter(f => f.id !== focuserIdToRemove)}})),
      removeSetup: (setupIdToRemove) => set((state) => ({gear: {...state.gear, setups: state.gear.setups.filter(s => s.id !== setupIdToRemove)}})),
    }),
    {
      name: "astroshare_userData", // clé async storage,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)