import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";
import { getObjectName } from "../helpers/scripts/astro/getObjectName";
import { objectDetailsStyles } from "../styles/screens/objectDetails";
import { astroImages } from "../helpers/scripts/loadImages";
import { getConstellationName } from "../helpers/scripts/getConstellationName";
import { app_colors, storageKeys } from "../helpers/constants";
import { getObjectType } from "../helpers/scripts/astro/getObjectType";
import { convertHMSToDegreeFromString } from "../helpers/scripts/astro/HmsToDegree";
import { convertDMSToDegreeFromString } from "../helpers/scripts/astro/DmsToDegree";
import { calculateHorizonAngle } from "../helpers/scripts/astro/calculateHorizonAngle";
import { useSpot } from "../contexts/ObservationSpotContext";
import { extractNumbers } from "../helpers/scripts/extractNumbers";
import { EquatorialCoordinate, GeographicCoordinate, getBodyNextRise, getBodyNextSet, isBodyCircumpolar, isBodyVisibleForNight, isTransitInstance } from "@observerly/astrometry";
import { useSettings } from "../contexts/AppSettingsContext";
import { prettyDec, prettyRa } from "../helpers/scripts/astro/prettyCoords";
import dayjs, { Dayjs } from "dayjs";
import PageTitle from "../components/commons/PageTitle";
import DSOValues from "../components/commons/DSOValues";
import { getObject, storeObject } from "../helpers/storage";
import { DSO } from "../helpers/types/DSO";
import { i18n } from "../helpers/scripts/i18n";

export default function ObjectDetails({ route, navigation }: any) {

  const { currentUserLocation } = useSettings()
  const { object, isVisible } = route.params;
  const { selectedSpot, defaultAltitude } = useSpot()

  const [riseTime, setRiseTime] = useState<Dayjs | boolean>(false)
  const [setTime, setSetTime] = useState<Dayjs | boolean>(false)
  const [willRise, setWillRise] = useState<boolean>(false)
  const [isCircumpolar, setIsCircumpolar] = useState<boolean>(false)

  const [selectedTimeBase, setSelectedTimeBase] = useState<'relative' | 'absolute'>('relative')

  const [favouriteObjects, setFavouriteObjects] = useState<DSO[]>([])

  useEffect(() => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const degRa = convertHMSToDegreeFromString(object.ra)
    const degDec = convertDMSToDegreeFromString(object.dec)
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))


    if (!degRa || !degDec || !horizonAngle) return;
    const target: EquatorialCoordinate = { ra: degRa, dec: degDec }
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }

    setWillRise(isBodyVisibleForNight(new Date(), observer, target, horizonAngle))
    setIsCircumpolar(isBodyCircumpolar(observer, target, horizonAngle))

    if (!isCircumpolar) {
      let rise = getBodyNextRise(new Date(), observer, target, horizonAngle)
      let set = getBodyNextSet(new Date(), observer, target, horizonAngle)

      if (isTransitInstance(rise)) {
        setRiseTime(dayjs(rise.datetime))
      }
      if (isTransitInstance(set)) {
        setSetTime(dayjs(set.datetime))
      }
    }
  }, [])

  useEffect(() => {
    (async () => {
      const favs = await getObject(storageKeys.favouriteObjects)
      if (!favs) return
      setFavouriteObjects(favs)
    })()
  }, [])

  const updateFavList = async (newList: DSO[]) => {
    await storeObject(storageKeys.favouriteObjects, newList)
  }

  const handleFavorite = async () => {
    if (favouriteObjects.some(obj => obj.name === object.name)) {
      console.log("remove")
      const favs = favouriteObjects.filter(obj => obj.name !== object.name)
      setFavouriteObjects(favs)
      await updateFavList(favs)

    } else {
      console.log("add")
      const favs = [...favouriteObjects, object]
      setFavouriteObjects(favs)
      await updateFavList(favs)
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('detailsPages.dso.title')}
        subtitle={i18n.t('detailsPages.dso.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <Text style={objectDetailsStyles.content.title}>{getObjectName(object, 'all', true).toUpperCase()}</Text>
        <Text style={objectDetailsStyles.content.subtitle}>{object.common_names.split(',')[0]}</Text>
        <Image style={objectDetailsStyles.content.image} source={astroImages[object.type.toUpperCase()]} />
        <View style={objectDetailsStyles.content.dsoInfos}>
          <DSOValues title={i18n.t('detailsPages.dso.labels.magnitude')} value={object.b_mag || object.v_mag} />
          <DSOValues title={i18n.t('detailsPages.dso.labels.constellation')} value={getConstellationName(object.const)} />
          <DSOValues title={i18n.t('detailsPages.dso.labels.type')} value={getObjectType(object)} />
          <DSOValues title={i18n.t('detailsPages.dso.labels.rightAscension')} value={prettyRa(object.ra)} />
          <DSOValues title={i18n.t('detailsPages.dso.labels.declination')} value={prettyDec(object.dec)} />
        </View>
        <View>
          <Text style={objectDetailsStyles.content.sectionTitle}>{i18n.t('common.observation.title')}</Text>
          <DSOValues chipValue chipColor={(object.v_mag || object.b_mag) > 6 ? app_colors.red_eighty : app_colors.green_eighty} title={i18n.t('common.observation.nakedEye')} value={(object.v_mag || object.b_mag) > 6 ? i18n.t('common.visibility.notVisible') : i18n.t('common.visibility.visible')} />
          <DSOValues chipValue chipColor={(object.v_mag || object.b_mag) > 8.5 ? app_colors.red_eighty : app_colors.green_eighty} title={i18n.t('common.observation.binoculars')} value={(object.v_mag || object.b_mag) > 8.5 ? i18n.t('common.visibility.notVisible') : i18n.t('common.visibility.visible')} />
          <DSOValues chipValue chipColor={app_colors.green_eighty} title={i18n.t('common.observation.telescope')} value={i18n.t('common.visibility.visible')} />
        </View>
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
          <DSOValues chipValue chipColor={(isCircumpolar && !currentUserLocation.lat.toString().startsWith('-')) ? app_colors.green_eighty : isVisible ? app_colors.green_eighty : app_colors.red_eighty} title={i18n.t('common.time.now')} value={(isCircumpolar && !currentUserLocation.lat.toString().startsWith('-')) ? i18n.t('common.visibility.visible') : isVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible')} />
          <DSOValues chipValue chipColor={willRise ? app_colors.green_eighty : app_colors.red_eighty} title="Cette nuit" value={willRise ? i18n.t('common.other.yes') : i18n.t('common.other.no')} />
          {
            typeof riseTime === 'object' && <DSOValues chipValue chipColor={app_colors.white_forty} title={i18n.t('common.visibility.nextRise')} value={selectedTimeBase === 'relative' ? dayjs().locale(i18n.locale).to(riseTime) : riseTime.add(2, 'hour').format('DD MMM à HH:mm').replace(':', 'h')} />
          }
          {
            typeof riseTime === 'boolean' && <DSOValues chipValue chipColor={app_colors.white_forty} title={i18n.t('common.visibility.nextRise')} value={isCircumpolar ? i18n.t('common.time.allNight') : i18n.t('common.time.never')} />
          }
          {
            typeof setTime === 'object' && <DSOValues chipValue chipColor={app_colors.white_forty} title={i18n.t('common.visibility.nextSet')} value={selectedTimeBase === 'relative' ? dayjs().locale(i18n.locale).to(setTime) : setTime.add(2, 'hour').format('DD MMM à HH:mm').replace(':', 'h')} />
          }
          {
            typeof setTime === 'boolean' && <DSOValues chipValue chipColor={app_colors.white_forty} title={i18n.t('common.visibility.nextSet')} value={isCircumpolar ? i18n.t('common.time.allNight') : i18n.t('common.time.never')} />
          }
        </View>

        <View style={objectDetailsStyles.content.favouritesContainer}>
          <TouchableOpacity style={objectDetailsStyles.content.favouritesContainer.button} onPress={() => handleFavorite()}>
            {
              favouriteObjects.some(obj => obj.name === object.name) ?
                <Image source={require('../../assets/icons/FiHeartFill.png')} style={[objectDetailsStyles.content.favouritesContainer.button.image, { tintColor: app_colors.red }]} />
                :
                <Image source={require('../../assets/icons/FiHeart.png')} style={objectDetailsStyles.content.favouritesContainer.button.image} />
            }
            <Text style={objectDetailsStyles.content.favouritesContainer.button.text}>{favouriteObjects.some(obj => obj.name === object.name) ? i18n.t('common.other.removeFav') : i18n.t('common.other.addFav')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
