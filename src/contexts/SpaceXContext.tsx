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
  const [nextStarlinkLaunches, setNextStarlinkLaunches] = useState<[]>([])

  useEffect(() => {
    getSpacexData()
    const interval = setInterval(() => {
      getSpacexData()
    }, 300000)

    return () => clearInterval(interval)
  }, [])
  
  
  const getSpacexData = async () => {
    const constellation = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/spacex/starlink`)
    const sl = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/spacex/starlink/launches/next`)    
    setNextStarlinkLaunches(sl.data.data.results)
    setConstellation(constellation.data.data)
  }

  const values = {
    constellation,
    nextStarlinkLaunches
  }

  return (
    <SpaceXContext.Provider value={values}>
      {children}
    </SpaceXContext.Provider>
  )
}
