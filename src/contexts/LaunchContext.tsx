import React, {ReactNode, createContext, useContext, useEffect, useState, Context} from 'react'
import axios from 'axios'
import { LaunchData } from '../helpers/types/LaunchData'
import {storeData} from "../helpers/storage";
import {storageKeys} from "../helpers/constants";
import dayjs, {Dayjs} from "dayjs";
import { useSettings } from './AppSettingsContext';

const LaunchContext: Context<any> = createContext<any>({})

export const useLaunchData = () => {
  return useContext(LaunchContext)
}

interface LaunchContextProviderProps {
  children: ReactNode
}

export function LaunchDataContextProvider({ children }: LaunchContextProviderProps) {

  const {handleApiReachability} = useSettings()

  const [launchData, setLaunchData] = useState<LaunchData[]>([])
  const [launchContextLoading, setLaunchContextLoading] = useState<boolean>(true)
  const [launchDataLastUpdate, setLaunchDataLastUpdate] = useState<Dayjs>(dayjs())

  useEffect(() => {
    getLaunchData()

    const interval = setInterval(() => {
      getLaunchData()
    }, 300000)

    return () => clearInterval(interval)
  }, [])
  
  
  const getLaunchData= async () => {
    setLaunchContextLoading(true)
    setLaunchData([]);
    try{
      const launchesData = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/launches/upcoming`)
      setLaunchData(launchesData.data.data)
      setLaunchContextLoading(false)
      setLaunchDataLastUpdate(dayjs())
    }catch (e) {
      console.log('[Launch Data] Error fetching launch data:', e)
      handleApiReachability(false)
      setLaunchContextLoading(false)
    }
  }

  const values = {
    launchData,
    launchContextLoading,
    launchDataLastUpdate
  }

  return (
    <LaunchContext.Provider value={values}>
      {children}
    </LaunchContext.Provider>
  )
}
