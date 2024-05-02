import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { globalStyles } from "../styles/global";
import { useSettings } from "../contexts/AppSettingsContext";
import { getObjectName } from "../helpers/scripts/astro/getObjectName";
import PageTitle from "../components/commons/PageTitle";
import { objectDetailsStyles } from "../styles/screens/objectDetails";
import { astroImages } from "../helpers/scripts/loadImages";
import { getConstellationName } from "../helpers/scripts/getConstellationName";
import { app_colors } from "../helpers/constants";
import { searchResultCardStyles } from "../styles/components/searchResultCard";

export default function ObjectDetails({ route, navigation }: any) {

  const { isNightMode, setIsNightMode } = useSettings()
  const { object, isVisible } = route.params;

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title="Détails de l'objet"
        subtitle="// Toutes les infos que vous devez savoir !"
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={objectDetailsStyles.content}>
          <View style={objectDetailsStyles.content.header}>
            <View>
              <Text style={objectDetailsStyles.content.header.title}>{getObjectName(object, 'all', true).toUpperCase()}</Text>
              <Text style={objectDetailsStyles.content.header.subtitle}>{object.common_names.split(',')[0]}</Text>
            </View>
            <Image style={objectDetailsStyles.content.header.image} source={astroImages[object.type.toUpperCase()]} />
          </View>
          <View style={objectDetailsStyles.content.body}>
            <Text style={objectDetailsStyles.content.body.title}>Infos générales</Text>
            <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Magnitude :</Text>
              <Text style={objectDetailsStyles.content.body.info.value}>{object.b_mag || object.v_mag}</Text>
            </View>
            <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Constellation :</Text>
              <Text style={objectDetailsStyles.content.body.info.value}>{getConstellationName(object.const)}</Text>
            </View>
            <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Ascension droite :</Text>
              <Text style={objectDetailsStyles.content.body.info.value}>{object.ra.replace(':', 'h ').replace(':', 'm ')}s</Text>
            </View>
            <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Déclinaison :</Text>
              <Text style={objectDetailsStyles.content.body.info.value}>{object.dec.replace(':', '° ').replace(':', 'm ')}s</Text>
            </View>
            <Text style={[objectDetailsStyles.content.body.title, { marginTop: 40 }]}>Observation</Text>
            <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Visibilité :</Text>
              <Text style={[searchResultCardStyles.card.chip, {backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty}]}>{isVisible ? "Visible" : "Non visible"}</Text>
            </View>
            {/* <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Lever :</Text>
              <Text style={[searchResultCardStyles.card.chip, {backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty}]}>{isVisible ? "Visible" : "Non visible"}</Text>
            </View>
            <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Coucher :</Text>
              <Text style={[searchResultCardStyles.card.chip, {backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty}]}>{isVisible ? "Visible" : "Non visible"}</Text>
            </View> */}
            <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Oeil nu :</Text>
              <Text style={[searchResultCardStyles.card.chip, {backgroundColor: (object.v_mag || object.b_mag) > 6 ? app_colors.red_eighty : app_colors.green_eighty}]}>{(object.v_mag || object.b_mag) > 6 ? "Non visible" : "Visible"}</Text>
            </View>
            <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Jumelles :</Text>
              <Text style={[searchResultCardStyles.card.chip, {backgroundColor: (object.v_mag || object.b_mag) > 8.5 ? app_colors.red_eighty : app_colors.green_eighty}]}>{(object.v_mag || object.b_mag) > 8.5 ? "Non visible" : "Visible"}</Text>
            </View>
            <View style={objectDetailsStyles.content.body.info}>
              <Text style={objectDetailsStyles.content.body.info.title}>Télescope :</Text>
              <Text style={[searchResultCardStyles.card.chip, {backgroundColor: app_colors.green_eighty}]}>Visible</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
