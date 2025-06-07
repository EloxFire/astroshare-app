import React, { useEffect, useRef, useState } from 'react'
import {ActivityIndicator, ScrollView, Text, View} from 'react-native'
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../../helpers/api/getLocationFromCoords'
import { getCountryByCode } from '../../helpers/scripts/utils/getCountryByCode'
import { i18n } from '../../helpers/scripts/i18n'
import { useTranslation } from '../../hooks/useTranslation'
import { globalStyles } from '../../styles/global'
import axios from 'axios'
import PageTitle from '../../components/commons/PageTitle'
import {app_colors, storageKeys} from '../../helpers/constants'
import { issTrackerStyles } from '../../styles/screens/satelliteTracker/issTracker'
import DSOValues from '../../components/commons/DSOValues'
import { shortDmsCoord } from '../../helpers/scripts/shortenDmsCoord'
import getCountryFlag from 'country-flag-icons/unicode'
import MapView, { Circle, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps'
import { mapStyle } from '../../helpers/mapJsonStyle'
import SimpleButton from '../../components/commons/buttons/SimpleButton'
import {useLaunchData} from "../../contexts/LaunchContext";
import {LaunchData} from "../../helpers/types/LaunchData";
import LaunchCard from "../../components/cards/LaunchCard";
import {getObject, storeObject} from "../../helpers/storage";
import IssPassCard from "../../components/cards/IssPassCard";
import {useSettings} from "../../contexts/AppSettingsContext";
import {IssPass} from "../../helpers/types/IssPass";
import dayjs from "dayjs";
import {getWeather} from "../../helpers/api/getWeather";
import {routes} from "../../helpers/routes";
import ProLocker from "../../components/cards/ProLocker";
import {isProUser} from "../../helpers/scripts/auth/checkUserRole";
import {useAuth} from "../../contexts/AuthContext";
import {getTimeFromLaunch} from "../../helpers/scripts/utils/getTimeFromLaunch";

export default function IssTracker({ navigation }: any) {

  const {currentLocale} = useTranslation()
  const {launchData} = useLaunchData()
  const {currentUserLocation} = useSettings()
  const {currentUser} = useAuth()

  const [issPosition, setIssPosition] = useState<any>(null)
  const [trajectoryPoints, setTrajectoryPoints] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [passesWeather, setPassesWeather] = useState<any[]>([])

  const [issPassesLoading, setIssPassesLoading] = useState(true)
  const [issPasses, setIssPasses] = useState<IssPass[]>([])
  const mapRef = useRef(null)


  useEffect(() => {
    getIssData()
    const update = setInterval(() => {
      getIssData()
    }, 5000)

    return () => clearInterval(update)
  }, [])

  useEffect(() => {
    fetchIssPasses()
  }, [currentUserLocation])

  useEffect(() => {
    // Get weather for the pass
    if(!currentUserLocation) return;
    (async () => {
      const weather = await getWeather(currentUserLocation.lat, currentUserLocation.lon)
      setPassesWeather(weather.daily)
    })()
  }, [currentUserLocation])

  useEffect(() => {
    if (!mapRef.current) return
    // @ts-ignore
    mapRef.current.animateToRegion({
      latitude: issPosition ? issPosition.latitude : 0,
      longitude: issPosition ? issPosition.longitude : 0,
      latitudeDelta: 0,
      longitudeDelta: 100,
    })
  }, [loading])

  const [countdown, setCountdown] = useState<string>('00:00:00:00') // DD:HH:mm:ss

  useEffect(() => {
    if(issPasses.length > 0){
      console.log(issPasses[0].startUTC)
      setCountdown(getTimeFromLaunch(dayjs.unix(issPasses[0].startUTC).toDate()))

      const interval = setInterval(() => {
        setCountdown(getTimeFromLaunch(dayjs.unix(issPasses[0].startUTC).toDate()))
      }, 1000)

      return () => clearInterval(interval)
    }
  }, [issPasses])

  const fetchIssPasses = async () => {
    if(!currentUserLocation) return
    try {
      console.log('Fetching ISS passes from API')
      console.log('Fetching ISS passes API')
      const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/passes`, {
        params: {
          latitude: currentUserLocation.lat,
          longitude: currentUserLocation.lon,
          altitude: 0
        }
      })

      setIssPasses(response.data.passes.filter((pass: IssPass) => pass.maxEl > 10))
      console.log('Storing ISS passes in local storage')
      await storeObject(storageKeys.issPasses, JSON.stringify(response.data))
      setIssPassesLoading(false)
    } catch (error) {
      console.log(`[iss] Error fetching ISS passes: ${error}`)
      setIssPassesLoading(false)
    }
  }

  const getIssData = async () => {
    try {
      const position = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss`)
      const trajectoryPoints = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/trajectory`)
      const name = await getLocationName({ lat: position.data.data.latitude, lon: position.data.data.longitude });
      const tle = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/iss/tle`)

      const iss = {
        ...position.data.data,
        dms_lat: convertDDtoDMS(position.data.data.latitude, position.data.data.latitude).dms_lat,
        dms_lon: convertDDtoDMS(position.data.data.longitude, position.data.data.longitude).dms_lon,
        country: name.country
      }


      setIssPosition(iss)
      setTrajectoryPoints(trajectoryPoints.data.data)
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  const centerIss = () => {
    if (!mapRef.current) return
    // @ts-ignore
    mapRef.current.animateToRegion({
      latitude: issPosition ? issPosition.latitude : 0,
      longitude: issPosition ? issPosition.longitude : 0,
      latitudeDelta: 0,
      longitudeDelta: 100,
    })
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('satelliteTracker.home.buttons.issTracker.title')}
        subtitle={i18n.t('satelliteTracker.home.buttons.issTracker.subtitle')}
      />
        <View style={globalStyles.screens.separator} />
        <ScrollView>
          <View style={issTrackerStyles.content}>
            <View style={issTrackerStyles.content.liveStats}>
              <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.stats.title')}</Text>
              <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.latitude')} value={issPosition ? shortDmsCoord(issPosition.dms_lat) : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.longitude')} value={issPosition ? shortDmsCoord(issPosition.dms_lon) : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.altitude')} value={issPosition ? `${issPosition.altitude.toFixed(2)} Km` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.speed')} value={issPosition ? `${issPosition.velocity.toFixed(2)} Km/h` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTracker.issTracker.stats.country')} value={issPosition ? `${getCountryByCode(issPosition.country, currentLocale)} - ${getCountryFlag(issPosition.country === i18n.t('satelliteTracker.issTracker.stats.unknown') ? 'ZZ' : issPosition.country )}` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
            </View>
            <View style={issTrackerStyles.content.nextPasses}>
              <Text style={issTrackerStyles.content.nextPasses.title}>{i18n.t('satelliteTracker.issTracker.nextPasses.title')}</Text>
              <Text style={issTrackerStyles.content.nextPasses.subtitle}>{i18n.t('satelliteTracker.issTracker.nextPasses.subtitle')}{currentUserLocation.common_name}</Text>
              {
                isProUser(currentUser) ?
                  <>
                    <View style={issTrackerStyles.content.nextPasses.container}>
                      {
                        issPasses.length > 0 && !issPassesLoading &&
                          <DSOValues title={i18n.t("satelliteTracker.issTracker.nextPasses.timeToNext")} value={countdown}/>
                      }
                      {
                        issPassesLoading ? (
                          <ActivityIndicator size={'small'} color={app_colors.white} animating />
                        ) : issPasses.length > 0 ? (
                          ((): any => {
                            const firstFourPasses = issPasses.slice(0, 4);

                            const passesByDate = firstFourPasses.reduce((acc: { [date: string]: IssPass[] }, pass) => {
                              const dateString = dayjs.unix(pass.startUTC).format('dddd D MMMM YYYY');
                              if (!acc[dateString]) {
                                acc[dateString] = [];
                              }
                              acc[dateString].push(pass);
                              return acc;
                            }, {});

                            return Object.entries(passesByDate).map(([date, passes]) => (
                              <View key={date}>
                                <Text style={issTrackerStyles.content.nextPasses.date}>{date}</Text>
                                <View style={{display: 'flex', gap: 5}}>
                                  {passes.map((pass, index) => (
                                    <IssPassCard
                                      pass={pass}
                                      navigation={navigation}
                                      key={`${pass.startUTC}-${index}`}
                                      passIndex={index}
                                      weather={passesWeather}
                                    />
                                  ))}
                                </View>
                              </View>
                            ));
                          })()
                        ) : (
                          <SimpleButton textColor={app_colors.white} text={i18n.t('satelliteTracker.issTracker.nextPasses.noPasses')} disabled fullWidth />
                        )
                      }
                      {
                        issPasses.length > 0 &&
                          <SimpleButton
                              fullWidth
                              backgroundColor={app_colors.white}
                              textColor={app_colors.black}
                              textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
                              align={'center'}
                              text={i18n.t('satelliteTracker.issTracker.nextPasses.seeMore')}
                              onPress={() => navigation.push(routes.satellitesTrackers.issPasses.path, {passes: issPasses, weather: passesWeather})}
                          />
                      }
                    </View>
                  </> :
                <ProLocker navigation={navigation} image={require('../../../assets/images/tools/isstracker.png')}/>
              }
            </View>
            <View style={issTrackerStyles.content.mapContainer}>
              <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.2dMap.title')}</Text>
              <Text style={issTrackerStyles.content.liveStats.subtitle}>{i18n.t('satelliteTracker.issTracker.2dMap.subtitle')}</Text>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <SimpleButton
                  text={i18n.t('satelliteTracker.issTracker.2dMap.button')}
                  onPress={centerIss} icon={require('../../../assets/icons/FiIss.png')}
                  textColor={app_colors.white}
                  align={'center'}
                />
              </View>
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={issTrackerStyles.content.mapContainer.map}
                customMapStyle={mapStyle}
                initialRegion={{
                  latitude: issPosition ? issPosition.latitude : 0,
                  longitude: issPosition ? issPosition.longitude : 0,
                  latitudeDelta: 0,
                  longitudeDelta: 1000,
                }}
                rotateEnabled={false}
                cameraZoomRange={{ minCenterCoordinateDistance: 1000 }}
              >
                {
                  issPosition &&
                  <Marker
                    coordinate={{
                      latitude: issPosition.latitude,
                      longitude: issPosition.longitude,
                    }}
                    title='ISS'
                    description="Position de l'ISS en temps réel"
                    image={require('../../../assets/icons/FiIssSmall.png')}
                    anchor={{ x: 0.5, y: 0.5 }}
                    centerOffset={{ x: 0.5, y: 0.5 }}
                  />

                }
                {
                  issPosition &&
                  <Circle
                    center={{
                      latitude: issPosition.latitude,
                      longitude: issPosition.longitude,
                    }}
                    radius={1200000}
                    fillColor={app_colors.white_twenty}
                    strokeColor={app_colors.white_forty}
                  />
                }
                {
                  trajectoryPoints &&
                  <Polyline
                    coordinates={trajectoryPoints}
                    strokeColor={app_colors.red}
                    strokeWidth={1}
                    geodesic
                  />
                }
              </MapView>
            </View>

            <View style={issTrackerStyles.content.liveStats}>
              <Text style={[issTrackerStyles.content.liveStats.title, {marginBottom: 10}]}>{i18n.t('satelliteTracker.issTracker.nextLaunches.title')}</Text>
              {
                launchData.filter((l: LaunchData)=> (l.mission.name.includes('CRS') && l.mission.type.includes('Resupply'))).length > 0 ?
                launchData.filter((l: LaunchData)=> (l.mission.name.includes('CRS') && l.mission.type.includes('Resupply'))).map((launch: LaunchData, index: number) => {
                  return(
                    <LaunchCard launch={launch} navigation={navigation} key={index} />
                  )
                })
                  :
                  <SimpleButton
                    text={i18n.t('satelliteTracker.issTracker.nextLaunches.noLaunches')}
                    disabled
                    fullWidth
                    textColor={app_colors.white}
                    align={'center'}
                  />
              }
            </View>
          </View>
        </ScrollView>
      </View>
  )
}
