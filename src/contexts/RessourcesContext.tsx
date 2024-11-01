import React, {ReactNode, createContext, useContext, useEffect, useState, useMemo} from 'react'
import { Ressource } from "../helpers/types/ressources/Ressource";
import { Category } from "../helpers/types/ressources/Category";
import { collection, getDocs, getFirestore } from 'firebase/firestore/lite';
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
        const categories: Category[] = await getCategories();
        const ressources: Ressource[] = await getRessources();

        setRessources(ressources);
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
  // WORKAROUND by ChatGPT : Firebase en mode lite. Par contre, c'est de la lecture seule
  const getCategories = async () => {
    try {
      console.log('Getting categories');
      const db = getFirestore(app);
      const categoriesCol = collection(db, firebaseCollections.categories);
      const categoriesSnapshot = await getDocs(categoriesCol);
      const categoriesList = categoriesSnapshot.docs.map(doc => doc.data());
      return categoriesList as Category[];
    } catch (error) {
      console.error('Error fetching categories: ', error);
      return [];
    }
  }

  const getRessources = async () => {
    try {
      console.log('Getting all ressources');
      const db = getFirestore(app);
      const ressourcesCol = collection(db, firebaseCollections.ressources);
      const ressourcesSnapshot = await getDocs(ressourcesCol);
      const ressourcesList = ressourcesSnapshot.docs.map(doc => doc.data());
      return ressourcesList as Ressource[];
    } catch (error) {
      console.error('Error fetching ressources: ', error);
      return [];
    }
  }

  const values = useMemo(() => ({
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
