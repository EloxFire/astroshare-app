import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";
import { objectDetailsStyles } from "../styles/screens/objectDetails";
import { astroImages } from "../helpers/scripts/loadImages";
import { useSettings } from "../contexts/AppSettingsContext";
import { EquatorialCoordinate, GeographicCoordinate, getBodyNextRise, getBodyNextSet, getConstellation, HorizontalCoordinate, isBodyCircumpolar, isBodyVisibleForNight, isTransitInstance, Planet } from "@observerly/astrometry";
import { getBrightStarName } from "../helpers/scripts/astro/objects/getBrightStarName";
import { convertDegreesDecToDMS } from "../helpers/scripts/astro/coords/convertDegreesDecToDms";
import { convertDegreesRaToHMS } from "../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import { getConstellationName } from "../helpers/scripts/getConstellationName";
import { calculateHorizonAngle } from "../helpers/scripts/astro/calculateHorizonAngle";
import { extractNumbers } from "../helpers/scripts/extractNumbers";
import { useSpot } from "../contexts/ObservationSpotContext";
import { app_colors, storageKeys } from "../helpers/constants";
import { getObject, storeObject } from "../helpers/storage";
import dayjs, { Dayjs } from "dayjs";
import { Star } from "../helpers/types/Star";
import DSOValues from "../components/commons/DSOValues";
import PageTitle from "../components/commons/PageTitle";

export default function BrightStarDetails({ route, navigation }: any) {

  const { currentUserLocation } = useSettings()
  const { selectedSpot, defaultAltitude } = useSpot()

  const [riseTime, setRiseTime] = useState<Dayjs | boolean>(false)
  const [setTime, setSetTime] = useState<Dayjs | boolean>(false)
  const [willRise, setWillRise] = useState<boolean>(false)
  const [isCircumpolar, setIsCircumpolar] = useState<boolean>(false)

  const [selectedTimeBase, setSelectedTimeBase] = useState<'relative' | 'absolute'>('relative')
  const [favouriteStars, setFavouriteStars] = useState<Star[]>([])

  const params = route.params;
  const star: Star = params.star;
  const starVisible = params.visible

  useEffect(() => {
    (async () => {
      const favs = await getObject(storageKeys.favouriteStars)
      if (!favs) return
      setFavouriteStars(favs)
    })()
  }, [])

  useEffect(() => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))


    if (!horizonAngle) return;
    const target: EquatorialCoordinate = { ra: star.ra, dec: star.dec }
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

  const updateFavList = async (newList: Star[]) => {
    await storeObject(storageKeys.favouriteStars, newList)
  }

  const handleFavorite = async () => {
    if (favouriteStars.some(obj => obj.ids === star.ids)) {
      console.log("remove")
      const favs = favouriteStars.filter(obj => obj.ids !== star.ids)
      setFavouriteStars(favs)
      await updateFavList(favs)

    } else {
      console.log("add")
      const favs = [...favouriteStars, star]
      setFavouriteStars(favs)
      await updateFavList(favs)
    }
  }


  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title="Détails de l'étoile"
        subtitle="// Toutes les infos que vous devez connaître !"
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <Text style={objectDetailsStyles.content.title}>{getBrightStarName(star.ids)}</Text>
        <Image style={objectDetailsStyles.content.image} source={astroImages['BRIGHTSTAR']} />
        <View style={objectDetailsStyles.content.dsoInfos}>
          <DSOValues title="Constellation" value={getConstellationName(getConstellation({ ra: star.ra, dec: star.dec })?.abbreviation || "Inconnu")} />
          <DSOValues title="Magnitude" value={star.V.toString() || star.B.toString()} />
          <DSOValues title="Ascension droite" value={convertDegreesRaToHMS(star.ra)} />
          <DSOValues title="Déclinaison" value={convertDegreesDecToDMS(star.dec)} />
        </View>
        <View>
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: 'space-between' }}>
            <Text style={objectDetailsStyles.content.sectionTitle}>Visibilité</Text>
            <View style={{ display: 'flex', flexDirection: 'row', alignItems: "center", justifyContent: 'flex-end' }}>
              <Text style={objectDetailsStyles.dsoValues.select.text}>Temps : </Text>
              <TouchableOpacity style={objectDetailsStyles.dsoValues.select} onPress={() => setSelectedTimeBase('relative')}>
                <Text style={[objectDetailsStyles.dsoValues.select.text, { backgroundColor: selectedTimeBase === 'relative' ? app_colors.white_forty : 'transparent' }]}>relatif</Text>
              </TouchableOpacity>
              <Text style={objectDetailsStyles.dsoValues.select.text}>/</Text>
              <TouchableOpacity style={objectDetailsStyles.dsoValues.select} onPress={() => setSelectedTimeBase('absolute')}>
                <Text style={[objectDetailsStyles.dsoValues.select.text, { backgroundColor: selectedTimeBase === 'absolute' ? app_colors.white_forty : 'transparent' }]}>absolu</Text>
              </TouchableOpacity>
            </View>
          </View>
          <DSOValues chipValue chipColor={(isCircumpolar && !currentUserLocation.lat.toString().startsWith('-')) ? app_colors.green_eighty : starVisible ? app_colors.green_eighty : app_colors.red_eighty} title="Maintenant" value={(isCircumpolar && !currentUserLocation.lat.toString().startsWith('-')) ? "Visible" : starVisible ? "Visible" : "Non visible"} />
          <DSOValues chipValue chipColor={willRise ? app_colors.green_eighty : app_colors.red_eighty} title="Cette nuit" value={willRise ? "Oui" : "Non"} />
          {
            typeof riseTime === 'object' && <DSOValues chipValue chipColor={app_colors.white_forty} title="Prochain lever" value={selectedTimeBase === 'relative' ? dayjs().to(riseTime) : riseTime.format('DD MMM à HH:mm').replace(':', 'h')} />
          }
          {
            typeof riseTime === 'boolean' && <DSOValues chipValue chipColor={app_colors.white_forty} title="Heure de lever" value={isCircumpolar ? 'Toute la nuit' : 'Jamais'} />
          }
          {
            typeof setTime === 'object' && <DSOValues chipValue chipColor={app_colors.white_forty} title="Prochain coucher" value={selectedTimeBase === 'relative' ? dayjs().to(setTime) : setTime.format('DD MMM à HH:mm').replace(':', 'h')} />
          }
          {
            typeof setTime === 'boolean' && <DSOValues chipValue chipColor={app_colors.white_forty} title="Heure de lever" value={isCircumpolar ? 'Toute la nuit' : 'Jamais'} />
          }
        </View>
        <View style={objectDetailsStyles.content.favouritesContainer}>
          <TouchableOpacity style={objectDetailsStyles.content.favouritesContainer.button} onPress={() => handleFavorite()}>
            {
              favouriteStars.some(obj => obj.ids === star.ids) ?
                <Image source={require('../../assets/icons/FiHeartFill.png')} style={[objectDetailsStyles.content.favouritesContainer.button.image, { tintColor: app_colors.red }]} />
                :
                <Image source={require('../../assets/icons/FiHeart.png')} style={objectDetailsStyles.content.favouritesContainer.button.image} />
            }
            <Text style={objectDetailsStyles.content.favouritesContainer.button.text}>{favouriteStars.some(obj => obj.ids === star.ids) ? 'Retirer des favoris' : 'Ajouter aux favoris'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
