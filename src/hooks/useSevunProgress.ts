import { useState, useEffect, useCallback } from 'react';
import { getData, storeObject } from '../helpers/storage';
import { SevunModuleLevel, SevunProgress } from '../helpers/types/SevunTypes';
import { SEVUN_MODULES } from '../helpers/data/sevunData';

const STORAGE_KEY = '@sevun_progress';

const emptyProgress = (): SevunProgress => ({
  beginner: {},
  intermediate: {},
  advanced: {},
});

export const useSevunProgress = () => {
  const [progress, setProgress] = useState<SevunProgress>(emptyProgress());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getData(STORAGE_KEY).then((raw) => {
      if (raw) {
        try { setProgress(JSON.parse(raw)); } catch {}
      }
      setLoaded(true);
    });
  }, []);

  const toggleResource = useCallback(async (moduleId: SevunModuleLevel, resourceId: string) => {
    setProgress((prev) => {
      const next: SevunProgress = {
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          [resourceId]: !prev[moduleId][resourceId],
        },
      };
      storeObject(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const isResourceCompleted = useCallback(
    (moduleId: SevunModuleLevel, resourceId: string) =>
      !!progress[moduleId]?.[resourceId],
    [progress],
  );

  const moduleCompletedCount = useCallback(
    (moduleId: SevunModuleLevel) =>
      Object.values(progress[moduleId] || {}).filter(Boolean).length,
    [progress],
  );

  const isModuleCompleted = useCallback(
    (moduleId: SevunModuleLevel) => {
      const mod = SEVUN_MODULES.find((m) => m.id === moduleId);
      if (!mod) return false;
      return mod.resources.every((r) => !!progress[moduleId]?.[r.id]);
    },
    [progress],
  );

  return { progress, loaded, toggleResource, isResourceCompleted, moduleCompletedCount, isModuleCompleted };
};
