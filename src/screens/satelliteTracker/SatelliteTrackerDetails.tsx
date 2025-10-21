import React, { useEffect, useRef, useState } from 'react'
import {ActivityIndicator, ScrollView, Text, View} from 'react-native'
import { getCountryByCode } from '../../helpers/scripts/utils/getCountryByCode'
import { i18n } from '../../helpers/scripts/i18n'
import { useTranslation } from '../../hooks/useTranslation'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import {app_colors, storageKeys} from '../../helpers/constants'
import DSOValues from '../../components/commons/DSOValues'
import getCountryFlag from 'country-flag-icons/unicode'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import { mapStyle } from '../../helpers/mapJsonStyle'
import SimpleButton from '../../components/commons/buttons/SimpleButton'
import {useSettings} from "../../contexts/AppSettingsContext";
import {SatellitePass} from "../../helpers/types/IssPass";
import {useAuth} from "../../contexts/AuthContext";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";
import { getLocationName } from '../../helpers/api/getLocationFromCoords'
import { LocationObject } from '../../helpers/types/LocationObject'
import dayjs from 'dayjs'
import { getWeather } from '../../helpers/api/getWeather'
import { getTimeFromLaunch } from '../../helpers/scripts/utils/getTimeFromLaunch'
import { satelliteTrackerStyles } from '../../styles/screens/satelliteTracker/satelliteTrackerStyles'
import { KNOWN_NORAD_IDS } from '../../helpers/constants/norad'
import SatellitePassCard from '../../components/cards/SatellitePassCard'
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords'

export default function SatelliteTrackerDetails({ route, navigation }: any) {

  const {currentLocale} = useTranslation()
  const {currentUserLocation} = useSettings()
  const {currentUser} = useAuth()
  const { noradId } = route.params;

  const mapRef = useRef(null)


  const [satelliteInfos, setSatelliteInfos] = useState<any>(null)
  const [satellitePasses, setSatellitePasses] = useState<SatellitePass[]>([])
  const [satellitePassesLoading, setSatellitePassesLoading] = useState<boolean>(true)
  const [satelliteInfosLoading, setSatelliteInfosLoading] = useState<boolean>(true)
  const [satellitePassesWeather, setSatellitePassesWeather] = useState<any>(null)
  const [countdown, setCountdown] = useState<string>('00:00:00')

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
    const fetchSatelliteData = async () => {
      try {
        setSatelliteInfosLoading(true)
        setSatellitePassesLoading(true)
        const tleResponse = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/satellite?noradId=${noradId}`)
        const tleData = await tleResponse.json()

        const positionResponse = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/satellite/position?noradId=${noradId}&lat=${currentUserLocation.lat}&lon=${currentUserLocation.lon}`)
        const positionData = await positionResponse.json()

        const satelliteNextPassesResponse = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/satellite/passes?noradId=${noradId}&lat=${currentUserLocation.lat}&lon=${currentUserLocation.lon}`)
        const satelliteNextPassesData = await satelliteNextPassesResponse.json()

        setSatellitePasses(satelliteNextPassesData.passes)
        setSatellitePassesLoading(false)        

        const locObject: LocationObject = {
          lat: positionData.data.positions[0].satlatitude,
          lon: positionData.data.positions[0].satlongitude,
        }

        const locationName = await getLocationName(locObject)

        console.log("TLE Data:", tleData);
        console.log("Satellite Next Passes Data:", satelliteNextPassesData);

        setSatelliteInfos({
          name: tleData.data.info.satname,
          tle: tleData.data.tle,
          currentPosition: positionData.data.positions[0],
          currentCountry: locationName,
          nextPositions: positionData.data.positions.slice(1),
        })

        setSatelliteInfosLoading(false)
      } catch (error) {
        console.error('Error fetching Satellite data:', error)
        setSatelliteInfosLoading(false)
      }
    }

    fetchSatelliteData()
    // const interval = setInterval(fetchSatelliteData, 10000)
    // return () => clearInterval(interval)
  }, [])

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
  


  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t(`satelliteTrackers.home.buttons.${noradId}.title`, {name: KNOWN_NORAD_IDS[noradId as keyof typeof KNOWN_NORAD_IDS]})}
        subtitle={i18n.t(`satelliteTrackers.home.buttons.${noradId}.subtitle`)}
      />
        <View style={globalStyles.screens.separator} />
        <ScrollView>
          {
            satelliteInfosLoading ?
            <View style={satelliteTrackerStyles.content}>
              <ActivityIndicator size="large" color={app_colors.white} />
            </View>
            :
            satelliteInfos &&
            <View style={satelliteTrackerStyles.content}>
              <View style={satelliteTrackerStyles.content.liveStats}>
                <Text style={satelliteTrackerStyles.content.liveStats.title}>{satelliteInfos.name}</Text>
                <DSOValues title={i18n.t('satelliteTrackers.details.stats.latitude')} value={satelliteInfos ? convertDDtoDMS(satelliteInfos.currentPosition.satlatitude, satelliteInfos.currentPosition.satlongitude).dms_lat : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTrackers.details.stats.longitude')} value={satelliteInfos ? convertDDtoDMS(satelliteInfos.currentPosition.satlatitude, satelliteInfos.currentPosition.satlongitude).dms_lon : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTrackers.details.stats.altitude')} value={satelliteInfos ? `${satelliteInfos.currentPosition.sataltitude} Km` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
                <DSOValues title={i18n.t('satelliteTrackers.details.stats.country')} value={satelliteInfos ? `${getCountryByCode(satelliteInfos.currentCountry.country, currentLocale)} - ${getCountryFlag(satelliteInfos.currentCountry.country === i18n.t('satelliteTrackers.details.stats.unknown') ? 'ZZ' : satelliteInfos.currentCountry.country)}` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
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
                    !satellitePassesLoading && satellitePasses.length > 0 ?
                    (
                      ((): any => {
                        const firstFourPasses = satellitePasses.slice(0, 4);

                        const passesByDate = firstFourPasses.reduce((acc: { [date: string]: SatellitePass[] }, pass) => {
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
                      <Text style={satelliteTrackerStyles.content.nextPasses.noPasses}>{i18n.t('satelliteTrackers.details.nextPasses.noPasses')}</Text>
                    )
                  }
                  
                  {
                    satellitePasses.length > 0 &&
                      <SimpleButton
                          fullWidth
                          backgroundColor={app_colors.white}
                          textColor={app_colors.black}
                          textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
                          align={'center'}
                          text={i18n.t('satelliteTrackers.details.nextPasses.seeMore')}
                          onPress={() => {
                            sendAnalyticsEvent(currentUser, currentUserLocation, 'See more CSS passes', eventTypes.BUTTON_CLICK, {noradId}, currentLocale)
                          }}
                      />
                  }
                </View>
              </View>
              <View style={satelliteTrackerStyles.content.mapContainer}>
                <Text style={satelliteTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTrackers.details.2dMap.title')}</Text>
                <Text style={satelliteTrackerStyles.content.liveStats.subtitle}>{i18n.t('satelliteTrackers.details.2dMap.subtitle')}</Text>
                <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <SimpleButton
                    text={i18n.t('satelliteTrackers.details.2dMap.button')}
                    onPress={() => {}}
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
            </View>
          }
        </ScrollView>
      </View>
  )
}
