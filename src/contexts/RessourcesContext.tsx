import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { Ressource } from "../helpers/types/ressources/Ressource";
import { Category } from "../helpers/types/ressources/Category";
import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseCollections } from "../helpers/constants";
import { app } from "../../firebaseConfig";

// Typage explicite du contexte
interface RessourcesContextType {
  ressources: Ressource[];
  categories: Category[];
  ressourcesLoading: boolean;
}

const RessourcesContext = createContext<RessourcesContextType | undefined>(undefined);

export const useRessources = () => {
  const context = useContext(RessourcesContext);
  if (!context) {
    throw new Error('useRessources must be used within a RessourcesContextProvider');
  }
  return context;
}

interface RessourcesContextProviderProps {
  children: ReactNode;
}

export function RessourcesContextProvider({ children }: RessourcesContextProviderProps) {
  const [ressources, setRessources] = useState<Ressource[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ressourcesLoading, setRessourcesLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setRessourcesLoading(true); // Déclenche le chargement
      try {
        const categories = await getCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Error fetching categories: ", error);
      } finally {
        setRessourcesLoading(false); // Termine le chargement après l'opération
      }
    };

    fetchData();
  }, []);

  // https://stackoverflow.com/questions/77466938/firebase-firestore-error-abi49-0-0-com-facebook-react-bridge-readablenativemap
  const getCategories = async () => {
    try {
      console.log('Getting categories');
      const db = getFirestore(app);
      const categoriesCol = collection(db, "Categories");
      const categoriesSnapshot = await getDocs(categoriesCol); // Vérifier cette ligne
      const categoriesList = categoriesSnapshot.docs.map(doc => doc.data());
      return categoriesList as Category[];
    } catch (error) {
      console.error('Error fetching categories: ', error); // Capturer et afficher l'erreur
      return [];
    }
  }

  const getRessources = async () => {
  }

  const values = React.useMemo(() => ({
    ressources,
    categories,
    ressourcesLoading
  }), [ressources, categories, ressourcesLoading]);

  return (
    <RessourcesContext.Provider value={values}>
      {children}
    </RessourcesContext.Provider>
  );
}
