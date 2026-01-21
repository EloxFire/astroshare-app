import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import dayjs from "dayjs";
import { useDsoCatalog } from "./DSOContext";
import { storageKeys } from "../helpers/constants";
import { getData, getObject, storeObject } from "../helpers/storage";
import { DSO } from "../helpers/types/DSO";
import { buildAchievementsCategories, AchievementCategory } from "../screens/dashboard/achievementsConfig";
import { showAchievementToast } from "../helpers/scripts/showToast";
import { DeviceEventEmitter, ImageSourcePropType } from "react-native";
import { ActivityItem } from "../helpers/types/dashboard/ActivityItem";
import { MessierItem } from "../helpers/types/dashboard/MessierItem";
import { StoredNote } from "../helpers/types/dashboard/StoredNote";
import { astroImages } from "../helpers/scripts/loadImages";
import { i18n } from "../helpers/scripts/i18n";
import { objectTypesTranslations as frObjectTypes } from "../translation/fr/common/objectTypes";
import { objectTypesTranslations as enObjectTypes } from "../translation/en/common/objectTypes";


export const TOTAL_MESSIER_OBJECTS = 110;

type ObservedType = "star" | "galaxy" | "nebula" | "cluster" | "planet";
type ObservedTypeWithOther = ObservedType | "other";

const normalize = (value?: string | null) =>
  (value ?? "")
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

const TYPE_CODE_ALIASES: Record<string, string> = {
  cln: "CL+N",
  drkn: "DRKN",
  g: "G",
  gcl: "GCL",
  ggroup: "GGROUP",
  gpair: "GPAIR",
  gtrpl: "GTRPL",
  hii: "HII",
  neb: "NEB",
  ocl: "OCL",
  pn: "PN",
  snr: "SNR",
  rfn: "RFN",
  star: "STAR",
  starass: "*ASS",
  dblstar: "**",
};

const TYPE_LABEL_TO_CODE: Record<string, string> = {};

[frObjectTypes, enObjectTypes].forEach((dict) => {
  Object.entries(dict).forEach(([key, label]) => {
    const normalized = normalize(label);
    if (!normalized) return;
    const code = TYPE_CODE_ALIASES[key] || key.toUpperCase();
    TYPE_LABEL_TO_CODE[normalized] = code;
  });
});

const typeCategoryFromCode = (code?: string | null): ObservedType | null => {
  const value = code?.toUpperCase();
  switch (value) {
    case "G":
    case "GGROUP":
    case "GPAIR":
    case "GTRPL":
      return "galaxy";
    case "GCL":
    case "OCL":
      return "cluster";
    case "CL+N":
      return "nebula";
    case "NEB":
    case "PN":
    case "SNR":
    case "HII":
    case "RFN":
    case "DRKN":
      return "nebula";
    case "*":
    case "*ASS":
    case "**":
    case "STAR":
      return "star";
    case "PLANET":
      return "planet";
    default:
      return null;
  }
};

const typeCodeFromDetail = (detail?: string | null): string | null => {
  const raw = (detail || "").trim();
  const upperRaw = raw.toUpperCase();
  if (upperRaw && astroImages[upperRaw]) return upperRaw;

  const normalized = normalize(detail);
  if (!normalized) return null;

  if (TYPE_LABEL_TO_CODE[normalized]) return TYPE_LABEL_TO_CODE[normalized];

  if ((normalized.includes("nebula") || normalized.includes("nebuleuse")) && normalized.includes("cluster")) return "CL+N";
  if (normalized.includes("cln")) return "CL+N";
  if (normalized.includes("supernova")) return "SNR";
  if (normalized.includes("planetary") || normalized.includes("planetaire")) return "PN";
  if (normalized.includes("hii")) return "HII";
  if (normalized.includes("reflection") || normalized.includes("reflexion")) return "RFN";
  if (normalized.includes("dark") || normalized.includes("sombre") || normalized.includes("obscur")) return "DRKN";
  if (normalized.includes("globular") || normalized.includes("globulaire")) return "GCL";
  if (normalized.includes("opencluster") || normalized.includes("amasouvert")) return "OCL";
  if (normalized.includes("cluster") || normalized.includes("amas")) return "OCL";
  if (normalized.includes("galax")) return "G";
  if (normalized.includes("asterism") || normalized.includes("asterisme")) return "*ASS";
  if (normalized.includes("double")) return "**";
  if (normalized.includes("etoile") || normalized.includes("star")) return "STAR";
  if (normalized.includes("neb")) return "NEB";
  if (normalized.includes("planet")) return "PLANET";

  return null;
};

const resolveNoteTypeCode = (note: StoredNote): string | null => {
  if (note.objectTypeCode) return String(note.objectTypeCode).toUpperCase();

  const directDetailCode = typeCodeFromDetail(note.objectTypeDetail);
  if (directDetailCode) return directDetailCode;

  const rawType = (note.objectType || "").toUpperCase();
  if (rawType === "STAR") return "STAR";
  if (rawType === "PLANET") return "PLANET";

  return null;
};

const detectObservedType = (note: StoredNote, typeCode: string | null, planetName: string | null): ObservedType | null => {
  const categoryFromCode = typeCategoryFromCode(typeCode);
  if (categoryFromCode) return categoryFromCode;

  const rawType = (note.objectType || "").toLowerCase();
  if (rawType === "planet" || planetName) return "planet";
  if (rawType === "star") return "star";

  const codeFromDetail = typeCodeFromDetail(note.objectTypeDetail);
  const categoryFromDetail = typeCategoryFromCode(codeFromDetail);
  if (categoryFromDetail) return categoryFromDetail;

  const normalizedDetail = normalize(note.objectTypeDetail || note.objectType);
  if (!normalizedDetail) return null;

  if (normalizedDetail.includes("planet")) return "planet";
  if (normalizedDetail.includes("etoile") || normalizedDetail.includes("star")) return "star";
  if (normalizedDetail.includes("galax")) return "galaxy";
  if (normalizedDetail.includes("cluster") || normalizedDetail.includes("amas")) return "cluster";
  if (normalizedDetail.includes("neb")) return "nebula";

  return null;
};

const getActivityIcon = (
  note: StoredNote,
  typeDetail: ObservedType | null,
  planetName: string | null,
  typeCode: string | null
) => {
  const iconFromCode = (code?: string | null) => {
    const value = code?.toUpperCase();
    if (!value) return null;
    if (astroImages[value]) return astroImages[value];
    if (value === "STAR") return astroImages.BRIGHTSTAR;
    return null;
  };

  const codeIcon = iconFromCode(typeCode);
  if (codeIcon) return codeIcon;

  if (typeDetail === "planet" && planetName) {
    const key = planetName.toUpperCase();
    if (astroImages[key]) return astroImages[key];
  }

  const fallbackDetailIcon = iconFromCode(typeCodeFromDetail(note.objectTypeDetail));
  if (fallbackDetailIcon) return fallbackDetailIcon;

  const byCategory = (() => {
    switch (typeDetail) {
      case "star":
        return astroImages.BRIGHTSTAR;
      case "galaxy":
        return astroImages.G;
      case "nebula":
        return astroImages.NEB;
      case "cluster":
        return astroImages.OCL;
      case "planet":
        return planetName ? (astroImages[planetName.toUpperCase()] || astroImages.SATURN) : astroImages.SATURN;
      default:
        return null;
    }
  })();

  if (byCategory) return byCategory;

  const rawDetail = (note.objectTypeDetail || "").toUpperCase();
  if (rawDetail && astroImages[rawDetail]) return astroImages[rawDetail];

  const rawType = (note.objectType || "").toUpperCase();
  if (rawType === "PLANET" && planetName && astroImages[planetName.toUpperCase()]) {
    return astroImages[planetName.toUpperCase()];
  }
  if (rawType === "PLANET") return astroImages.SATURN;
  if (rawType === "STAR") return astroImages.BRIGHTSTAR;

  return astroImages.OTHER;
};

type UseDashboardDataOptions = {
  refreshTrigger?: any;
  notify?: boolean;
};

type ObjectObservationStat = {
  key: string;
  name: string;
  type: string;
  observed: number;
  photographed: number;
  sketched: number;
  icon: ImageSourcePropType;
  lastUpdated?: string | null;
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
    typeObservedTotals: {} as Record<string, number>,
    notesCount: 0,
    plannerSearchCount: 0,
    highMagObservedCount: 0,
    highMagPhotographedCount: 0,
    observedPlanets: [] as string[],
  });
  const [objectStats, setObjectStats] = useState<ObjectObservationStat[]>([]);
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

  const normalizeObservationCount = (value?: number | boolean): number => {
    if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.floor(value));
    if (value === true) return 1;
    if (value === false || value == null) return 0;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return Math.max(0, Math.floor(parsed));
    return 0;
  };

  const getObservationCounts = (note: StoredNote) => {
    const flags = note.flags || {};
    return {
      observed: normalizeObservationCount(flags.observed ?? note.observed),
      photographed: normalizeObservationCount(flags.photographed ?? note.photographed),
      sketched: normalizeObservationCount(flags.sketched ?? note.sketched),
    };
  };

  const buildActivityLabel = (note: StoredNote) => {
    const counts = getObservationCounts(note);

    const actions = [];
    const formatAction = (label: string, count: number) => (count > 1 ? `${label} (x${count})` : label);
    if (counts.observed > 0) actions.push(formatAction(i18n.t("dashboard.sections.recent.actions.observed"), counts.observed));
    if (counts.photographed > 0) actions.push(formatAction(i18n.t("dashboard.sections.recent.actions.photographed"), counts.photographed));
    if (counts.sketched > 0) actions.push(formatAction(i18n.t("dashboard.sections.recent.actions.sketched"), counts.sketched));
    if (note.notes && actions.length === 0) actions.push(i18n.t("dashboard.sections.recent.actions.notesUpdated"));

    return actions.length ? actions.join(" • ") : i18n.t("dashboard.sections.recent.actions.activityLogged");
  };

  const loadDashboardData = useCallback(async () => {
    setLoading(true);

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

      let observedTotal = 0;
      let photographsTotal = 0;
      let sketchesTotal = 0;
      const messierNumbers: number[] = [];
      const activities: ActivityItem[] = [];
      const messierPhoto: number[] = [];
      const messierSketch: number[] = [];
      let notesCount = 0;
      const typeObservedTotals: Record<string, number> = {};
      const typeObservedSets: Record<string, Set<string>> = {};
      const highMagObserved = new Set<string>();
      const highMagPhotographed = new Set<string>();
      const observedPlanets = new Set<string>();
      const objectStatsMap = new Map<string, ObjectObservationStat>();

      if (noteKeys.length) {
        const entries = await AsyncStorage.multiGet(noteKeys);

        entries.forEach(([key, value], index) => {
          const note = safeParseNote(value);
          if (!note) return;

          const { observed, photographed, sketched } = getObservationCounts(note);
          const hasObserved = observed > 0;
          const hasPhotographed = photographed > 0;
          const hasSketched = sketched > 0;
          const objectKey = note.objectId || note.objectName || key;
          const objectName = note.objectName || "Unknown object";
          observedTotal += observed;
          photographsTotal += photographed;
          sketchesTotal += sketched;

          const magnitude = typeof note.magnitude === "number" ? note.magnitude : null;
          if (hasObserved && magnitude !== null && magnitude > 10) highMagObserved.add(objectKey);
          if (hasPhotographed && magnitude !== null && magnitude > 10) highMagPhotographed.add(objectKey);

          const messierNumber = note.messierNumber || parseMessierNumber(note.objectName);
          if (hasObserved && messierNumber) {
            messierNumbers.push(messierNumber);
          }
          if (hasPhotographed && messierNumber) {
            messierPhoto.push(messierNumber);
          }
          if (hasSketched && messierNumber) {
            messierSketch.push(messierNumber);
          }

          if (note.notes && note.notes.trim().length > 0) notesCount += 1;

          const planetName = matchPlanet(note);
          const typeCode = resolveNoteTypeCode(note);
          const typeDetail = detectObservedType(note, typeCode, planetName);
          const safeType: ObservedTypeWithOther = typeDetail ?? "other";
          if (hasObserved) {
            if (!typeObservedSets[safeType]) typeObservedSets[safeType] = new Set<string>();
            typeObservedSets[safeType].add(objectKey);
            if (!typeObservedTotals[safeType]) typeObservedTotals[safeType] = 0;
            typeObservedTotals[safeType] += observed;
          }

          if (hasObserved && (note.objectType === "Planet" || safeType === "planet")) {
            if (planetName && planetName !== "earth") {
              observedPlanets.add(planetName);
            }
          }

          const noteIcon = getActivityIcon(note, typeDetail, planetName, typeCode);
          const existingStat = objectStatsMap.get(objectKey);
          const latestDate = (() => {
            const existingDate = existingStat?.lastUpdated;
            if (!existingDate) return note.updatedAt || null;
            if (!note.updatedAt) return existingDate;
            return dayjs(note.updatedAt).isAfter(dayjs(existingDate)) ? note.updatedAt : existingDate;
          })();

          objectStatsMap.set(objectKey, {
            key: objectKey,
            name: existingStat?.name || objectName,
            type: existingStat?.type || safeType,
            observed: (existingStat?.observed || 0) + observed,
            photographed: (existingStat?.photographed || 0) + photographed,
            sketched: (existingStat?.sketched || 0) + sketched,
            icon: existingStat?.icon || noteIcon,
            lastUpdated: latestDate,
          });

          activities.push({
            id: `${key}-${index}`,
            title: note.objectName || "Unknown object",
            description: buildActivityLabel(note),
            icon: noteIcon,
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
        observed: observedTotal,
        photographs: photographsTotal,
        sketches: sketchesTotal,
      });
      const typeObservedCountsUnique = Object.fromEntries(
        Object.entries(typeObservedSets).map(([type, set]) => [type, set.size])
      );
      setMessierObserved(Array.from(new Set(messierNumbers)));
      setMessierPhotographed(Array.from(new Set(messierPhoto)));
      setMessierSketched(Array.from(new Set(messierSketch)));
      setRecentActivities(activities);
      const plannerCount = parseInt((await getData(storageKeys.dashboardPlannerSearches)) || "0", 10) || 0;
      setPlannerSearchCount(plannerCount);

      const nextMeta = {
        messierObservedCount: new Set(messierNumbers).size,
        messierPhotographedCount: new Set(messierPhoto).size,
        messierSketchedCount: new Set(messierSketch).size,
        typeObservedCounts: typeObservedCountsUnique,
        typeObservedTotals,
        notesCount,
        plannerSearchCount: plannerCount,
        highMagObservedCount: highMagObserved.size,
        highMagPhotographedCount: highMagPhotographed.size,
        observedPlanets: Array.from(observedPlanets),
      };
      setMeta(nextMeta);
      const objectStatsList = Array.from(objectStatsMap.values()).sort(
        (a, b) => (b.observed || 0) - (a.observed || 0)
      );
      setObjectStats(objectStatsList);
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
    typeObservedTotals: meta.typeObservedTotals,
    achievementsCategories,
    latestAchievement,
    objectStats,
    reload: loadDashboardData,
    dsoCatalog,
  };
};
