import { useEffect, useState } from "react";
import { useUserDataStore } from "../store/userData.store";
import { syncLanguageWithStore } from "./index";

// `true` une fois que la langue persistée (UserSettingsData.locale) a été relue et
// appliquée à i18next — à utiliser pour retarder le premier rendu, comme useAppFonts,
// afin d'éviter un flash dans la mauvaise langue le temps que la réhydratation
// Zustand/AsyncStorage se termine.
export const useI18nReady = (): boolean => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const finish = () => {
      syncLanguageWithStore().finally(() => {
        if (!cancelled) setReady(true);
      });
    };

    if (useUserDataStore.persist.hasHydrated()) {
      finish();
      return;
    }

    const unsubscribe = useUserDataStore.persist.onFinishHydration(finish);
    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  return ready;
};
