import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSettingsData } from "../types/userSettingsData";
import { create } from 'zustand'
import { Observatory } from "../types/observatory";

const defaultUserData: UserSettingsData = {
  nightMode: false,
  locale: "fr-FR",
  pinnedTools: ["moon-phases-calendar", "polar-align"],
  observatories: [],
  activeObservatoryId: null,
}

export const useUserDataStore = create<UserSettingsData>()(
  persist(
    (set) => ({
      ...defaultUserData,
      setNightMode: (newNightModeValue: boolean) => set({nightMode: newNightModeValue}),
      setLocale: (newLocale: string) => set({locale: newLocale}),
      addObservatory: (newObservatory: Observatory) => set((state) => ({observatories: [...state.observatories, newObservatory]})),
      removeObservatory: (observatoryIdToRemove: string) => set((state) => ({observatories: state.observatories.filter(obs => obs.id !== observatoryIdToRemove)})),
      setActiveObservatoryId: (newActiveObservatoryId: string | null) => set({activeObservatoryId: newActiveObservatoryId}),
      setPinnedTools: (newPinnedTools: [string?, string?, string?, string?, string?]) => set({pinnedTools: newPinnedTools}),
    }),
    {
      name: "astroshare_userData", // clé async storage,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)