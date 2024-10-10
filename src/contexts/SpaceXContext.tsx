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
    getSpacexData()
    const interval = setInterval(() => {
      getSpacexData()
    }, 300000)

    return () => clearInterval(interval)
  }, [])
  
  
  const getSpacexData = async () => {
    try {
      const constellation = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/spacex/starlink`)
      setConstellation(constellation.data.data)
    } catch (e) {
      console.log("Sartlink constellation get error :", e)
    }
  }

  const values = {
    constellation
  }

  return (
    <SpaceXContext.Provider value={values}>
      {children}
    </SpaceXContext.Provider>
  )
}
