import React, { useEffect, useMemo, useRef, useState } from 'react'
import {ActivityIndicator, ScrollView, Text, View} from 'react-native'
import { getCountryByCode } from '../../helpers/scripts/utils/getCountryByCode'
import { i18n } from '../../helpers/scripts/i18n'
import { useTranslation } from '../../hooks/useTranslation'
import { globalStyles } from '../../styles/global'
import {app_colors, storageKeys} from '../../helpers/constants'
import { mapStyle } from '../../helpers/mapJsonStyle'
import {useSettings} from "../../contexts/AppSettingsContext";
import {SatellitePass} from "../../helpers/types/IssPass";
import {useAuth} from "../../contexts/AuthContext";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";
import { getLocationName } from '../../helpers/api/getLocationFromCoords'
import { LocationObject } from '../../helpers/types/LocationObject'
import { getWeather } from '../../helpers/api/getWeather'
import { getTimeFromLaunch } from '../../helpers/scripts/utils/getTimeFromLaunch'
import { satelliteTrackerStyles } from '../../styles/screens/satelliteTracker/satelliteTrackerStyles'
import { KNOWN_NORAD_IDS } from '../../helpers/constants/norad'
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords'
import { useLaunchData } from '../../contexts/LaunchContext'
import { LaunchData } from '../../helpers/types/LaunchData'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import PageTitle from '../../components/commons/PageTitle'
import DSOValues from '../../components/commons/DSOValues'
import getCountryFlag from 'country-flag-icons/unicode'
import SimpleButton from '../../components/commons/buttons/SimpleButton'
import dayjs from 'dayjs'
import SatellitePassCard from '../../components/cards/SatellitePassCard'
import LaunchCard from '../../components/cards/LaunchCard'

export default function SatelliteTrackerDetails({ route, navigation }: any) {

  const {currentLocale} = useTranslation()
  const {currentUserLocation} = useSettings()
  const {currentUser} = useAuth()
  const {launchData} = useLaunchData()
  const { noradId } = route.params;

  const mapRef = useRef(null)

  const [satellitePasses, setSatellitePasses] = useState<SatellitePass[]>([])
  const [satellitePassesLoading, setSatellitePassesLoading] = useState<boolean>(true)
  const [satelliteInfosLoading, setSatelliteInfosLoading] = useState<boolean>(true)
  const [satellitePassesWeather, setSatellitePassesWeather] = useState<any>(null)
  const [countdown, setCountdown] = useState<string>('00:00:00')
  const [tleInfo, setTleInfo] = useState<any>(null)
  const [positions, setPositions] = useState<any[]>([])
  const [currentCountry, setCurrentCountry] = useState<any>(null)
  const [hasLoadedInitialData, setHasLoadedInitialData] = useState<boolean>(false)

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Satellite Tracker Details Screen View', eventTypes.SCREEN_VIEW, {noradId}, currentLocale)
  }, [])

  useEffect(() => {
      // Get weather for the pass
      if(!currentUserLocation) return;
      (async () => {
        const weather = await getWeather(currentUserLocation.lat, currentUserLocation.lon)
        setSatellitePassesWeather(weather.daily)
      })()
    }, [currentUserLocation])


  useEffect(() => {
    if (!currentUserLocation || !noradId) return

    let isMounted = true

    const fetchInitialData = async () => {
      try {
        setSatelliteInfosLoading(true)
        setSatellitePassesLoading(true)

        const [tleResponse, positionResponse, passesResponse] = await Promise.all([
          fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/satellite?noradId=${noradId}`),
          fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/satellite/position?noradId=${noradId}&lat=${currentUserLocation.lat}&lon=${currentUserLocation.lon}`),
          fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/satellite/passes?noradId=${noradId}&lat=${currentUserLocation.lat}&lon=${currentUserLocation.lon}`)
        ])

        const [tleData, positionData, satelliteNextPassesData] = await Promise.all([
          tleResponse.json(),
          positionResponse.json(),
          passesResponse.json()
        ])

        if (!isMounted) return

        setTleInfo(tleData.data)
        setPositions(positionData.data.positions || [])
        setSatellitePasses(satelliteNextPassesData.passes || [])
        setSatellitePassesLoading(false)

        const firstPosition = positionData.data.positions?.[0]

        if (firstPosition) {
          const locObject: LocationObject = {
            lat: firstPosition.satlatitude,
            lon: firstPosition.satlongitude,
          }

          if(mapRef.current){
            // @ts-ignore
            mapRef.current.animateToRegion({
              latitude: firstPosition.satlatitude,
              longitude: firstPosition.satlongitude,
              latitudeDelta: 0,
              longitudeDelta: 1000,
            }, 1000);
          }

          const locationName = await getLocationName(locObject)
          if (!isMounted) return
          setCurrentCountry(locationName)
        } else {
          setCurrentCountry(null)
        }

        if (isMounted) {
          setSatelliteInfosLoading(false)
          setHasLoadedInitialData(true)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error fetching Satellite data:', error)
          setSatelliteInfosLoading(false)
          setSatellitePassesLoading(false)
        }
      }
    }

    fetchInitialData()

    return () => {
      isMounted = false
    }
  }, [currentUserLocation, noradId])

  useEffect(() => {
    if (!currentUserLocation || !hasLoadedInitialData || !noradId) return

    let isMounted = true

    const fetchLatestPosition = async () => {
      try {
        const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/satellite/position?noradId=${noradId}&lat=${currentUserLocation.lat}&lon=${currentUserLocation.lon}`)
        const positionData = await response.json()
        if (!isMounted) return

        const latestPositions = positionData.data.positions || []
        setPositions(latestPositions)

        const currentPosition = latestPositions[0]
        if (currentPosition) {
          const locObject: LocationObject = {
            lat: currentPosition.satlatitude,
            lon: currentPosition.satlongitude,
          }
          const locationName = await getLocationName(locObject)
          if (!isMounted) return
          setCurrentCountry(locationName)
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error updating satellite position:', error)
        }
      }
    }

    const interval = setInterval(fetchLatestPosition, 10000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [currentUserLocation, noradId, hasLoadedInitialData])

  const satelliteInfos = useMemo(() => {
    if (!tleInfo || positions.length === 0 || !currentCountry) return null

    const [currentPosition, ...nextPositions] = positions

    return {
      name: tleInfo.info?.satname,
      tle: tleInfo.tle,
      currentPosition,
      currentCountry,
      nextPositions,
    }
  }, [currentCountry, positions, tleInfo])

  useEffect(() => {
    if(satellitePasses.length > 0){
      console.log(satellitePasses[0].startUTC)
      setCountdown(getTimeFromLaunch(dayjs.unix(satellitePasses[0].startUTC).toDate()))

      const interval = setInterval(() => {
        setCountdown(getTimeFromLaunch(dayjs.unix(satellitePasses[0].startUTC).toDate()))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [satellitePasses])

  const centerSatelliteOnMap = (mapRef: any, satelliteInfos: any) => {
    if (mapRef.current && satelliteInfos) {
      mapRef.current.animateToRegion({
        latitude: satelliteInfos.currentPosition.satlatitude,
        longitude: satelliteInfos.currentPosition.satlongitude,
        latitudeDelta: 0,
        longitudeDelta: 1000,
      }, 1000);
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t(`satelliteTrackers.home.buttons.${noradId}.title`, {defaultValue: satelliteInfos ? satelliteInfos.name : '', name: KNOWN_NORAD_IDS[noradId as keyof typeof KNOWN_NORAD_IDS]})}
        subtitle={i18n.t(`satelliteTrackers.home.buttons.${noradId}.subtitle`, {defaultValue: 'NORAD ID : ' + noradId})}
      />
        <View style={globalStyles.screens.separator} />
        <ScrollView>
        <View style={satelliteTrackerStyles.content}>
            <View style={satelliteTrackerStyles.content.liveStats}>
              <Text style={satelliteTrackerStyles.content.liveStats.title}>{!satelliteInfos ? <ActivityIndicator size={'small'} color={app_colors.white} animating /> : satelliteInfos.name}</Text>
              <Text style={satelliteTrackerStyles.content.liveStats.subtitle}>{i18n.t('satelliteTrackers.details.2dMap.subtitle')}</Text>
              <DSOValues title={i18n.t('satelliteTrackers.details.stats.latitude')} value={satelliteInfos && !satelliteInfosLoading ? convertDDtoDMS(satelliteInfos.currentPosition.satlatitude, satelliteInfos.currentPosition.satlongitude).dms_lat : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTrackers.details.stats.longitude')} value={satelliteInfos && !satelliteInfosLoading ? convertDDtoDMS(satelliteInfos.currentPosition.satlatitude, satelliteInfos.currentPosition.satlongitude).dms_lon : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTrackers.details.stats.altitude')} value={satelliteInfos && !satelliteInfosLoading ? `${satelliteInfos.currentPosition.sataltitude} Km` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTrackers.details.stats.country')} value={satelliteInfos && !satelliteInfosLoading ? `${getCountryByCode(satelliteInfos.currentCountry.country, currentLocale)} - ${getCountryFlag(satelliteInfos.currentCountry.country === i18n.t('satelliteTrackers.details.stats.unknown') ? 'ZZ' : satelliteInfos.currentCountry.country)}` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
            </View>
            
            <View style={satelliteTrackerStyles.content.mapContainer}>
              <Text style={satelliteTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTrackers.details.2dMap.title')}</Text>
              <Text style={satelliteTrackerStyles.content.liveStats.subtitle}>{i18n.t('satelliteTrackers.details.2dMap.subtitle')}</Text>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <SimpleButton
                  text={i18n.t('satelliteTrackers.details.2dMap.button')}
                  onPress={() => {centerSatelliteOnMap(mapRef, satelliteInfos)}}
                  icon={require('../../../assets/icons/FiIss.png')}
                  textColor={app_colors.white}
                  align={'center'}
                />
              </View>
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={satelliteTrackerStyles.content.mapContainer.map}
                customMapStyle={mapStyle}
                initialRegion={{
                  latitude: satelliteInfos ? satelliteInfos.currentPosition.satlatitude : 0,
                  longitude: satelliteInfos ? satelliteInfos.currentPosition.satlongitude : 0,
                  latitudeDelta: 0,
                  longitudeDelta: 1000,
                }}
                rotateEnabled={false}
                cameraZoomRange={{ minCenterCoordinateDistance: 1000 }}
              >
                {
                  satelliteInfos &&
                  <Marker
                    coordinate={{
                      latitude: satelliteInfos.currentPosition.satlatitude,
                      longitude: satelliteInfos.currentPosition.satlongitude,
                    }}
                    title='CSS'
                    description={satelliteInfos.name}
                    image={require('../../../assets/icons/FiIssSmall.png')}
                    anchor={{ x: 0.5, y: 0.5 }}
                    centerOffset={{ x: 0.5, y: 0.5 }}
                  />

                }
                {
                  satelliteInfos &&
                  <Circle
                    center={{
                      latitude: satelliteInfos.currentPosition.satlatitude,
                      longitude: satelliteInfos.currentPosition.satlongitude,
                    }}
                    radius={1200000}
                    fillColor={app_colors.white_twenty}
                    strokeColor={app_colors.white_forty}
                  />
                }
                {
                  satelliteInfos &&
                  <Polyline
                    coordinates={satelliteInfos.nextPositions.map((pos: any) => ({
                      latitude: pos.satlatitude,
                      longitude: pos.satlongitude,
                    }))}
                    strokeColor={app_colors.red}
                    strokeWidth={1}
                    geodesic={true}
                  />
                }
              </MapView>
            </View>

            <View style={satelliteTrackerStyles.content.nextPasses}>
              <Text style={satelliteTrackerStyles.content.nextPasses.title}>{i18n.t('satelliteTrackers.details.nextPasses.title')}</Text>
              <Text style={satelliteTrackerStyles.content.nextPasses.subtitle}>{i18n.t('satelliteTrackers.details.nextPasses.subtitle')}{currentUserLocation.common_name}</Text>
              <View style={satelliteTrackerStyles.content.nextPasses.container}>
                {
                  satellitePasses.length > 0 && !satellitePassesLoading &&
                    <DSOValues title={i18n.t("satelliteTrackers.details.nextPasses.timeToNext")} value={countdown}/>
                }

                {
                  satellitePassesLoading &&
                    <ActivityIndicator size={'small'} color={app_colors.white} animating />
                }

                {
                  !satellitePassesLoading && satellitePasses.length > 0 && satelliteInfos ?
                  (
                    ((): any => {
                      const firstFourPasses = satellitePasses.slice(0, 4);

                      const passesByDate = satellitePasses.reduce((acc: { [date: string]: SatellitePass[] }, pass) => {
                        const dateString = dayjs.unix(pass.startUTC).format('dddd D MMMM YYYY');
                        if (!acc[dateString]) {
                          acc[dateString] = [];
                        }
                        acc[dateString].push(pass);
                        return acc;
                      }, {});

                      return Object.entries(passesByDate).map(([date, passes]) => (
                        <View key={date}>
                          <Text style={satelliteTrackerStyles.content.nextPasses.date}>{date}</Text>
                          <View style={{display: 'flex', gap: 5}}>
                            {passes.map((pass, index) => (
                              <SatellitePassCard
                                satname={satelliteInfos.name}
                                pass={pass}
                                navigation={navigation}
                                key={`${pass.startUTC}-${index}`}
                                passIndex={index}
                                weather={satellitePassesWeather}
                              />
                            ))}
                          </View>
                        </View>
                      ));
                    })()
                  ) : !satellitePassesLoading && satellitePasses.length === 0 && (
                    <Text style={satelliteTrackerStyles.content.nextPasses.noPasses}>{i18n.t('satelliteTrackers.details.nextPasses.noPasses', {satname: satelliteInfos ? satelliteInfos.name : ''})}</Text>
                  )
                }
              </View>
            </View>


            {
              noradId === 25544 &&
              <View style={satelliteTrackerStyles.content.liveStats}>
                <Text style={satelliteTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTrackers.details.nextLaunches.title', { satname: satelliteInfos ? satelliteInfos.name : '' })}</Text>
                {
                  launchData.filter((l: LaunchData)=> (l.mission.name.includes('CRS') && l.mission.type.includes('Resupply'))).length > 0 ?
                  launchData.filter((l: LaunchData)=> (l.mission.name.includes('CRS') && l.mission.type.includes('Resupply'))).map((launch: LaunchData, index: number) => {
                    return(
                      <LaunchCard launch={launch} navigation={navigation} key={index} />
                    )
                  })
                    :
                    <SimpleButton
                      text={i18n.t('satelliteTracker.details.nextLaunches.noLaunches', { satname: satelliteInfos ? satelliteInfos.name : '' })}
                      disabled
                      fullWidth
                      textColor={app_colors.white}
                      align={'center'}
                    />
                }
              </View>
            }
          </View>
      </ScrollView>
    </View>
  )
}
