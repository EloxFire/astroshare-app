import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { globalStyles } from "../styles/global";
import { objectDetailsStyles } from "../styles/screens/objectDetails";
import { astroImages } from "../helpers/scripts/loadImages";
import { useSettings } from "../contexts/AppSettingsContext";
import PageTitle from "../components/commons/PageTitle";
import { EclipticCoordinate, EquatorialCoordinate, getConstellation, HorizontalCoordinate, Planet } from "@observerly/astrometry";
import DSOValues from "../components/commons/DSOValues";
import { GlobalPlanet } from "../helpers/types/GlobalPlanet";
import { Star } from "../helpers/types/Star";
import { getBrightStarName } from "../helpers/scripts/astro/objects/getBrightStarName";
import { convertDegreesDecToDMS } from "../helpers/scripts/astro/coords/convertDegreesDecToDms";
import { convertDegreesRaToHMS } from "../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import { getConstellationName } from "../helpers/scripts/getConstellationName";

export default function BrightStarDetails({ route, navigation }: any) {

  const { currentUserLocation } = useSettings()
  const params = route.params;
  const star: Star = params.star;

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
          <DSOValues title="Distance" value={convertDegreesDecToDMS(star.dec)} />
          <DSOValues title="Déclinaison" value={convertDegreesRaToHMS(star.ra)} />
        </View>
      </ScrollView>
    </View>
  );
}
