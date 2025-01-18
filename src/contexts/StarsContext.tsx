import React, { ReactNode, createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { Star } from "../helpers/types/Star";

const StarsContext = createContext<any>({});

export const useStarCatalog = () => {
  return useContext(StarsContext);
};

interface StarsContextProviderProps {
  children: ReactNode;
}

export function StarsContextProvider({ children }: StarsContextProviderProps) {
  const [starsCatalog, setStarsCatalog] = useState<Star[]>([]);
  const [starsLoaded, setStarsLoaded] = useState<number>(0);
  const [starsTotal, setStarsTotal] = useState<number>(0);
  const [starsLoadedPercentage, setStarsLoadedPercentage] = useState<number>(0);
  const [starCatalogLoading, setStarCatalogLoading] = useState<boolean>(true);

  useEffect(() => {
    getStars();
  }, []);

  const getStars = async () => {
    console.log("Getting stars with pagination");
    setStarCatalogLoading(true);

    let allStars: Star[] = [];
    let currentPage = 1;
    let hasMore = true;

    setStarCatalogLoading(true);
    try {
      while (hasMore) {
        console.log(`Fetching page ${currentPage}`);
        const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars`,
          {
            params: { maxMag: 10, page: currentPage },
          }
        );

        const { data, currentPage: page, totalPages, totalDocuments } = response.data;

        allStars = [...allStars, ...data];
        currentPage = page + 1;
        hasMore = page < totalPages;
        setStarsTotal(totalDocuments);
        setStarsLoaded(allStars.length);
        setStarsLoadedPercentage(Math.round((allStars.length / totalDocuments) * 100));
      }

      setStarsCatalog(allStars);
      console.log(`Retrieved ${allStars.length} stars`);
    } catch (error) {
      console.error("Error fetching stars:", error);
    } finally {
      setStarCatalogLoading(false);
    }
  };

  const values = {
    starsCatalog,
    starCatalogLoading,
    starsLoaded,
    starsTotal,
    starsLoadedPercentage
  };

  return <StarsContext.Provider value={values}>{children}</StarsContext.Provider>;
}