import React from "react";
import {View} from "react-native";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {globalStyles} from "../../styles/global";

export default function CalculationHome({ navigation }: any) {

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.calculations.title')}
        subtitle={i18n.t('home.buttons.calculations.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <View style={globalStyles.screens.separator} />

      </View>
    </View>
  );
}
