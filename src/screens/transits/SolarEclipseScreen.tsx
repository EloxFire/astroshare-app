import React, {useState} from "react";
import {ScrollView, Text, View} from "react-native";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {solarEclipseScreenStyles} from "../../styles/screens/transits/solarEclipse";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {app_colors} from "../../helpers/constants";
import dayjs from "dayjs";
import {getSolarEclipse, isSolarEclipse} from "@observerly/astrometry";
import {useSettings} from "../../contexts/AppSettingsContext";
import {astroshareApi} from "../../helpers/api";

export default function SolarEclipseScreen({ navigation }: any) {

  const {currentUserLocation} = useSettings()
  const [loading, setLoading] = useState(false)
  const [eclipses, setEclipses] = useState([])

  const findNextEclipse = async () => {
    setLoading(true)

    try {
      const eclipses = await astroshareApi.get('/eclipses/solar', {params: {year: dayjs().year()}})
      setEclipses(eclipses.data.response.data)
    }catch (e) {

    }
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

          {eclipses.map((eclipse: any) => {
            return (
              <View key={eclipse.id}>
                <Text style={{color: 'white'}}>{eclipse.calendarDate}</Text>
              </View>
            )
          })}
        </View>
      </ScrollView>
    </View>
  );
}
