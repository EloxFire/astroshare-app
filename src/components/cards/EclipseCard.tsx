import {ActivityIndicator, Image, Text, TouchableOpacity, View} from "react-native";
import {eclipseCardStyles} from "../../styles/components/cards/EclipseCard";
import {SolarEclipse} from "../../helpers/types/eclipses/SolarEclipse";
import { SvgUri } from 'react-native-svg';
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {app_colors, solarEclipseTypes} from "../../helpers/constants";
import DSOValues from "../commons/DSOValues";
import SimpleButton from "../commons/buttons/SimpleButton";
import {routes} from "../../helpers/routes";

interface CardProps {
  eclipse: SolarEclipse
  navigation: any
}

export const EclipseCard = ({eclipse, navigation}: CardProps) => {

  const [loadingImage, setLoadingImage] = useState(true)
  // const eclipseCenter = [eclipse.events.greatest?.location.geometry.coordinates[0], eclipse.events.greatest?.location.geometry.coordinates[1]]

  useEffect(() => {

  }, []);

  return (
    <View style={eclipseCardStyles.card}>
      {
        loadingImage && (
          <View style={{width: 120, height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={'small'} color={'white'} />
          </View>
        )
      }
      <SvgUri onLoad={() => setLoadingImage(false)} uri={`${eclipse.link.image}&image-size=600,600&map-projection=EPSG:9840&map-labels=fr&map-theme=land-medium`} width={120} height={120}/>
      <View style={eclipseCardStyles.card.infos}>
        <Text style={eclipseCardStyles.card.infos.title}>{dayjs(eclipse.calendarDate).format('DD MMMM YYYY')}</Text>
        <Text style={eclipseCardStyles.card.infos.subtitle}>{solarEclipseTypes[eclipse.type]}</Text>

        <View style={{marginVertical: 10}}>
          <DSOValues small title={"Début:"} value={dayjs(eclipse.events.P1?.date).format('HH:mm:ss').replace(':', 'h ').replace(':', 'm ') + 's'}/>
          <DSOValues small title={"Max:"} value={dayjs(eclipse.events.greatest?.date).format('HH:mm:ss').replace(':', 'h ').replace(':', 'm ') + 's'}/>
          <DSOValues small title={"Fin:"} value={dayjs(eclipse.events.P4?.date).format('HH:mm:ss').replace(':', 'h ').replace(':', 'm ') + 's'}/>
        </View>
        <SimpleButton small fullWidth onPress={() => {navigation.push(routes.transits.eclipses.solarDetails.path, {eclipse: eclipse})}} align={'center'} text={"En savoir plus"} backgroundColor={app_colors.white} textColor={app_colors.black} />
      </View>
    </View>
  )
}