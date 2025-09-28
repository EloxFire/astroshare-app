import React from "react";
import { ScrollView, Text, View } from "react-native";
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import PageTitle from "../../components/commons/PageTitle";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import IssPassCard from "../../components/cards/IssPassCard";
import {IssPass} from "../../helpers/types/IssPass";
import {issTrackerStyles} from "../../styles/screens/satelliteTracker/issTracker";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {app_colors} from "../../helpers/constants";

dayjs.locale('fr');

export default function IssPasses({ navigation, route }: any) {
  const params = route.params;

  // Regrouper les passages par date
  const passesByDate = params.passes.reduce((acc: { [date: string]: any[] }, pass: any) => {
    const dateString = dayjs.unix(pass.startUTC).format('dddd D MMMM YYYY');
    if (!acc[dateString]) {
      acc[dateString] = [];
    }
    acc[dateString].push(pass);
    return acc;
  }, {});

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('satelliteTracker.issTracker.nextPasses.title')}
        subtitle={i18n.t('satelliteTracker.issTracker.nextPasses.description')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView contentContainerStyle={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 80 }}>
        {Object.keys(passesByDate).length === 0 && (
          <SimpleButton textColor={app_colors.white} backgroundColor={app_colors.white_forty} text={i18n.t('satelliteTracker.issTracker.nextPasses.noPasses')} disabled />
        )}
        {Object.entries(passesByDate).map(([date, passes]) => (
          <View key={date}>
            <Text style={issTrackerStyles.content.nextPasses.date}>{date.charAt(0).toUpperCase() + date.slice(1)}</Text>
            <View style={{display: 'flex', gap: 5}}>
              {passes.map((pass: IssPass, index: number) => (
                <IssPassCard
                  pass={pass}
                  navigation={navigation}
                  key={`${pass.startUTC}-${index}`}
                  passIndex={index}
                  weather={params.weather}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
