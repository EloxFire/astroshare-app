import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { LocationObject } from '../helpers/types/LocationObject'
import { askLocationPermission } from '../helpers/scripts/permissions/askLocationPermission'
import { Dimensions, View } from 'react-native'
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../helpers/api/getLocationFromCoords'
import { showToast } from '../helpers/scripts/showToast'
import { app_colors, storageKeys } from '../helpers/constants'
import { getData, storeData } from '../helpers/storage'
import { isFirstLaunch } from '../helpers/scripts/checkFirstLaunch'
import * as Location from 'expo-location'
import Toast from 'react-native-root-toast';
import NetInfo from '@react-native-community/netinfo';
import { HomeWidget } from '../helpers/types/HomeWidget'
import {sendAnalyticsEvent} from "../helpers/scripts/analytics";
import {useAuth} from "./AuthContext";
import {useTranslation} from "../hooks/useTranslation";
import {eventTypes} from "../helpers/constants/analytics";

const AppSettingsContext = createContext<any>({})

export const useSettings = () => {
  return useContext(AppSettingsContext)
}

interface AppSettingsProviderProps {
  children: ReactNode
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {

  const [isNightMode, setIsNightMode] = useState<boolean>(false)

  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  // Location related states
  const [locationPermissions, setLocationPermissions] = useState<boolean>(false)
  const [currentUserLocation, setCurrentUserLocation] = useState<LocationObject | null>(null)
  const [locationLoading, setLocationLoading] = useState<boolean>(true)
  const [currentUserHorizon, setCurrentUserHorizon] = useState<number>(0)
  const [isCellularDataEnabled, setIsCellularDataEnabled] = useState<boolean>(true)
  const [hasInternetConnection, setHasInternetConnection] = useState<boolean>(false)
  const [selectedHomeWidget, setSelectedHomeWidget] = useState<HomeWidget>('None' as HomeWidget)
  const [homeNewsBannerVisible, setHomeNewsBannerVisible] = useState<boolean>(true)

  useEffect(() => {
    (async () => {
      const cellularData = await getData('cellularData');
      if (!cellularData) {
        await storeData('cellularData', 'true');
      }
      setIsCellularDataEnabled(cellularData === 'true');
      const nightMode = await getData('nightMode');
      setIsNightMode(nightMode === 'true');
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const launchStatus = await isFirstLaunch();
      console.log('First launch : ', launchStatus);

      if (launchStatus) {
        return;
      }
      // Get user current position
      await refreshCurrentUserLocation();
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setHasInternetConnection(!!state.isConnected);
    });

    return () => {
      unsubscribe()
    }
  }, [])

  useEffect(() => {
    (async () => {
      const sw = await getData(storageKeys.homeWidgets)
      if (!sw) {
        await storeData(storageKeys.homeWidgets, 'None');
      } else {
        setSelectedHomeWidget(sw as HomeWidget);
      }
    })()
  }, [])

  // SETUP USER NOTIFICATIONS
  useEffect(() => {
    if(currentUserLocation){
      (async () => {
        const hasNotificationsSetup = await getData(storageKeys.notificationsId);
        if(!hasNotificationsSetup){

        }
      })()
    }
  }, [currentUserLocation])

  const updateSelectedHomeWidget = async (widget: HomeWidget) => {
    await storeData(storageKeys.homeWidgets, widget);
    setSelectedHomeWidget(widget);
    sendAnalyticsEvent(currentUser, currentUserLocation, 'update_home_widget', eventTypes.BUTTON_CLICK, {selectedHomeWidget: widget}, currentLocale);
  }

  const refreshCurrentUserLocation = async () => {
    setLocationLoading(true);
    // Check if location permission is granted
    const hasLocationPermission = await askLocationPermission();
    sendAnalyticsEvent(currentUser, currentUserLocation, 'refresh_user_location', eventTypes.BUTTON_CLICK, {}, currentLocale);
    if (!hasLocationPermission) {
      setLocationLoading(false);
      showToast({ message: 'Vous devez autoriser l\'accès à la localisation pour utiliser l\'application', duration: Toast.durations.LONG, type: 'error' });
      return;
    }

    setLocationPermissions(true);

    try {
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
      const coords: LocationObject = { lat: location.coords.latitude, lon: location.coords.longitude }

      let name = await getLocationName(coords);

      const userCoords: LocationObject = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        common_name: name.local_names ? name.local_names.fr : name.name,
        country: name.country,
        state: name.state,
        dms: convertDDtoDMS(location.coords.latitude, location.coords.longitude)
      }

      setCurrentUserLocation(userCoords);
      setCurrentUserHorizon(90 - userCoords.lat)
      setLocationLoading(false);
      sendAnalyticsEvent(currentUser, userCoords, 'user_location_acquired', eventTypes.DATA_ACQUISITION, {}, currentLocale);
    } catch (error) {
      console.log("Error while getting location name : ", error);

      showToast({ message: 'Erreur lors de l\'acquisition de votre position', duration: Toast.durations.LONG, type: 'error' });
      setLocationLoading(false);
    }
  }

  const handleCellularData = () => {
    setIsCellularDataEnabled(!isCellularDataEnabled);
    storeData('cellularData', !isCellularDataEnabled ? 'true' : 'false');
    sendAnalyticsEvent(currentUser, currentUserLocation, 'toggle_cellular_data', eventTypes.BUTTON_CLICK, {isCellularDataEnabled: !isCellularDataEnabled}, currentLocale);
  }

  const handleNightMode = () => {
    setIsNightMode(!isNightMode);
    storeData('nightMode', !isNightMode ? 'true' : 'false');
    sendAnalyticsEvent(currentUser, currentUserLocation, 'toggle_night_mode', eventTypes.BUTTON_CLICK, {isNightMode: !isNightMode}, currentLocale);
  }

  const handleHomeNewsBanner = () => {
    setHomeNewsBannerVisible(!homeNewsBannerVisible);
    storeData(storageKeys.homeNewsBannerVisible, !homeNewsBannerVisible ? 'true' : 'false');
    sendAnalyticsEvent(currentUser, currentUserLocation, 'toggle_home_news_banner', eventTypes.BUTTON_CLICK, {homeNewsBannerVisible: !homeNewsBannerVisible}, currentLocale);
  }

  const values = {
    isNightMode,
    handleNightMode,
    currentUserLocation,
    refreshCurrentUserLocation,
    setCurrentUserLocation,
    locationPermissions,
    locationLoading,
    currentUserHorizon,
    isCellularDataEnabled,
    handleCellularData,
    hasInternetConnection,
    selectedHomeWidget,
    updateSelectedHomeWidget,
    homeNewsBannerVisible,
    handleHomeNewsBanner,
  }

  return (
    <AppSettingsContext.Provider value={values}>
      {children}
      {
        isNightMode && (
          <View
            pointerEvents='none'
            style={{
              backgroundColor: app_colors.red_twenty,
              height: Dimensions.get('screen').height,
              width: Dimensions.get('screen').width,
              position: 'absolute',
              zIndex: 999,
            }}
          />
        )
      }
    </AppSettingsContext.Provider>
  )
}
