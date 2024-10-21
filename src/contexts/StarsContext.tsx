import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Star } from '../helpers/types/Star'

const StarsContext = createContext<any>({})

export const useStarCatalog = () => {
  return useContext(StarsContext)
}

interface StarsContextProviderProps {
  children: ReactNode
}

export function StarsContextProvider({ children }: StarsContextProviderProps) {

  const [starsCatalog, setStarsCatalog] = useState<Star[]>([])
  const [starCatalogLoading, setStarCatalogLoading] = useState<boolean>(true)

  useEffect(() => {
    getStars()
  }, [])

  const getStars = async () => {
    console.log("Getting stars")
    const stars = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars`)

    if(stars.data.data.length === 0) {
      setStarCatalogLoading(false)
      return;
    }

    setStarsCatalog(stars.data.data)
    setStarCatalogLoading(false)
  }

  const values = {
    starsCatalog,
    starCatalogLoading
  }

  return (
    <StarsContext.Provider value={values}>
      {children}
    </StarsContext.Provider>
  )
}
