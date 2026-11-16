import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { useUserDataStore } from "../store/userData.store";
import { Telescope } from "../types/gear/Telescope";
import { Eyepiece } from "../types/gear/Eyepiece";
import { Camera } from "../types/gear/Camera";
import { CalculationValues } from "../types/calculations/Calculation";
import { resolveGearValues } from "../helpers/calculations/gearValues";

interface CalculationGearContextValue {
  telescope: Telescope | null;
  eyepiece: Eyepiece | null;
  camera: Camera | null;
  setTelescopeId: (id: string | null) => void;
  setEyepieceId: (id: string | null) => void;
  setCameraId: (id: string | null) => void;
  // Valeurs dérivées du matériel choisi, prêtes à préremplir les champs d'un calcul.
  gearValues: CalculationValues;
}

const CalculationGearContext = createContext<CalculationGearContextValue | null>(null);

// Sélection du matériel ("Mon matériel") pour l'outil Calculs : volontairement non persistée (pas
// de "matériel par défaut" dans l'app, voir gear store) — un choix par session d'utilisation de
// l'outil, partagé entre l'écran principal et chaque fiche de calcul via ce contexte, pour éviter
// de le redemander à chaque écran.
export const CalculationGearProvider = ({ children }: { children: ReactNode }) => {
  const telescopes = useUserDataStore((state) => state.gear.telescopes);
  const eyepieces = useUserDataStore((state) => state.gear.eyepieces);
  const cameras = useUserDataStore((state) => state.gear.cameras);

  const [telescopeId, setTelescopeId] = useState<string | null>(null);
  const [eyepieceId, setEyepieceId] = useState<string | null>(null);
  const [cameraId, setCameraId] = useState<string | null>(null);

  const telescope = telescopes.find((item) => item.id === telescopeId) ?? null;
  const eyepiece = eyepieces.find((item) => item.id === eyepieceId) ?? null;
  const camera = cameras.find((item) => item.id === cameraId) ?? null;

  const gearValues = useMemo(() => resolveGearValues({ telescope, eyepiece, camera }), [telescope, eyepiece, camera]);

  return (
    <CalculationGearContext.Provider
      value={{ telescope, eyepiece, camera, setTelescopeId, setEyepieceId, setCameraId, gearValues }}
    >
      {children}
    </CalculationGearContext.Provider>
  );
};

export const useCalculationGear = (): CalculationGearContextValue => {
  const context = useContext(CalculationGearContext);
  if (!context) throw new Error("useCalculationGear doit être utilisé dans un CalculationGearProvider");
  return context;
};
