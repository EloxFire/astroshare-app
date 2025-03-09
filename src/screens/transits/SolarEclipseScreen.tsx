import React, {useState} from "react";
import {ScrollView, View} from "react-native";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {solarEclipseScreenStyles} from "../../styles/screens/transits/solarEclipse";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {app_colors} from "../../helpers/constants";
import dayjs from "dayjs";
import {getSolarEclipse, isSolarEclipse} from "@observerly/astrometry";
import {useSettings} from "../../contexts/AppSettingsContext";

export default function SolarEclipseScreen({ navigation }: any) {

  const {currentUserLocation} = useSettings()
  const [loading, setLoading] = useState(false)

  const findNextEclipse = () => {
    setLoading(true)

    const endDate = dayjs().add(6, 'months').toDate();
    let startDate = new Date()
    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }

    // While startDate is less than endDate
    // Add 1 day to startDate

    const isEclipse = getSolarEclipse(dayjs().add(30, 'days').toDate(), observer);
    console.log(isEclipse)
    // while (startDate < endDate) {
    //   console.log(startDate, isEclipse)
    //   startDate.setDate(startDate.getDate() + 1);
    // }

    setLoading(false)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('transits.solarEclipse.title')}
        subtitle={i18n.t('transits.solarEclipse.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={solarEclipseScreenStyles.content}>
          <SimpleButton
            disabled={loading}
            fullWidth
            text={i18n.t('transits.solarEclipse.findNext')}
            backgroundColor={app_colors.white}
            textColor={app_colors.black} align={'center'}
            textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
            onPress={() => findNextEclipse()}
          />
        </View>
      </ScrollView>
    </View>
  );
}
