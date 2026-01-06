import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useDsoCatalog } from "./DSOContext";
import { storageKeys } from "../helpers/constants";
import { getData, getObject, storeObject } from "../helpers/storage";
import { DSO } from "../helpers/types/DSO";
import { buildAchievementsCategories, AchievementCategory } from "../screens/dashboard/achievementsConfig";
import { showAchievementToast } from "../helpers/scripts/showToast";
import { DeviceEventEmitter } from "react-native";

type ObservationFlags = {
  observed?: boolean;
  photographed?: boolean;
  sketched?: boolean;
};

type StoredNote = {
  objectId?: string;
  objectName?: string;
  objectType?: string;
  objectTypeDetail?: string;
  messierNumber?: number;
  magnitude?: number;
  notes?: string;
  flags?: ObservationFlags;
  observed?: boolean;
  photographed?: boolean;
  sketched?: boolean;
  updatedAt?: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp?: string;
};

export type MessierItem = {
  id: string;
  label: string;
  commonName?: string;
  number: number;
};

export const TOTAL_MESSIER_OBJECTS = 110;

type UseDashboardDataOptions = {
  refreshTrigger?: any;
  notify?: boolean;
};

export const useDashboardData = (options?: UseDashboardDataOptions) => {
  const { dsoCatalog } = useDsoCatalog();
  const notify = options?.notify !== false;
  const refreshTrigger = options?.refreshTrigger;

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ favorites: 0, observed: 0, photographs: 0, sketches: 0 });
  const [messierObserved, setMessierObserved] = useState<number[]>([]);
  const [messierPhotographed, setMessierPhotographed] = useState<number[]>([]);
  const [messierSketched, setMessierSketched] = useState<number[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [latestUnlockedId, setLatestUnlockedId] = useState<string | null>(null);
  const [plannerSearchCount, setPlannerSearchCount] = useState(0);
  const [meta, setMeta] = useState({
    messierObservedCount: 0,
    messierPhotographedCount: 0,
    messierSketchedCount: 0,
    typeObservedCounts: {} as Record<string, number>,
    notesCount: 0,
    plannerSearchCount: 0,
    highMagObservedCount: 0,
    highMagPhotographedCount: 0,
    observedPlanets: [] as string[],
  });
  const [, setPrevUnlocked] = useState<string[]>([]);
  const prevUnlockedRef = useRef<string[]>([]);
  const hasHydratedUnlockedRef = useRef(false);

  const syncPrevUnlocked = useCallback((nextUnlocked: string[]) => {
    prevUnlockedRef.current = nextUnlocked;
    setPrevUnlocked(nextUnlocked);
  }, []);

  const hydratePrevUnlocked = useCallback(async () => {
    if (hasHydratedUnlockedRef.current) return prevUnlockedRef.current;
    try {
      const stored = await getObject(storageKeys.dashboardAchievementsUnlocked);
      if (Array.isArray(stored)) {
        syncPrevUnlocked(stored);
      }
    } catch (error) {
      console.warn("[Dashboard] Unable to load achievements cache", error);
    } finally {
      hasHydratedUnlockedRef.current = true;
    }
    return prevUnlockedRef.current;
  }, [syncPrevUnlocked]);

  const observedMessierSet = useMemo(() => new Set(messierObserved), [messierObserved]);
  const messierPhotographedSet = useMemo(() => new Set(messierPhotographed), [messierPhotographed]);
  const messierSketchedSet = useMemo(() => new Set(messierSketched), [messierSketched]);

  const parseMessierNumber = (name?: string) => {
    if (!name) return null;
    const match = name.match(/messier\s*(\d+)|^M\s*(\d+)/i);
    if (!match) return null;
    const num = parseInt(match[1] || match[2], 10);
    if (!num || num < 1 || num > TOTAL_MESSIER_OBJECTS) return null;
    return num;
  };

  const safeParseNote = (value?: string | null): StoredNote | null => {
    if (!value) return null;
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") return parsed as StoredNote;
    } catch (error) {
      console.warn("[Dashboard] Failed to parse note", error);
    }
    return null;
  };

  const buildActivityLabel = (note: StoredNote) => {
    const flags = note.flags || {};
    const observed = flags.observed ?? note.observed;
    const photographed = flags.photographed ?? note.photographed;
    const sketched = flags.sketched ?? note.sketched;

    const actions = [];
    if (observed) actions.push("Observed");
    if (photographed) actions.push("Photographed");
    if (sketched) actions.push("Sketched");
    if (note.notes && actions.length === 0) actions.push("Notes updated");

    return actions.length ? actions.join(" • ") : "Activity logged";
  };

  const loadDashboardData = useCallback(async () => {
    setLoading(true);

    const normalize = (value?: string | null) =>
      (value ?? "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z]/g, "");

    const planetAliases: Record<string, string> = {
      mercury: "mercury",
      mercure: "mercury",
      venus: "venus",
      mars: "mars",
      jupiter: "jupiter",
      saturn: "saturn",
      saturne: "saturn",
      uranus: "uranus",
      neptune: "neptune",
      earth: "earth",
      terre: "earth",
    };

    const matchPlanet = (note: StoredNote) => {
      const candidates = [note.objectId, note.objectName, note.objectTypeDetail];
      for (const candidate of candidates) {
        const normalized = normalize(candidate);
        if (!normalized) continue;
        const match = planetAliases[normalized];
        if (match) return match;
      }
      return null;
    };

    const detectObservedType = (note: StoredNote): "star" | "galaxy" | "nebula" | "cluster" | "planet" | null => {
      const raw = (note.objectTypeDetail || note.objectType || "").toString();
      const value = normalize(raw);

      if (note.objectType?.toLowerCase() === "planet" || value.includes("planet")) {
        return "planet";
      }

      if (note.objectType?.toLowerCase() === "star" || value.includes("etoile") || value.includes("star")) {
        return "star";
      }

      if (
        value.includes("galax") ||
        ["g", "ggroup", "gpair", "gtrpl"].includes(value)
      ) {
        return "galaxy";
      }

      if (
        value.includes("neb") ||
        value.includes("nebule") ||
        ["pn", "snr", "hii", "rfn", "drkn", "cln"].includes(value)
      ) {
        return "nebula";
      }

      if (
        value.includes("cluster") ||
        value.includes("amas") ||
        ["gcl", "ocl"].includes(value)
      ) {
        return "cluster";
      }

      return null;
    };

    try {
      const [favsDso, favsPlanets, favsStars] = await Promise.all([
        getObject(storageKeys.favouriteObjects),
        getObject(storageKeys.favouritePlanets),
        getObject(storageKeys.favouriteStars),
      ]);

      const totalFavorites =
        (Array.isArray(favsDso) ? favsDso.length : 0) +
        (Array.isArray(favsPlanets) ? favsPlanets.length : 0) +
        (Array.isArray(favsStars) ? favsStars.length : 0);

      const keys = await AsyncStorage.getAllKeys();
      const noteKeys = keys.filter((key) => key.startsWith("notes_"));

      let observedCount = 0;
      let photographsCount = 0;
      let sketchesCount = 0;
      const messierNumbers: number[] = [];
      const activities: ActivityItem[] = [];
      const messierPhoto: number[] = [];
      const messierSketch: number[] = [];
      let notesCount = 0;
      const typeObservedCounts: Record<string, number> = {};
      const highMagObserved = new Set<string>();
      const highMagPhotographed = new Set<string>();
      const observedPlanets = new Set<string>();

      if (noteKeys.length) {
        const entries = await AsyncStorage.multiGet(noteKeys);

        entries.forEach(([key, value], index) => {
          const note = safeParseNote(value);
          if (!note) return;

          const flags = note.flags || {};
          const observed = Boolean(flags.observed ?? note.observed);
          const photographed = Boolean(flags.photographed ?? note.photographed);
          const sketched = Boolean(flags.sketched ?? note.sketched);
          const objectKey = note.objectId || note.objectName || key;

          if (observed) observedCount += 1;
          if (photographed) photographsCount += 1;
          if (sketched) sketchesCount += 1;

          const magnitude = typeof note.magnitude === "number" ? note.magnitude : null;
          if (observed && magnitude !== null && magnitude > 10) highMagObserved.add(objectKey);
          if (photographed && magnitude !== null && magnitude > 10) highMagPhotographed.add(objectKey);

          const messierNumber = note.messierNumber || parseMessierNumber(note.objectName);
          if (observed && messierNumber) {
            messierNumbers.push(messierNumber);
          }
          if (photographed && messierNumber) {
            messierPhoto.push(messierNumber);
          }
          if (sketched && messierNumber) {
            messierSketch.push(messierNumber);
          }

          if (note.notes && note.notes.trim().length > 0) notesCount += 1;

          const typeDetail = detectObservedType(note);
          if (typeDetail) {
            if (!typeObservedCounts[typeDetail]) typeObservedCounts[typeDetail] = 0;
            if (observed) typeObservedCounts[typeDetail] += 1;
          }

          if (observed && (note.objectType === "Planet" || typeDetail === "planet")) {
            const planetName = matchPlanet(note);
            if (planetName && planetName !== "earth") {
              observedPlanets.add(planetName);
            }
          }

          activities.push({
            id: `${key}-${index}`,
            title: note.objectName || "Unknown object",
            description: buildActivityLabel(note),
            timestamp: note.updatedAt,
          });
        });
      }

      activities.sort((a, b) => {
        if (!a.timestamp && !b.timestamp) return 0;
        if (!a.timestamp) return 1;
        if (!b.timestamp) return -1;
        return dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf();
      });

      setStats({
        favorites: totalFavorites,
        observed: observedCount,
        photographs: photographsCount,
        sketches: sketchesCount,
      });
      setMessierObserved(Array.from(new Set(messierNumbers)));
      setMessierPhotographed(Array.from(new Set(messierPhoto)));
      setMessierSketched(Array.from(new Set(messierSketch)));
      setRecentActivities(activities.slice(0, 15));
      const plannerCount = parseInt((await getData(storageKeys.dashboardPlannerSearches)) || "0", 10) || 0;
      setPlannerSearchCount(plannerCount);

      const nextMeta = {
        messierObservedCount: new Set(messierNumbers).size,
        messierPhotographedCount: new Set(messierPhoto).size,
        messierSketchedCount: new Set(messierSketch).size,
        typeObservedCounts,
        notesCount,
        plannerSearchCount: plannerCount,
        highMagObservedCount: highMagObserved.size,
        highMagPhotographedCount: highMagPhotographed.size,
        observedPlanets: Array.from(observedPlanets),
      };
      setMeta(nextMeta);
      const wasHydrated = hasHydratedUnlockedRef.current;
      await hydratePrevUnlocked();

      const categories = buildAchievementsCategories(nextMeta);
      const unlockedIds = categories.flatMap((cat) => cat.items.filter((i) => i.achieved).map((i) => i.id));
      const previousUnlocked = prevUnlockedRef.current;
      const newIds = unlockedIds.filter((id) => !previousUnlocked.includes(id));
      const nextUnlockedOrdered = newIds.length ? [...previousUnlocked, ...newIds] : previousUnlocked;
      const latestId = newIds.length
        ? newIds[newIds.length - 1]
        : nextUnlockedOrdered[nextUnlockedOrdered.length - 1];
      setLatestUnlockedId(latestId ?? null);

      if (notify && wasHydrated && newIds.length > 0) {
        const newlyUnlockedId = newIds[newIds.length - 1];
        const newlyUnlocked = categories.flatMap((cat) => cat.items).find((i) => i.id === newlyUnlockedId);
        if (newlyUnlocked) {
          showAchievementToast({ title: newlyUnlocked.title });
        }
      }

      if (newIds.length > 0) {
        syncPrevUnlocked(nextUnlockedOrdered);
        await storeObject(storageKeys.dashboardAchievementsUnlocked, nextUnlockedOrdered);
      }
    } catch (error) {
      console.warn("[Dashboard] Unable to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  }, [refreshTrigger, dsoCatalog, hydratePrevUnlocked, notify, syncPrevUnlocked]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('dashboardRefresh', loadDashboardData);
    return () => sub.remove();
  }, [loadDashboardData]);

  const messierCatalog: MessierItem[] = useMemo(() => {
    const mappedFromCatalog =
      (dsoCatalog as DSO[] | undefined)?.filter((dso) => dso.m !== "").map((dso) => ({
        id: `M${dso.m}`,
        label: `M${dso.m}`,
        commonName: dso.common_names?.split(",")[0]?.trim() || "",
        number: typeof dso.m === "string" ? parseInt(dso.m, 10) : Number(dso.m),
      })) || [];

    const filteredCatalog = mappedFromCatalog
      .filter((item) => !!item.number && item.number >= 1 && item.number <= TOTAL_MESSIER_OBJECTS)
      .sort((a, b) => a.number - b.number);

    if (filteredCatalog.length) return filteredCatalog;

    return Array.from({ length: TOTAL_MESSIER_OBJECTS }, (_, index) => ({
      id: `M${index + 1}`,
      label: `M${index + 1}`,
      number: index + 1,
    }));
  }, [dsoCatalog]);

  const messierProgress = Math.min(
    100,
    Math.round((observedMessierSet.size / TOTAL_MESSIER_OBJECTS) * 100)
  );

  const achievementsCategories: AchievementCategory[] = useMemo(() => {
    return buildAchievementsCategories(meta);
  }, [messierProgress, stats, plannerSearchCount, meta]);

  const latestAchievement = useMemo(() => {
    if (!latestUnlockedId) return null;
    return achievementsCategories.flatMap((cat) => cat.items).find((i) => i.id === latestUnlockedId) || null;
  }, [achievementsCategories, latestUnlockedId]);

  return {
    loading,
    stats,
    messierObserved,
    messierPhotographed,
    messierSketched,
    observedMessierSet,
    messierPhotographedSet,
    messierSketchedSet,
    messierCatalog,
    messierProgress,
    recentActivities,
    typeObservedCounts: meta.typeObservedCounts,
    achievementsCategories,
    latestAchievement,
    reload: loadDashboardData,
    dsoCatalog,
  };
};
