import React from 'react';
import {ScrollView, Text, View} from "react-native";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {observationPlannerScreenStyles} from "../../styles/screens/observationPlanner/observationPlannerScreen";

function ObservationPlannerScreen({navigation}: any) {
  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.observationPlanner.title')}
        subtitle={i18n.t('home.buttons.observationPlanner.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={observationPlannerScreenStyles.content}>

        </View>
      </ScrollView>
    </View>
  );
}

export default ObservationPlannerScreen;