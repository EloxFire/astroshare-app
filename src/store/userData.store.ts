import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserSettingsData, UserSettingsState } from "../types/userSettingsData";
import { create } from 'zustand'
import { Observatory } from "../types/observatory";
import { GpsLocation } from "../types/gpsLocation";

const defaultUserData: UserSettingsState = {
  nightMode: false,
  locale: null,
  pinnedTools: ["moon-phases-calendar", "polar-scope"],
  observatories: [],
  lastKnownLocation: null,
  activeObservatoryId: null,
  // IDs NORAD suivis par l'utilisateur (outil Satellites, "Mes satellites") — purement local,
  // l'API n'a pas de route pour une liste de suivi côté serveur. Réservé aux comptes PRO côté UI.
  trackedSatellites: [],
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
    telescopes: [
      {
        id: "telescope-1",
        aperture: 150,
        focalLength: 750,
        eyepieceConnection: [1.25],
        type: "refractor" as const,
        model: "PDS",
        brand: "SkyWatcher",
        usages: ["visual", "deepSky"] as const,
      },
      {
        id: "telescope-2",
        aperture: 200,
        focalLength: 1000,
        eyepieceConnection: [1.25, 2],
        type: "reflector" as const,
        model: "Skymax-200",
        usages: ["visual", "deepSky", "photo"] as const,
        brand: "SkyWatcher",
      }
    ],
    mounts: [
      {
        id: "mount-1",
        type: "equatorial",
        brand: "SkyWatcher",
        model: "NEQ5 Pro Goto",
        motorized: true,
      }
    ],
    eyepieces: [
      {
        id: "eyepiece-1",
        brand: "Omegon",
        model: "Cronus",
        focalLength: 6,
        afov: 68,
        barrelSize: 1.25,
        type: "plossl"
      }
    ],
    filters: [],
    cameras: [
      {
        id: "camera-1",
        type: "cmos",
        brand: "ZWO",
        model: "ASI178 MC",
        pixelSize: 2.4,
        sensorSize: {
          width:7.37,
          height: 4.92
        },
        resolution: {
          width: 3096,
          height: 2080
        }
      }
    ],
    guideScopes: [],
    focusers: [],
    setups: []
  },
  // Checklist pré-remplie à l'installation, comme les fiches de matériel ci-dessus : un modèle de
  // départ générique pour une soirée d'observation, pas lié à une session réelle. Items réordonnés
  // (planification puis préparation puis affaires à emporter) et complétés par deux ajouts
  // (batteries de rechange, confort assis) par rapport à la liste donnée, volontairement au même
  // niveau de détail (catégories larges, pas une itemisation pièce par pièce).
  checklists: [
    {
      id: "checklist-1",
      name: "Soirée d'astronomie",
      description: "Un modèle de liste par défaut pour vos sessions d'observation.",
      items: [
        { id: "item-1", label: "Planifier mes observations", checked: false },
        { id: "item-2", label: "Vérifier la météo", checked: false },
        { id: "item-3", label: "Cartes du ciel", checked: false },
        { id: "item-4", label: "Matériel d'observation", checked: false },
        { id: "item-5", label: "Batteries de rechange", checked: false },
        { id: "item-6", label: "Lampe rouge", checked: false },
        { id: "item-7", label: "Vêtements chauds", checked: false },
        { id: "item-8", label: "Chaise pliante ou tapis de sol", checked: false },
        { id: "item-9", label: "Snacks et boissons", checked: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  recentSearches: []
}

export const useUserDataStore = create<UserSettingsData>()(
  persist(
    (set) => ({
      ...defaultUserData,
      setNightMode: (newNightModeValue: boolean) => set({nightMode: newNightModeValue}),
      setLocale: (newLocale: string | null) => set({locale: newLocale}),
      setLastKnownLocation: (newLastKnownLocation: GpsLocation | null) => set({lastKnownLocation: newLastKnownLocation}),
      addObservatory: (newObservatory: Observatory) => set((state) => ({observatories: [...state.observatories, newObservatory]})),
      updateObservatory: (observatoryId: string, updatedObservatory: Observatory) => set((state) => ({
        observatories: state.observatories.map(obs => obs.id === observatoryId ? updatedObservatory : obs),
      })),
      // Si l'observatoire supprimé était l'actif, on retombe sur le GPS (activeObservatoryId: null)
      // plutôt que de laisser un id qui ne pointe plus vers rien.
      removeObservatory: (observatoryIdToRemove: string) => set((state) => ({
        observatories: state.observatories.filter(obs => obs.id !== observatoryIdToRemove),
        activeObservatoryId: state.activeObservatoryId === observatoryIdToRemove ? null : state.activeObservatoryId,
      })),
      setActiveObservatoryId: (newActiveObservatoryId: string | null) => set({activeObservatoryId: newActiveObservatoryId}),
      addTrackedSatellite: (noradId: number) => set((state) => (
        state.trackedSatellites.includes(noradId) ? state : {trackedSatellites: [...state.trackedSatellites, noradId]}
      )),
      removeTrackedSatellite: (noradId: number) => set((state) => ({trackedSatellites: state.trackedSatellites.filter(id => id !== noradId)})),
      setPinnedTools: (newPinnedTools: [string?, string?, string?, string?, string?]) => set({pinnedTools: newPinnedTools}),
      setTimeUnit: (newTimeUnit: "utc" | "local") => set((state) => ({units: {...state.units, time: newTimeUnit}})),
      setTimezone: (newTimezone: string | null) => set((state) => ({units: {...state.units, timezone: newTimezone}})),
      setDistanceUnit: (newDistanceUnit: "km" | "mi") => set((state) => ({units: {...state.units, distance: newDistanceUnit}})),
      setTemperatureUnit: (newTemperatureUnit: "celsius" | "fahrenheit") => set((state) => ({units: {...state.units, temperature: newTemperatureUnit}})),
      resetUserData: () => set(defaultUserData),
      addAstronomySession: (newSession) => set((state) => ({statistics: {...state.statistics, astronomySessions: [...state.statistics.astronomySessions, newSession]}})),
      removeAstronomySession: (sessionIdToRemove) => set((state) => ({statistics: {...state.statistics, astronomySessions: state.statistics.astronomySessions.filter(session => session.id !== sessionIdToRemove)}})),
      // Gear and statistics related data
      addTelescope: (newTelescope) => set((state) => ({gear: {...state.gear, telescopes: [...state.gear.telescopes, newTelescope]}})),
      addMount: (newMount) => set((state) => ({gear: {...state.gear, mounts: [...state.gear.mounts, newMount]}})),
      addEyepiece: (newEyepiece) => set((state) => ({gear: {...state.gear, eyepieces: [...state.gear.eyepieces, newEyepiece]}})),
      addFilter: (newFilter) => set((state) => ({gear: {...state.gear, filters: [...state.gear.filters, newFilter]}})),
      addCamera: (newCamera) => set((state) => ({gear: {...state.gear, cameras: [...state.gear.cameras, newCamera]}})),
      addGuideScope: (newGuideScope) => set((state) => ({gear: {...state.gear, guideScopes: [...state.gear.guideScopes, newGuideScope]}})),
      addFocuser: (newFocuser) => set((state) => ({gear: {...state.gear, focusers: [...state.gear.focusers, newFocuser]}})),
      addSetup: (newSetup) => set((state) => ({gear: {...state.gear, setups: [...state.gear.setups, newSetup]}})),
      updateTelescope: (telescopeId, updatedTelescope) => set((state) => ({gear: {...state.gear, telescopes: state.gear.telescopes.map(t => t.id === telescopeId ? updatedTelescope : t)}})),
      updateMount: (mountId, updatedMount) => set((state) => ({gear: {...state.gear, mounts: state.gear.mounts.map(m => m.id === mountId ? updatedMount : m)}})),
      updateEyepiece: (eyepieceId, updatedEyepiece) => set((state) => ({gear: {...state.gear, eyepieces: state.gear.eyepieces.map(e => e.id === eyepieceId ? updatedEyepiece : e)}})),
      updateFilter: (filterId, updatedFilter) => set((state) => ({gear: {...state.gear, filters: state.gear.filters.map(f => f.id === filterId ? updatedFilter : f)}})),
      updateCamera: (cameraId, updatedCamera) => set((state) => ({gear: {...state.gear, cameras: state.gear.cameras.map(c => c.id === cameraId ? updatedCamera : c)}})),
      updateGuideScope: (guideScopeId, updatedGuideScope) => set((state) => ({gear: {...state.gear, guideScopes: state.gear.guideScopes.map(g => g.id === guideScopeId ? updatedGuideScope : g)}})),
      updateFocuser: (focuserId, updatedFocuser) => set((state) => ({gear: {...state.gear, focusers: state.gear.focusers.map(f => f.id === focuserId ? updatedFocuser : f)}})),
      updateSetup: (setupId, updatedSetup) => set((state) => ({gear: {...state.gear, setups: state.gear.setups.map(s => s.id === setupId ? updatedSetup : s)}})),
      removeTelescope: (telescopeIdToRemove) => set((state) => ({gear: {...state.gear, telescopes: state.gear.telescopes.filter(t => t.id !== telescopeIdToRemove)}})),
      removeMount: (mountIdToRemove) => set((state) => ({gear: {...state.gear, mounts: state.gear.mounts.filter(m => m.id !== mountIdToRemove)}})),
      removeEyepiece: (eyepieceIdToRemove) => set((state) => ({gear: {...state.gear, eyepieces: state.gear.eyepieces.filter(e => e.id !== eyepieceIdToRemove)}})),
      removeFilter: (filterIdToRemove) => set((state) => ({gear: {...state.gear, filters: state.gear.filters.filter(f => f.id !== filterIdToRemove)}})),
      removeCamera: (cameraIdToRemove) => set((state) => ({gear: {...state.gear, cameras: state.gear.cameras.filter(c => c.id !== cameraIdToRemove)}})),
      removeGuideScope: (guideScopeIdToRemove) => set((state) => ({gear: {...state.gear, guideScopes: state.gear.guideScopes.filter(g => g.id !== guideScopeIdToRemove)}})),
      removeFocuser: (focuserIdToRemove) => set((state) => ({gear: {...state.gear, focusers: state.gear.focusers.filter(f => f.id !== focuserIdToRemove)}})),
      removeSetup: (setupIdToRemove) => set((state) => ({gear: {...state.gear, setups: state.gear.setups.filter(s => s.id !== setupIdToRemove)}})),
      // Checklists : addChecklist/updateChecklist (remplacement complet, comme updateSetup) laissent
      // updatedAt au choix de l'appelant ; les actions granulées ci-dessous touchent un élément
      // imbriqué directement dans le store (pas d'objet complet fourni par l'appelant), donc elles
      // posent elles-mêmes updatedAt sur la checklist concernée.
      addChecklist: (newChecklist) => set((state) => ({checklists: [...state.checklists, newChecklist]})),
      updateChecklist: (checklistId, updatedChecklist) => set((state) => ({
        checklists: state.checklists.map(c => c.id === checklistId ? updatedChecklist : c),
      })),
      removeChecklist: (checklistIdToRemove) => set((state) => ({checklists: state.checklists.filter(c => c.id !== checklistIdToRemove)})),
      addChecklistItem: (checklistId, newItem) => set((state) => ({
        checklists: state.checklists.map(c => c.id === checklistId
          ? { ...c, items: [...c.items, newItem], updatedAt: new Date().toISOString() }
          : c
        ),
      })),
      removeChecklistItem: (checklistId, itemIdToRemove) => set((state) => ({
        checklists: state.checklists.map(c => c.id === checklistId
          ? { ...c, items: c.items.filter(item => item.id !== itemIdToRemove), updatedAt: new Date().toISOString() }
          : c
        ),
      })),
      toggleChecklistItem: (checklistId, itemId) => set((state) => ({
        checklists: state.checklists.map(c => c.id === checklistId
          ? { ...c, items: c.items.map(item => item.id === itemId ? { ...item, checked: !item.checked } : item), updatedAt: new Date().toISOString() }
          : c
        ),
      })),
      uncheckAllChecklistItems: (checklistId) => set((state) => ({
        checklists: state.checklists.map(c => c.id === checklistId
          ? { ...c, items: c.items.map(item => ({ ...item, checked: false })), updatedAt: new Date().toISOString() }
          : c
        ),
      })),
      // Recherche globale : liste de requêtes textuelles, la plus récente en tête. Dédupliquée
      // (insensible à la casse/aux espaces superflus, pour ne pas garder "Lune" et "lune " comme
      // deux entrées) et plafonnée à 10 — même esprit que pinnedTools, pas la peine d'un historique
      // plus long pour un simple raccourci de ressaisie.
      addRecentSearch: (query) => set((state) => {
        const trimmedQuery = query.trim();
        if (!trimmedQuery) return state;
        const withoutDuplicate = state.recentSearches.filter(
          (existingQuery) => existingQuery.toLowerCase() !== trimmedQuery.toLowerCase()
        );
        return { recentSearches: [trimmedQuery, ...withoutDuplicate].slice(0, 10) };
      }),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: "astroshare_userData", // clé async storage,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)