import React from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import { launcheScreenStyles } from "../../styles/launches/launches";
import { app_colors } from "../../helpers/constants";
import { useLaunchData } from "../../contexts/LaunchContext";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import PageTitle from "../../components/commons/PageTitle";
import LaunchCard from "../../components/cards/LaunchCard";

export default function LaunchesScreen({ navigation }: any) {

    const {launchData, launchContextLoading} = useLaunchData()

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.launches_screen.title')}
        subtitle={i18n.t('home.buttons.launches_screen.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={launcheScreenStyles.content}>
          {
            !launchContextLoading ?
              launchData.length > 0 ?
              launchData.map((launch: any, index: number) => (
                  <LaunchCard key={index} launch={launch} navigation={navigation} />
                ))
                :
                <SimpleButton disabled text="Aucun lancements trouvés..."/>
            :
            <ActivityIndicator size="large" color={app_colors.white} />
          }
        </View>
      </ScrollView>
    </View>
  );
}
