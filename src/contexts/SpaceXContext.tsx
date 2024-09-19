import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
const SpaceXContext = createContext<any>({})

export const useSpacex = () => {
  return useContext(SpaceXContext)
}

interface SpaceXContextProviderProps {
  children: ReactNode
}

export function SpaceXContextProvider({ children }: SpaceXContextProviderProps) {

  const [constellation, setConstellation] = useState<any>([])

  useEffect(() => {
    (async () => {
      const constellation = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/spacex/starlink`)
      setConstellation(constellation.data.data)      
    })()
  }, [])

  const values = {
    constellation
  }

  return (
    <SpaceXContext.Provider value={values}>
      {children}
    </SpaceXContext.Provider>
  )
}
