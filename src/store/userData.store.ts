import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSettingsData, UserSettingsState } from "../types/userSettingsData";
import { create } from 'zustand'
import { Observatory } from "../types/observatory";

const defaultUserData: UserSettingsState = {
  nightMode: false,
  locale: null,
  pinnedTools: ["moon-phases-calendar", "polar-align"],
  observatories: [],
  activeObservatoryId: null,
  units: {
    time: "local",
    timezone: null,
    distance: "km",
    temperature: "celsius",
  }
}

export const useUserDataStore = create<UserSettingsData>()(
  persist(
    (set) => ({
      ...defaultUserData,
      setNightMode: (newNightModeValue: boolean) => set({nightMode: newNightModeValue}),
      setLocale: (newLocale: string | null) => set({locale: newLocale}),
      addObservatory: (newObservatory: Observatory) => set((state) => ({observatories: [...state.observatories, newObservatory]})),
      removeObservatory: (observatoryIdToRemove: string) => set((state) => ({observatories: state.observatories.filter(obs => obs.id !== observatoryIdToRemove)})),
      setActiveObservatoryId: (newActiveObservatoryId: string | null) => set({activeObservatoryId: newActiveObservatoryId}),
      setPinnedTools: (newPinnedTools: [string?, string?, string?, string?, string?]) => set({pinnedTools: newPinnedTools}),
      setTimeUnit: (newTimeUnit: "utc" | "local") => set((state) => ({units: {...state.units, time: newTimeUnit}})),
      setTimezone: (newTimezone: string | null) => set((state) => ({units: {...state.units, timezone: newTimezone}})),
      setDistanceUnit: (newDistanceUnit: "km" | "mi") => set((state) => ({units: {...state.units, distance: newDistanceUnit}})),
      setTemperatureUnit: (newTemperatureUnit: "celsius" | "fahrenheit") => set((state) => ({units: {...state.units, temperature: newTemperatureUnit}})),
    }),
    {
      name: "astroshare_userData", // clé async storage,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)