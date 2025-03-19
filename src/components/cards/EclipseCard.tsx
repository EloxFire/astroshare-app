import {ActivityIndicator, Text, View} from "react-native";
import {eclipseCardStyles} from "../../styles/components/cards/EclipseCard";
import {SolarEclipse} from "../../helpers/types/eclipses/SolarEclipse";
import { SvgUri } from 'react-native-svg';
import {useState} from "react";
import dayjs from "dayjs";
import {app_colors, solarEclipseTypes} from "../../helpers/constants";
import DSOValues from "../commons/DSOValues";
import SimpleButton from "../commons/buttons/SimpleButton";
import {routes} from "../../helpers/routes";
import {LunarEclipse} from "../../helpers/types/LunarEclipse";

interface CardProps {
  type: 'solar' | 'lunar'
  eclipse: SolarEclipse | LunarEclipse
  navigation: any
}

export const EclipseCard = ({type, eclipse, navigation}: CardProps) => {

  const [loadingImage, setLoadingImage] = useState(true)

  const handleDetailsRoute = () => {
    if (type === 'solar') {
      navigation.push(routes.transits.eclipses.solarDetails.path, {eclipse: eclipse})
    } else {
      navigation.push(routes.transits.eclipses.lunarDetails.path, {eclipse: eclipse})
    }
  }

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
          <DSOValues small title={"Fin:"} value={type === 'solar' ? dayjs(((eclipse) as SolarEclipse).events.P4?.date).format('HH:mm:ss').replace(':', 'h ').replace(':', 'm ') + 's' : dayjs(((eclipse) as LunarEclipse).events.P2?.date).format('HH:mm:ss').replace(':', 'h ').replace(':', 'm ') + 's'}/>
        </View>
        <SimpleButton small fullWidth onPress={() => handleDetailsRoute()} align={'center'} text={"En savoir plus"} backgroundColor={app_colors.white} textColor={app_colors.black} />
      </View>
    </View>
  )
}