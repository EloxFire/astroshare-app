import { createContext, useContext, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { Observatory } from "../../../../types/observatory";

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
  const [currentFormStep, setCurrentFormStep] = useState<number>(1);

  const [newObservatory, setNewObservatory] = useState<Observatory | null>(null);
  
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
