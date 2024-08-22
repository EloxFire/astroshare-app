import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../styles/global";
import { objectDetailsStyles } from "../styles/screens/objectDetails";
import { astroImages } from "../helpers/scripts/loadImages";
import { useSettings } from "../contexts/AppSettingsContext";
import PageTitle from "../components/commons/PageTitle";
import { EclipticCoordinate, EquatorialCoordinate, HorizontalCoordinate, Planet } from "@observerly/astrometry";
import DSOValues from "../components/commons/DSOValues";
import { GlobalPlanet } from "../helpers/types/GlobalPlanet";
import { getObject, storeObject } from "../helpers/storage";
import { app_colors, storageKeys } from "../helpers/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function PlanetDetails({ route, navigation }: any) {

  const { currentUserLocation } = useSettings()
  const params = route.params;
  const planet: GlobalPlanet = params.planet;
  const planetVisible = params.visible

  const [selectedTimeBase, setSelectedTimeBase] = useState<'relative' | 'absolute'>('relative')
  const [favouritePlanets, setFavouritePlanets] = useState<GlobalPlanet[]>([])

  useEffect(() => {
    (async () => {
      const favs = await getObject(storageKeys.favouritePlanets)
      if (!favs) return
      setFavouritePlanets(favs)
    })()
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
        title="Détails de la planète"
        subtitle="// Toutes les infos que vous devez connaître !"
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <Text style={objectDetailsStyles.content.title}>{planet.name.toUpperCase()}</Text>
        {planet.name === 'Earth' && <Text style={objectDetailsStyles.content.subtitle}>Berceau de la civilisation</Text>}
        <Image style={objectDetailsStyles.content.image} source={astroImages[planet.name.toUpperCase()]} />
        <View style={objectDetailsStyles.content.dsoInfos}>
          <DSOValues title="Symbole" value={planet.symbol} />
          <DSOValues title="Position" value={planet.name === 'Earth' ? "3ème planète" : planet.isInferior ? "Avant la Terre" : "Après la Terre"} />
          <DSOValues title="Inclinaison" value={(23.5 + parseFloat(planet.i.toFixed(1))).toString() + "°"} />
          <DSOValues title="Masse" value={planet.name === 'Earth' ? (9.972e24 + " Kg").toString() : planet.i.toFixed(2) + "x Terre"} />
          <DSOValues title="Période orbitale" value={planet.name === 'Earth' ? "365.25 jours" : planet.T + " années"} />
          <DSOValues title="Distance" value={planet.name === 'Earth' ? "Vous êtes ici" : planet.a.toFixed(2) + "M Km"} />
          <DSOValues title="Diamètre" value={(planet.r * 2).toString() + " Km"} />
        </View>
        <View style={objectDetailsStyles.content.favouritesContainer}>
          <TouchableOpacity style={objectDetailsStyles.content.favouritesContainer.button} onPress={() => handleFavorite()}>
            {
              favouritePlanets.some(obj => obj.name === planet.name) ?
                <Image source={require('../../assets/icons/FiHeartFill.png')} style={[objectDetailsStyles.content.favouritesContainer.button.image, { tintColor: app_colors.red }]} />
                :
                <Image source={require('../../assets/icons/FiHeart.png')} style={objectDetailsStyles.content.favouritesContainer.button.image} />
            }
            <Text style={objectDetailsStyles.content.favouritesContainer.button.text}>{favouritePlanets.some(obj => obj.name === planet.name) ? 'Retirer des favoris' : 'Ajouter aux favoris'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
