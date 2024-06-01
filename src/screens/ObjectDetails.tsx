import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { globalStyles } from "../styles/global";
import { getObjectName } from "../helpers/scripts/astro/getObjectName";
import { objectDetailsStyles } from "../styles/screens/objectDetails";
import { astroImages } from "../helpers/scripts/loadImages";
import { getConstellationName } from "../helpers/scripts/getConstellationName";
import { app_colors } from "../helpers/constants";
import { getObjectType } from "../helpers/scripts/astro/getObjectType";
import { convertHMSToDegreeFromString } from "../helpers/scripts/astro/HmsToDegree";
import { convertDMSToDegreeFromString } from "../helpers/scripts/astro/DmsToDegree";
import PageTitle from "../components/commons/PageTitle";
import DSOValues from "../components/commons/DSOValues";
import { ephemerisBarStyles } from "../styles/components/weather/ephemerisBar";
import SingleValue from "../components/weather/SingleValue";
import { calculateHorizonAngle } from "../helpers/scripts/astro/calculateHorizonAngle";
import dayjs from "dayjs";
import { useSpot } from "../contexts/ObservationSpotContext";
import { extractNumbers } from "../helpers/scripts/extractNumbers";
import { EquatorialCoordinate, GeographicCoordinate, getBodyNextRise, getBodyNextSet, isBodyVisibleForNight, isTransitInstance } from "@observerly/astrometry";
import { useSettings } from "../contexts/AppSettingsContext";

export default function ObjectDetails({ route, navigation }: any) {

  const {currentUserLocation} = useSettings()
  const { object, isVisible } = route.params;
  const { selectedSpot, defaultAltitude } = useSpot()

  const [riseTime, setRiseTime] = useState<string | boolean>(false)
  const [setTime, setSetTime] = useState<string | boolean>(false)
  const [willRise, setWillRise] = useState<boolean>(false)

  useEffect(() => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    const degRa = convertHMSToDegreeFromString(object.ra)
    const degDec = convertDMSToDegreeFromString(object.dec)
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))
    
    
    if (!degRa || !degDec || !horizonAngle) return;
    const target: EquatorialCoordinate = { ra: degRa, dec: degDec }
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    
    setWillRise(isBodyVisibleForNight(new Date(), observer, target, horizonAngle))
    
    
    // let set = getBodyNextSet(new Date(), observer, target, horizonAngle)
    // console.log(set);
    
    // console.log(getBodyNextRise(new Date(), observer, target, horizonAngle));
    
    // let rise = 
    // console.log(rise);
    
    
    // if (isTransitInstance(set)) {
    //   setSetTime(dayjs(set.datetime).format('HH:mm'))
    // }
    // if(isTransitInstance(rise)) {
    //   setRiseTime(dayjs(rise.datetime).format('HH:mm'))
    // }
      
  }, [])

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title="Détails de l'objet"
        subtitle="// Toutes les infos que vous devez connaître !"
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <Text style={objectDetailsStyles.content.title}>{getObjectName(object, 'all', true).toUpperCase()}</Text>
        <Text style={objectDetailsStyles.content.subtitle}>{object.common_names.split(',')[0]}</Text>
        <Image style={objectDetailsStyles.content.image} source={astroImages[object.type.toUpperCase()]} />
        <View style={objectDetailsStyles.content.dsoInfos}>
          <DSOValues title="Magnitude" value={object.b_mag || object.v_mag} />
          <DSOValues title="Constellation" value={getConstellationName(object.const)} />
          <DSOValues title="Type" value={getObjectType(object)} />
          <DSOValues title="Ascension droite" value={object.ra.replace(':', 'h ').replace(':', 'm ') + 's'} />
          <DSOValues title="Déclinaison" value={object.dec.replace(':', '° ').replace(':', 'm ') + 's'} />
        </View>
        <View>
          <Text style={objectDetailsStyles.content.sectionTitle}>Observation</Text>
          <DSOValues chipValue chipColor={(object.v_mag || object.b_mag) > 6 ? app_colors.red_eighty : app_colors.green_eighty} title="Oeil nu" value={(object.v_mag || object.b_mag) > 6 ? "Non visible" : "Visible"} />
          <DSOValues chipValue chipColor={(object.v_mag || object.b_mag) > 8.5 ? app_colors.red_eighty : app_colors.green_eighty} title="Jumelles" value={(object.v_mag || object.b_mag) > 8.5 ? "Non visible" : "Visible"} />
          <DSOValues chipValue chipColor={app_colors.green_eighty} title="Télescope" value="Visible" />
        </View>
        <View>
          <Text style={objectDetailsStyles.content.sectionTitle}>Visibilité</Text>
          <DSOValues chipValue chipColor={isVisible ? app_colors.green_eighty : app_colors.red_eighty} title="Maintenant" value={isVisible ? "Visible" : "Non visible"} />
          <DSOValues chipValue chipColor={willRise ? app_colors.green_eighty : app_colors.red_eighty} title="Cette nuit" value={willRise ? "Oui" : "Non"} />          
          {/* <DSOValues chipValue chipColor={app_colors.white_forty} title="Heure de lever" value="TDB" />
          <DSOValues chipValue chipColor={app_colors.white_forty} title="Heure de coucher" value="TDB" /> */}
          {
            typeof riseTime === 'string' && <DSOValues chipValue chipColor={app_colors.white_forty} title="Heure de lever" value={riseTime} />
          }
          {
            typeof riseTime === 'boolean' && <DSOValues chipValue chipColor={riseTime === true ? app_colors.green_eighty : app_colors.red_eighty} title="Heure de lever" value={riseTime ? 'Toute la nuit' : '#Erreur'} />
          }
          {
            typeof setTime === 'string' && <DSOValues chipValue chipColor={app_colors.white_forty} title="Heure de coucher" value={setTime} />
          }
          {
            typeof setTime === 'boolean' && <DSOValues chipValue chipColor={riseTime === true ? app_colors.green_eighty : app_colors.red_eighty} title="Heure de lever" value={riseTime ? 'Toute la nuit' : '#Erreur'} />
          }
          {/* <View style={[ephemerisBarStyles.container, {marginTop: 20}]}>
            <View style={ephemerisBarStyles.container.sideColumn}>
              <Image style={ephemerisBarStyles.container.sideColumn.icon} source={require('../../assets/icons/FiSunrise.png')} />
              <SingleValue value="12h23" />
            </View>
            <View style={ephemerisBarStyles.container.bar}>
              <View style={[ephemerisBarStyles.container.bar.progress, {width: `50%`}]}/>
            </View>
            <View style={ephemerisBarStyles.container.sideColumn}>
              <Image style={ephemerisBarStyles.container.sideColumn.icon} source={require('../../assets/icons/FiSunset.png')} />
              <SingleValue value="23h32" />
            </View>
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
}
