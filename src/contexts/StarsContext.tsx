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

  useEffect(() => {
    getStars()
  }, [])

  const getStars = async () => {
    const stars = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars`)

    if(stars.data.data.length === 0) return

    setStarsCatalog(stars.data.data)
  }

  const values = {
    starsCatalog
  }

  return (
    <StarsContext.Provider value={values}>
      {children}
    </StarsContext.Provider>
  )
}
