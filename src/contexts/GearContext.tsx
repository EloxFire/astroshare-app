import React, {ReactNode, createContext, useContext, useEffect, useState, Context} from 'react'
import axios from 'axios'
import { LaunchData } from '../helpers/types/LaunchData'
import {getData, removeData, storeData} from "../helpers/storage";
import {storageKeys} from "../helpers/constants";
import dayjs, {Dayjs} from "dayjs";
import { useSettings } from './AppSettingsContext';
import { useAuth } from './AuthContext';
import { Telescope } from '../helpers/types/gear/Telescope';
import { Mount } from '../helpers/types/gear/Mount';
import { Camera } from '../helpers/types/gear/Camera';
import { Eyepiece } from '../helpers/types/gear/Eyepiece';

const AstroGearContext: Context<any> = createContext<any>({})

export const useAstroGear = () => {
  return useContext(AstroGearContext)
}

interface AstroGearContextProviderProps {
  children: ReactNode
}

interface CurrentAstroGearContextValue {
  telescope: string | null,
  mount: string | null,
  camera: string | null,
  eyepiece: string | null,
}

export function AstroGearContextProvider({ children }: AstroGearContextProviderProps) {

  const {currentUser} = useAuth()
  const [currentGear, setCurrentGear] = useState<CurrentAstroGearContextValue | null>({
    telescope: null,
    mount: null,
    camera: null,
    eyepiece: null,
  })

  useEffect(() => {
    if(!currentUser) {
      console.log(`[AstroGearContext] No current user, skipping gear fetching.`);
      return;
    }

    (async () => {
      console.log(`[AstroGearContext] Fetching current gear for user ${currentUser.uid}...`);

      const scope = await getData(storageKeys.userGear.currentTelescope + currentUser.uid);
      const mount = await getData(storageKeys.userGear.currentMount + currentUser.uid);
      const camera = await getData(storageKeys.userGear.currentCamera + currentUser.uid);
      const eyepiece = await getData(storageKeys.userGear.currentEyepiece + currentUser.uid);

      console.log(`[AstroGearContext] Current gear fetched:`, {scope, mount, camera, eyepiece});

      setCurrentGear({
        telescope: scope || null,
        mount: mount || null,
        camera: camera || null,
        eyepiece: eyepiece || null,
      })
    })()
  }, [currentUser])

  const updateCurrentTelescope = (telescope: Telescope) => {
    if(telescope === null){
      console.log(`[AstroGearContext] Clearing current telescope selection.`);
      removeData(storageKeys.userGear.currentTelescope + currentUser?.uid)
      setCurrentGear((prevGear: any) => ({
        ...prevGear,
        telescope: null,
      }))
      return;
    }else{
      console.log(`[AstroGearContext] Updating current telescope:`, telescope.name);
      storeData(storageKeys.userGear.currentTelescope + currentUser?.uid, telescope.id)
      setCurrentGear((prevGear: any) => ({
        ...prevGear,
        telescope: telescope.id,
      }))
    }
  }

  const updateCurrentMount = (mount: Mount) => {
    console.log(`[AstroGearContext] Updating current mount:`, mount.name);
    storeData(storageKeys.userGear.currentMount + currentUser?.uid, mount.id)
    setCurrentGear((prevGear: any) => ({
      ...prevGear,
      mount: mount.id,
    }))
  }

  const updateCurrentCamera = (camera: Camera) => {
    console.log(`[AstroGearContext] Updating current camera:`, camera.name);
    storeData(storageKeys.userGear.currentCamera + currentUser?.uid, camera.id)
    setCurrentGear((prevGear: any) => ({
      ...prevGear,
      camera: camera.id,
    }))
  }

  const updateCurrentEyepiece = (eyepiece: Eyepiece) => {
    console.log(`[AstroGearContext] Updating current eyepiece:`, eyepiece.name);
    storeData(storageKeys.userGear.currentEyepiece + currentUser?.uid, eyepiece.id)
    setCurrentGear((prevGear: any) => ({
      ...prevGear,
      eyepiece: eyepiece.id,
    }))
  }

  const values = {
    currentGear,
    updateCurrentTelescope,
    updateCurrentMount,
    updateCurrentCamera,
    updateCurrentEyepiece,
  }

  return (
    <AstroGearContext.Provider value={values}>
      {children}
    </AstroGearContext.Provider>
  )
}
