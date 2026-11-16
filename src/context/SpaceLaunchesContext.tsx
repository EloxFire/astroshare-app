import { createContext, useContext, useEffect, useState } from "react";
import { getUpcomingLaunches } from "../helpers/api/launches/launches";
import { Launch } from "../types/spaceLaunches/Launch";

// Même cadence que WeatherDataContext : la liste des 30 prochains lancements ne justifie pas un
// rafraîchissement plus agressif.
const REFRESH_INTERVAL_MS = 15 * 60 * 1000;

interface SpaceLaunchesContextValue {
  launches: Launch[] | null;
  isLoading: boolean;
  getLaunchById: (id: string) => Launch | undefined;
  refetch: () => void;
}

const SpaceLaunchesContext = createContext<SpaceLaunchesContextValue | null>(null);

export const useSpaceLaunches = (): SpaceLaunchesContextValue => {
  const context = useContext(SpaceLaunchesContext);
  if (!context) throw new Error("useSpaceLaunches doit être utilisé à l'intérieur d'un SpaceLaunchesProvider");
  return context;
}

// Un seul appel pour tout l'outil : /v3/launches/upcoming n'a pas de route /:id (chaque lancement
// de la liste est déjà l'objet le plus riche du domaine), donc la fiche détail se dérive de cette
// même liste (getLaunchById) plutôt que de refaire un appel. Monté au niveau du Stack de l'outil
// (app/tools/space-launches/_layout.tsx), pas à la racine : ces données ne servent qu'ici.
export function SpaceLaunchesProvider({ children }: { children: React.ReactNode }) {
  const [launches, setLaunches] = useState<Launch[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoading(true);
    const data = await getUpcomingLaunches();
    setLaunches(data);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const getLaunchById = (id: string) => launches?.find((launch) => launch.id === id);

  return (
    <SpaceLaunchesContext.Provider value={{ launches, isLoading, getLaunchById, refetch: fetchData }}>
      {children}
    </SpaceLaunchesContext.Provider>
  );
}
