import React, {ReactNode, createContext, useContext, useEffect, useState, Context} from 'react'
import axios from 'axios'
import { LaunchData } from '../helpers/types/LaunchData'

const LaunchContext: Context<any> = createContext<any>({})

export const useLaunchData = () => {
  return useContext(LaunchContext)
}

interface LaunchContextProviderProps {
  children: ReactNode
}

export function LaunchDataContextProvider({ children }: LaunchContextProviderProps) {

  const [launchData, setLaunchData] = useState<LaunchData[]>([])
  const [launchContextLoading, setLaunchContextLoading] = useState<boolean>(true)

  useEffect(() => {
    getLaunchData()

    const interval = setInterval(() => {
      getLaunchData()
    }, 600000)

    return () => clearInterval(interval)
  }, [])
  
  
  const getLaunchData= async () => {
    setLaunchContextLoading(true)
    try{
      const launchesData = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/launches/upcoming`)
      setLaunchData(launchesData.data.data)
      setLaunchContextLoading(false)
    }catch (e) {
      console.log(e)
      setLaunchContextLoading(false)
    }
  }

  const values = {
    launchData,
    launchContextLoading
  }

  return (
    <LaunchContext.Provider value={values}>
      {children}
    </LaunchContext.Provider>
  )
}
