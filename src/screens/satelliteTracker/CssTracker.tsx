import React, { useEffect, useRef, useState } from 'react'
import {ActivityIndicator, ScrollView, Text, View} from 'react-native'
import { getCountryByCode } from '../../helpers/scripts/utils/getCountryByCode'
import { i18n } from '../../helpers/scripts/i18n'
import { useTranslation } from '../../hooks/useTranslation'
import { globalStyles } from '../../styles/global'
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
import {useSettings} from "../../contexts/AppSettingsContext";
import {IssPass} from "../../helpers/types/IssPass";
import {routes} from "../../helpers/routes";
import ProLocker from "../../components/cards/ProLocker";
import {isProUser} from "../../helpers/scripts/auth/checkUserRole";
import {useAuth} from "../../contexts/AuthContext";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";
import { getLocationName } from '../../helpers/api/getLocationFromCoords'
import { LocationObject } from '../../helpers/types/LocationObject'
import dayjs from 'dayjs'
import IssPassCard from '../../components/cards/IssPassCard'
import { getWeather } from '../../helpers/api/getWeather'
import { getTimeFromLaunch } from '../../helpers/scripts/utils/getTimeFromLaunch'

export default function CssTracker({ navigation }: any) {

  const {currentLocale} = useTranslation()
  const {currentUserLocation} = useSettings()
  const {currentUser} = useAuth()

  const [cssInfos, setCssInfos] = useState<any>(null)
  const [cssInfosLoading, setCssInfosLoading] = useState(true)
  const [passesWeather, setPassesWeather] = useState<any>(null)

  const [countdown, setCountdown] = useState<string>('00:00:00:00') // DD:HH:mm:ss

  const [cssPassesLoading, setCssPassesLoading] = useState(true)
  const [cssPasses, setCssPasses] = useState<IssPass[]>([])
  const mapRef = useRef(null)

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'CSS tracker screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])


  useEffect(() => {
      // Get weather for the pass
      if(!currentUserLocation) return;
      (async () => {
        const weather = await getWeather(currentUserLocation.lat, currentUserLocation.lon)
        setPassesWeather(weather.daily)
      })()
    }, [currentUserLocation])


  useEffect(() => {
    const fetchCssData = async () => {
      try {
        setCssInfosLoading(true)
        setCssPassesLoading(true)
        const tleResponse = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/css`)
        const tleData = await tleResponse.json()

        const positionResponse = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/css/position`)
        const positionData = await positionResponse.json()

        const cssNextPassesResponse = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/css/passes?lat=${currentUserLocation.lat}&lon=${currentUserLocation.lon}`)
        const cssNextPassesData = await cssNextPassesResponse.json()
        console.log('CSS Next Passes Data:', cssNextPassesData.passes);
        
        setCssPasses(cssNextPassesData.passes)
        setCssPassesLoading(false)

        const locObject: LocationObject = {
          lat: positionData.data.positions[0].satlatitude,
          lon: positionData.data.positions[0].satlongitude,
        }

        const locationName = await getLocationName(locObject)

        setCssInfos({
          tle: tleData.data.tle,
          currentPosition: positionData.data.positions[0],
          currentCountry: locationName,
          nextPositions: positionData.data.positions.slice(1),
        })
        
        setCssInfosLoading(false)
      } catch (error) {
        console.error('Error fetching CSS data:', error)
        setCssInfosLoading(false)
      }
    }

    fetchCssData()
    // const interval = setInterval(fetchCssData, 10000)
    // return () => clearInterval(interval)
  }, [])

  useEffect(() => {
      if(cssPasses.length > 0){
        console.log(cssPasses[0].startUTC)
        setCountdown(getTimeFromLaunch(dayjs.unix(cssPasses[0].startUTC).toDate()))

        const interval = setInterval(() => {
          setCountdown(getTimeFromLaunch(dayjs.unix(cssPasses[0].startUTC).toDate()))
        }, 1000)
  
        return () => clearInterval(interval)
      }
    }, [cssPasses])
  


  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('satelliteTracker.home.buttons.cssTracker.title')}
        subtitle={i18n.t('satelliteTracker.home.buttons.cssTracker.subtitle')}
      />
        <View style={globalStyles.screens.separator} />
        <ScrollView>
          <View style={issTrackerStyles.content}>
            <View style={issTrackerStyles.content.liveStats}>
              <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.cssTracker.stats.title')}</Text>
              <DSOValues title={i18n.t('satelliteTracker.cssTracker.stats.latitude')} value={cssInfos ? cssInfos.currentPosition.satlatitude : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTracker.cssTracker.stats.longitude')} value={cssInfos ? cssInfos.currentPosition.satlongitude : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTracker.cssTracker.stats.altitude')} value={cssInfos ? `${cssInfos.currentPosition.sataltitude} Km` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
              <DSOValues title={i18n.t('satelliteTracker.cssTracker.stats.country')} value={cssInfos ? `${getCountryByCode(cssInfos.currentCountry.country, currentLocale)} - ${getCountryFlag(cssInfos.currentCountry.country === i18n.t('satelliteTracker.cssTracker.stats.unknown') ? 'ZZ' : cssInfos.currentCountry.country)}` : <ActivityIndicator size={'small'} color={app_colors.white} animating />} />
            </View>
            <View style={issTrackerStyles.content.nextPasses}>
              <Text style={issTrackerStyles.content.nextPasses.title}>{i18n.t('satelliteTracker.cssTracker.nextPasses.title')}</Text>
              <Text style={issTrackerStyles.content.nextPasses.subtitle}>{i18n.t('satelliteTracker.cssTracker.nextPasses.subtitle')}{currentUserLocation.common_name}</Text>
              <View style={issTrackerStyles.content.nextPasses.container}>
                {
                  cssPasses.length > 0 && !cssPassesLoading &&
                    <DSOValues title={i18n.t("satelliteTracker.cssTracker.nextPasses.timeToNext")} value={countdown}/>
                }

                {
                  cssPassesLoading &&
                    <ActivityIndicator size={'small'} color={app_colors.white} animating />
                }

                {
                  !cssPassesLoading && cssPasses.length > 0 ?
                  (
                    ((): any => {
                      const firstFourPasses = cssPasses.slice(0, 4);

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
                  ) : !cssPassesLoading && cssPasses.length === 0 &&
                    <Text style={issTrackerStyles.content.nextPasses.noPasses}>{i18n.t('satelliteTracker.issTracker.nextPasses.noPasses')}</Text>
                }
                
                {
                  cssPasses.length > 0 &&
                    <SimpleButton
                        fullWidth
                        backgroundColor={app_colors.white}
                        textColor={app_colors.black}
                        textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
                        align={'center'}
                        text={i18n.t('satelliteTracker.cssTracker.nextPasses.seeMore')}
                        onPress={() => {
                          sendAnalyticsEvent(currentUser, currentUserLocation, 'See more CSS passes', eventTypes.BUTTON_CLICK, {}, currentLocale)
                        }}
                    />
                }
              </View>
            </View>
            <View style={issTrackerStyles.content.mapContainer}>
              <Text style={issTrackerStyles.content.liveStats.title}>{i18n.t('satelliteTracker.issTracker.2dMap.title')}</Text>
              <Text style={issTrackerStyles.content.liveStats.subtitle}>{i18n.t('satelliteTracker.issTracker.2dMap.subtitle')}</Text>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <SimpleButton
                  text={i18n.t('satelliteTracker.issTracker.2dMap.button')}
                  onPress={() => {}}
                  icon={require('../../../assets/icons/FiIss.png')}
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
                  latitude: cssInfos ? cssInfos.currentPosition.satlatitude : 0,
                  longitude: cssInfos ? cssInfos.currentPosition.satlongitude : 0,
                  latitudeDelta: 0,
                  longitudeDelta: 1000,
                }}
                rotateEnabled={false}
                cameraZoomRange={{ minCenterCoordinateDistance: 1000 }}
              >
                {
                  cssInfos &&
                  <Marker
                    coordinate={{
                      latitude: cssInfos.currentPosition.satlatitude,
                      longitude: cssInfos.currentPosition.satlongitude,
                    }}
                    title='CSS'
                    description="Position de la CSS en temps réel"
                    image={require('../../../assets/icons/FiIssSmall.png')}
                    anchor={{ x: 0.5, y: 0.5 }}
                    centerOffset={{ x: 0.5, y: 0.5 }}
                  />

                }
                {
                  cssInfos &&
                  <Circle
                    center={{
                      latitude: cssInfos.currentPosition.satlatitude,
                      longitude: cssInfos.currentPosition.satlongitude,
                    }}
                    radius={1200000}
                    fillColor={app_colors.white_twenty}
                    strokeColor={app_colors.white_forty}
                  />
                }
                {
                  cssInfos &&
                  <Polyline
                    coordinates={cssInfos.nextPositions.map((pos: any) => ({
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
        </ScrollView>
      </View>
  )
}
