import React from "react";
import {ScrollView, Text, View} from "react-native";
import PageTitle from "../../components/commons/PageTitle";
import {globalStyles} from "../../styles/global";
import {i18n} from "../../helpers/scripts/i18n";
import IssPassCard from "../../components/cards/IssPassCard";

export default function IssPasses({ navigation, route }: any) {

  const params = route.params;

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('satelliteTracker.issTracker.nextPasses.title')}
        subtitle={i18n.t('satelliteTracker.issTracker.nextPasses.description')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView contentContainerStyle={{display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 80}}>
          {params.passes.map((pass: any, index: number) => (
            <IssPassCard pass={pass} navigation={navigation} key={index} passIndex={index} weather={params.weather} />
          ))}
      </ScrollView>
    </View>
  );
}
