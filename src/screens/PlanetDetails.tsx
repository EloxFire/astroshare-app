import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";
import { objectDetailsStyles } from "../styles/screens/objectDetails";
import { astroImages } from "../helpers/scripts/loadImages";
import { useSettings } from "../contexts/AppSettingsContext";
import PageTitle from "../components/commons/PageTitle";
import { EquatorialCoordinate, GeographicCoordinate, getBodyNextRise, getBodyNextSet, isBodyAboveHorizon, isBodyVisibleForNight, isTransitInstance, Planet } from "@observerly/astrometry";
import DSOValues from "../components/commons/DSOValues";
import { GlobalPlanet } from "../helpers/types/GlobalPlanet";
import { getObject, storeObject } from "../helpers/storage";
import { app_colors, storageKeys } from "../helpers/constants";
import { calculateHorizonAngle } from "../helpers/scripts/astro/calculateHorizonAngle";
import { extractNumbers } from "../helpers/scripts/extractNumbers";
import { useSpot } from "../contexts/ObservationSpotContext";
import dayjs, { Dayjs, locale } from "dayjs";
import { formatCelsius, formatKm } from "../helpers/scripts/utils/formatters/formaters";
import { useTranslation } from "../hooks/useTranslation";
import { planetsOrder } from "../helpers/scripts/astro/planets/order";
import { planetsSizes } from "../helpers/scripts/astro/planets/sizes";
import { planetTemps } from "../helpers/scripts/astro/planets/temps";
import { planetSatellites } from "../helpers/scripts/astro/planets/satellites";
import { i18n } from "../helpers/scripts/i18n";
import { prettyDec, prettyRa } from "../helpers/scripts/astro/prettyCoords";
import { convertDegreesDecToDMS } from "../helpers/scripts/astro/coords/convertDegreesDecToDms";
import { convertDegreesRaToHMS } from "../helpers/scripts/astro/coords/convertDegreesRaToHMS";

export default function PlanetDetails({ route, navigation }: any) {

  const { currentUserLocation } = useSettings()
  const { selectedSpot, defaultAltitude } = useSpot()
  const { currentLCID, currentLocale } = useTranslation()

  const params = route.params;
  const planet: GlobalPlanet = params.planet;

  const [selectedTimeBase, setSelectedTimeBase] = useState<'relative' | 'absolute'>('relative')
  const [favouritePlanets, setFavouritePlanets] = useState<GlobalPlanet[]>([])
  const [riseTime, setRiseTime] = useState<Dayjs | boolean>(false)
  const [setTime, setSetTime] = useState<Dayjs | boolean>(false)
  const [willRise, setWillRise] = useState<boolean>(false)
  const [isVisible, setIsVisible] = useState<boolean>(false)


  useEffect(() => {
    (async () => {
      const favs = await getObject(storageKeys.favouritePlanets)
      if (!favs) return
      setFavouritePlanets(favs)
    })()
  }, [])

  useEffect(() => {
    if (!currentUserLocation) return;
  }, [])

  useEffect(() => {
    if (planet.name === 'Earth') {
      return;
    }
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))


    if (!horizonAngle) return;
    const target: EquatorialCoordinate = { ra: planet.ra, dec: planet.dec }
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    setIsVisible(isBodyAboveHorizon(new Date(), observer, target, horizonAngle))

    setWillRise(isBodyVisibleForNight(new Date(), observer, target, horizonAngle))

    let rise = getBodyNextRise(new Date(), observer, target, horizonAngle)
    let set = getBodyNextSet(new Date(), observer, target, horizonAngle)

    if (isTransitInstance(rise)) {
      setRiseTime(dayjs(rise.datetime))
    }
    if (isTransitInstance(set)) {
      setSetTime(dayjs(set.datetime))
    }
  }, [])

  const updateFavList = async (newList: GlobalPlanet[]) => {
    await storeObject(storageKeys.favouritePlanets, newList)
  }

  const handleFavorite = async () => {
    if (favouritePlanets.some(obj => obj.name === planet.name)) {
      console.log("remove")
      const favs = favouritePlanets.filter(obj => obj.name !== planet.name)
      setFavouritePlanets(favs)
      await updateFavList(favs)

    } else {
      console.log("add")
      const favs = [...favouritePlanets, planet]
      setFavouritePlanets(favs)
      await updateFavList(favs)
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('detailsPages.planets.title')}
        subtitle={i18n.t('detailsPages.planets.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <Text style={objectDetailsStyles.content.title}>{i18n.t(`common.planets.${planet.name}`).toUpperCase()}</Text>
        {planet.name === 'Earth' && <Text style={objectDetailsStyles.content.subtitle}>{i18n.t('detailsPages.planets.labels.civilization')}</Text>}
        <Image style={objectDetailsStyles.content.image} source={astroImages[planet.name.toUpperCase()]} />
        <View style={objectDetailsStyles.content.dsoInfos}>
          <DSOValues title={i18n.t('detailsPages.planets.labels.symbol')} value={planet.symbol} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.position')} value={`${planetsOrder[planet.name.toUpperCase()]} / 8`} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.inclination')} value={(23.5 + parseFloat(planet.i.toFixed(1))).toString() + "°"} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.mass')} value={planet.name === 'Earth' ? (9.972e24 + " Kg").toString() : planet.m.toFixed(2) + i18n.t('detailsPages.planets.units.mass')} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.orbitalPeriod')} value={planet.name === 'Earth' ? "365.25 jours" : planet.T + " " + i18n.t('detailsPages.planets.units.orbitalPeriod')} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.distanceSun')} value={planet.a.toFixed(2) + " " + i18n.t('detailsPages.planets.units.distanceSun')} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.diameter')} value={formatKm(planetsSizes[planet.name.toUpperCase()], currentLCID).toString()} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.surfaceTemperature')} value={formatCelsius(planetTemps[planet.name.toUpperCase()], currentLCID).toString()} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.naturalSatellites')} value={planetSatellites[planet.name.toUpperCase()].toString()} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.rightAscension')} value={prettyRa(convertDegreesRaToHMS(planet.ra))} />
          <DSOValues title={i18n.t('detailsPages.planets.labels.declination')} value={prettyDec(convertDegreesDecToDMS(planet.dec))} />
        </View>
        {
          planet.name !== 'Earth' &&
          <View>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
              <Text style={objectDetailsStyles.content.sectionTitle}>{i18n.t('common.visibility.title')}</Text>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end' }}>
                <Text style={objectDetailsStyles.dsoValues.select.text}>{i18n.t('common.time.time')} : </Text>
                <TouchableOpacity style={objectDetailsStyles.dsoValues.select} onPress={() => setSelectedTimeBase('relative')}>
                  <Text style={[objectDetailsStyles.dsoValues.select.text, { backgroundColor: selectedTimeBase === 'relative' ? app_colors.white_forty : 'transparent' }]}>{i18n.t('common.other.relative')}</Text>
                </TouchableOpacity>
                <Text style={objectDetailsStyles.dsoValues.select.text}>/</Text>
                <TouchableOpacity style={objectDetailsStyles.dsoValues.select} onPress={() => setSelectedTimeBase('absolute')}>
                  <Text style={[objectDetailsStyles.dsoValues.select.text, { backgroundColor: selectedTimeBase === 'absolute' ? app_colors.white_forty : 'transparent' }]}>{i18n.t('common.other.absolute')}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <DSOValues chipValue chipColor={isVisible ? app_colors.green_eighty : app_colors.red_eighty} title={i18n.t('common.time.now')} value={isVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible')} />
            <DSOValues chipValue chipColor={willRise ? app_colors.green_eighty : app_colors.red_eighty} title={i18n.t('common.time.thisNight')} value={willRise ? i18n.t('common.other.yes') : i18n.t('common.other.no')} />
            <DSOValues chipValue chipColor={app_colors.white_forty} title={i18n.t('common.visibility.altitude')} value={planet.alt.toFixed(2) + "°"} />
            {
              typeof riseTime === 'object' && <DSOValues chipValue chipColor={app_colors.white_forty} title={i18n.t('common.visibility.nextRise')} value={selectedTimeBase === 'relative' ? dayjs().locale(i18n.locale).to(riseTime) : riseTime.add(2, 'hour').format('DD MMM à HH:mm').replace(':', 'h')} />
            }
            {
              typeof riseTime === 'boolean' && <DSOValues chipValue chipColor={app_colors.white_forty} title={i18n.t('common.visibility.nextRise')} value={riseTime ? i18n.t('common.time.allNight') : i18n.t('common.time.never')} />
            }
            {
              typeof setTime === 'object' && <DSOValues chipValue chipColor={app_colors.white_forty} title={i18n.t('common.visibility.nextSet')} value={selectedTimeBase === 'relative' ? dayjs().locale(i18n.locale).to(setTime) : setTime.add(2, 'hour').format('DD MMM à HH:mm').replace(':', 'h')} />
            }
            {
              typeof setTime === 'boolean' && <DSOValues chipValue chipColor={app_colors.white_forty} title={i18n.t('common.visibility.nextSet')} value={setTime ? i18n.t('common.time.allNight') : i18n.t('common.time.never')} />
            }
          </View>
        }
        <View style={objectDetailsStyles.content.favouritesContainer}>
          <TouchableOpacity style={objectDetailsStyles.content.favouritesContainer.button} onPress={() => handleFavorite()}>
            {
              favouritePlanets.some(obj => obj.name === planet.name) ?
                <Image source={require('../../assets/icons/FiHeartFill.png')} style={[objectDetailsStyles.content.favouritesContainer.button.image, { tintColor: app_colors.red }]} />
                :
                <Image source={require('../../assets/icons/FiHeart.png')} style={objectDetailsStyles.content.favouritesContainer.button.image} />
            }
            <Text style={objectDetailsStyles.content.favouritesContainer.button.text}>{favouritePlanets.some(obj => obj.name === planet.name) ? i18n.t('common.other.removeFav') : i18n.t('common.other.addFav')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
