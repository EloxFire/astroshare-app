import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { getObject, storeData } from '../helpers/storage'
import { storageKeys } from '../helpers/constants'
import { LaunchData } from '../helpers/types/LaunchData'
const LaunchContext = createContext<any>({})

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
  }, [])
  
  
  const getLaunchData = async () => {
    setLaunchContextLoading(true)
    const storedData = await getObject(storageKeys.launches.data)
    const lastUpdate = await getObject(storageKeys.launches.lastUpdate)

    // If last update is older than 3 hours, fetch new data
    if(!storedData || !lastUpdate || new Date().getTime() - new Date(lastUpdate).getTime() > 10800000) {
      console.log('Fetching new data');
      
      const data = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/launches`)
      
      setLaunchData(data.data)
      await storeData(storageKeys.launches.lastUpdate, new Date().toISOString())
    }else{
      console.log('Using stored data');
      setLaunchData(storedData)
    }
    setLaunchContextLoading(false)
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
