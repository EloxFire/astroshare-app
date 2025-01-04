import React, {useEffect, useState} from "react";
import {Image, ImageSourcePropType, Text, TouchableOpacity, View} from "react-native";
import {planetariumUIStyles} from "../../styles/components/skymap/planetariumUI";
import {routes} from "../../helpers/routes";
import {useSettings} from "../../contexts/AppSettingsContext";
import dayjs from "dayjs";
import {getBrightStarName} from "../../helpers/scripts/astro/objects/getBrightStarName";
import {texturePaths} from "../../helpers/scripts/astro/skymap/createStarMaterial";
import {isNight} from "@observerly/astrometry";

interface PlanetariumUIProps {
  navigation: any;
  infos: any | null;
  infoType: 'constellation' | 'star' | 'planet' | 'dso'  | null;
}

export default function PlanetariumUI({ navigation, infoType, infos }: PlanetariumUIProps) {

  const {currentUserLocation} = useSettings();
  const [currentTime, setCurrentTime] = useState<string>(dayjs().format('HH:mm'));
  const [isNightTime, setIsNightTime] = useState<boolean>(false);
  const [starImage, setStarImage] = useState<ImageSourcePropType>(require('../../../assets/images/planetarium/stars/A.png'));

  const updateClock = () => {
    setCurrentTime(dayjs().format('HH:mm'));
    setIsNightTime(isNight(new Date, {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateClock();
    }, 1000);

    if(infos){
      console.log("INFOOOOOOOOOOOOOOOS", infos);
    }

    return () => clearInterval(interval);
  }, [infos]);


  return (
    <View style={planetariumUIStyles.container}>
      <TouchableOpacity style={planetariumUIStyles.container.backButton} onPress={() => navigation.navigate(routes.skymapSelection.path)}>
        <Image style={planetariumUIStyles.container.backButton.icon} source={require('../../../assets/icons/FiChevronDown.png')} />
        {/*<Text style={planetariumUIStyles.container.backButton.text}>Retour</Text>*/}
      </TouchableOpacity>

      <TouchableOpacity style={planetariumUIStyles.container.layerButton} onPress={() => navigation.navigate(routes.skymapSelection.path)}>
        <Image style={planetariumUIStyles.container.layerButton.icon} source={require('../../../assets/icons/FiLayers.png')} />
      </TouchableOpacity>

      <View style={planetariumUIStyles.container.generalInfosBar}>
        <View style={planetariumUIStyles.container.generalInfosBar.header}>
          <Text  style={planetariumUIStyles.container.generalInfosBar.header.location}>{currentUserLocation.common_name}</Text>
          <Text style={planetariumUIStyles.container.generalInfosBar.header.clock}>{currentTime.replace(':', 'h')}</Text>
          <Text  style={planetariumUIStyles.container.generalInfosBar.header.location}>{isNightTime ? "(Nuit)" : "(Journée)"}</Text>
        </View>
        {infos && (
          <View style={planetariumUIStyles.container.generalInfosBar.body}>
            <Image style={planetariumUIStyles.container.generalInfosBar.body.image} source={texturePaths[infos.sp_type[0]] as ImageSourcePropType} />
            <Text style={planetariumUIStyles.container.generalInfosBar.body.title}>{getBrightStarName(infos.ids)}</Text>
          </View>
        )}
      </View>
    </View>
  );
}