import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";
import { objectDetailsStyles } from "../styles/screens/objectDetails";
import { astroImages } from "../helpers/scripts/loadImages";
import { useSettings } from "../contexts/AppSettingsContext";
import PageTitle from "../components/commons/PageTitle";
import { EclipticCoordinate, EquatorialCoordinate, GeographicCoordinate, getBodyNextRise, getBodyNextSet, getConstellation, HorizontalCoordinate, isBodyCircumpolar, isBodyVisibleForNight, isTransitInstance, Planet } from "@observerly/astrometry";
import DSOValues from "../components/commons/DSOValues";
import { GlobalPlanet } from "../helpers/types/GlobalPlanet";
import { Star } from "../helpers/types/Star";
import { getBrightStarName } from "../helpers/scripts/astro/objects/getBrightStarName";
import { convertDegreesDecToDMS } from "../helpers/scripts/astro/coords/convertDegreesDecToDms";
import { convertDegreesRaToHMS } from "../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import { getConstellationName } from "../helpers/scripts/getConstellationName";
import dayjs, { Dayjs } from "dayjs";
import { calculateHorizonAngle } from "../helpers/scripts/astro/calculateHorizonAngle";
import { extractNumbers } from "../helpers/scripts/extractNumbers";
import { useSpot } from "../contexts/ObservationSpotContext";
import { app_colors } from "../helpers/constants";

export default function BrightStarDetails({ route, navigation }: any) {

  const { currentUserLocation } = useSettings()
  const { object, isVisible } = route.params;
  const { selectedSpot, defaultAltitude } = useSpot()

  const [riseTime, setRiseTime] = useState<Dayjs | boolean>(false)
  const [setTime, setSetTime] = useState<Dayjs | boolean>(false)
  const [willRise, setWillRise] = useState<boolean>(false)
  const [isCircumpolar, setIsCircumpolar] = useState<boolean>(false)

  const params = route.params;
  const star: Star = params.star;

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

  const [selectedTimeBase, setSelectedTimeBase] = useState<'relative' | 'absolute'>('relative')

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
          <DSOValues chipValue chipColor={(isCircumpolar && !currentUserLocation.lat.toString().startsWith('-')) ? app_colors.green_eighty : isVisible ? app_colors.green_eighty : app_colors.red_eighty} title="Maintenant" value={(isCircumpolar && !currentUserLocation.lat.toString().startsWith('-')) ? "Visible" : isVisible ? "Visible" : "Non visible"} />
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
      </ScrollView>
    </View>
  );
}
