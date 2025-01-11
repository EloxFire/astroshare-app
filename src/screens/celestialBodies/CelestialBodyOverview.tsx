import React, { useEffect, useState } from "react";
import {DSO} from "../../helpers/types/DSO";
import {getObject, storeObject} from "../../helpers/storage";
import {storageKeys} from "../../helpers/constants";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {ScrollView, View} from "react-native";
import {i18n} from "../../helpers/scripts/i18n";
import {celestialBodiesOverviewStyles} from "../../styles/screens/celestialBodies/celestialBodies";

export default function CelestialBodyOverview({ route, navigation }: any) {

  const { object, isVisible } = route.params;

  const [favouriteObjects, setFavouriteObjects] = useState<DSO[]>([])


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
      <ScrollView style={celestialBodiesOverviewStyles.content}>
        <View style={celestialBodiesOverviewStyles.content.header}></View>
      </ScrollView>
    </View>
  );
}
