import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { useLocation } from "../../../../context/GpsContext";
import { GpsLocation } from "../../../../types/gpsLocation";
import { Observatory } from "../../../../types/observatory";

// Id local temporaire pour un observatoire pas encore enregistré — pas besoin d'un vrai UUID
// cryptographique ici, donc pas besoin de uuid/react-native-get-random-values (qui nécessite un
// module natif absent d'Expo Go et d'un rebuild sinon). Horodatage + suffixe aléatoire suffisent
// largement pour une clé unique côté client.
const generateLocalId = (): string => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

interface AddObservatoryFormContextValue {
  currentFormStep: number;
  setCurrentFormStep: (step: number) => void;
  newObservatory: Observatory | null;
  setNewObservatory: (observatory: Observatory | null) => void;
}

const AddObservatoryFormContext = createContext<AddObservatoryFormContextValue | null>(null);

export const useAddObservatoryForm = (): AddObservatoryFormContextValue => {
  const context = useContext(AddObservatoryFormContext);
  if (!context) {
    throw new Error("useAddObservatoryForm doit être utilisé à l'intérieur d'un AddObservatoryFormProvider");
  }
  return context;
};

// État et handlers partagés par StepOne / StepTwo — repris tels quels depuis
// AddNewObservatoryScreen.tsx, seulement déplacés ici pour éviter le prop drilling.
export const AddObservatoryFormProvider = ({ children }: { children: ReactNode }) => {
  const { location }: { location: GpsLocation } = useLocation();
  const [currentFormStep, setCurrentFormStep] = useState<number>(1);

  const [newObservatory, setNewObservatory] = useState<Observatory | null>(null);
  
  useEffect(() => {
    if(location){
      setNewObservatory({
        id: generateLocalId(),
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name || "",
        elevation: location.elevation,
        light_pollution: location.light_pollution,
      });
    }
  }, [])

  return (
    <AddObservatoryFormContext.Provider
      value={{
        currentFormStep,
        setCurrentFormStep,
        newObservatory,
        setNewObservatory,
      }}
    >
      {children}
    </AddObservatoryFormContext.Provider>
  );
};
