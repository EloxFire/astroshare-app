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
