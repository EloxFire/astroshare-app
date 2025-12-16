import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { DSO } from "../helpers/types/DSO";

const DsoContext = createContext<any>({});

export const useDsoCatalog = () => {
  return useContext(DsoContext);
};

interface DsoContextProviderProps {
  children: ReactNode;
}

export function DsoContextProvider({ children }: DsoContextProviderProps) {
  const [dsoCatalog, setDsoCatalog] = useState<DSO[]>([]);
  const [dsoLoaded, setDsoLoaded] = useState<number>(0);
  const [dsoTotal, setDsoTotal] = useState<number>(0);
  const [dsoLoadedPercentage, setDsoLoadedPercentage] = useState<number>(0);
  const [dsoCatalogLoading, setDsoCatalogLoading] = useState<boolean>(true);

  useEffect(() => {
    getDso();
  }, []);

  const getDso = async () => {
    console.log("Getting DSO with pagination");
    setDsoCatalogLoading(true);

    let allDso: DSO[] = [];
    let currentPage = 1;
    let hasMore = true;

    setDsoCatalogLoading(true);
    try {
      console.log(`Starting to fetch DSO... (This may take a while)`);
      while (hasMore) {
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/dso`,
          {
            params: { page: currentPage }
          }
        );

        const { data, currentPage: page, totalPages, totalDocuments } = response.data;

        allDso = [...allDso, ...data];
        currentPage = page + 1;
        hasMore = page < totalPages;
        setDsoTotal(totalDocuments);
        setDsoLoaded(allDso.length);
        setDsoLoadedPercentage(Math.round((allDso.length / totalDocuments) * 100));
      }

      setDsoCatalog(allDso);
      console.log(`Retrieved ${allDso.length} DSO`);
    } catch (error) {
      console.error("Error fetching DSO:", error);
    } finally {
      setDsoCatalogLoading(false);
    }
  };

  const values = {
    dsoCatalog,
    dsoCatalogLoading,
    dsoLoaded,
    dsoTotal,
    dsoLoadedPercentage
  };

  return <DsoContext.Provider value={values}>{children}</DsoContext.Provider>;
}
