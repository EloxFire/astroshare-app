import { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "./LocationContext";
import { getWeather } from "../helpers/api/weather/weather";
import { getAstroConditions } from "../helpers/api/weather/astroConditions";
import { computeNightDerivedData, type ObservabilityNightReference } from "../helpers/weather/nightConditions";
import type { ObservabilityScore } from "../helpers/weather/observabilityScore";
import type { WeatherData } from "../types/weather/Weather";
import type { AstroConditionsData } from "../types/weather/AstroConditions";

// 15 min : les conditions météo n'ont pas besoin d'être plus fraîches que ça pour un score indicatif.
// Même esprit que les rafraîchissements déjà en place ailleurs dans l'app (SpaceWeatherScreen: 5 min
// pour le vent solaire, UsefulNightCard: 1 min pour l'astrométrie) — pas de librairie externe.
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

interface WeatherDataContextValue {
  weather: WeatherData | null;
  astroConditions: AstroConditionsData | null;
  nightConditions: WeatherData | null;
  nightReference: ObservabilityNightReference | null;
  observationScore: ObservabilityScore | null;
  isLoading: boolean;
  refetch: () => void;
}

const WeatherDataContext = createContext<WeatherDataContextValue | null>(null);

export const useWeatherData = (): WeatherDataContextValue => {
  const context = useContext(WeatherDataContext);
  if (!context) throw new Error("useWeatherData doit être utilisé à l'intérieur d'un WeatherDataProvider");
  return context;
}

// Centralise la récupération météo/astro + le calcul du score d'observabilité, pour que n'importe
// quel écran puisse y accéder (via useWeatherData) sans refaire ses propres appels. Dépend de
// LocationContext : doit être monté à l'intérieur de LocationProvider.
export function WeatherDataProvider({ children }: { children: React.ReactNode }) {
  const { location } = useLocation();
  const { i18n } = useTranslation();

  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [astroConditions, setAstroConditions] = useState<AstroConditionsData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    if (!location) return;
    setIsLoading(true);

    // En parallèle : les deux API échouent déjà indépendamment l'une de l'autre (voir
    // observabilityScore.ts), pas besoin de les enchaîner.
    const [wd, ac] = await Promise.all([
      getWeather(location.latitude, location.longitude, i18n.language),
      getAstroConditions(location.latitude, location.longitude),
    ]);

    setWeather(wd);
    setAstroConditions(ac);
    setIsLoading(false);
  }

  // Refait l'appel dès que la position change (GPS ou observatoire sélectionné), puis toutes les
  // 15 min tant que l'app reste ouverte.
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [location?.latitude, location?.longitude]);

  const { nightConditions, nightReference, observationScore } = computeNightDerivedData(weather, astroConditions, location);

  return (
    <WeatherDataContext.Provider value={{
      weather,
      astroConditions,
      nightConditions,
      nightReference,
      observationScore,
      isLoading,
      refetch: fetchData,
    }}>
      {children}
    </WeatherDataContext.Provider>
  );
}
