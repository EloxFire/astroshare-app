import React, {useEffect, useState} from "react";
import {ActivityIndicator, ScrollView, Text, View} from "react-native";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {solarEclipseScreenStyles} from "../../styles/screens/transits/solarEclipse";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {app_colors} from "../../helpers/constants";
import dayjs from "dayjs";
import {useSettings} from "../../contexts/AppSettingsContext";
import {astroshareApi} from "../../helpers/api";
import {EclipseCard} from "../../components/cards/EclipseCard";
// @ts-ignore
import CheckBox from 'react-native-check-box'
import {LunarEclipse} from "../../helpers/types/LunarEclipse";
import ScreenInfo from "../../components/ScreenInfo";
import {useAuth} from "../../contexts/AuthContext";
import {useTranslation} from "../../hooks/useTranslation";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";

export default function LunarEclipsesScreen({ navigation }: any) {

  const {currentUserLocation} = useSettings()
  const {currentUser} = useAuth()
  const {currentLocale} = useTranslation()

  const [loading, setLoading] = useState(false)
  const [selectedYear, setSelectedYear] = useState(dayjs().year())
  const [eclipses, setEclipses] = useState<LunarEclipse[]>([])
  const [showOnlyVisible, setShowOnlyVisible] = useState(true)

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Lunar eclipses screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, []);

  const findNextEclipse = async () => {
    console.log({params: {year: selectedYear, observer: `[${currentUserLocation.lat},${currentUserLocation.lon}]`}})
    setLoading(true)
    setEclipses([])

    try {
      const eclipses = await astroshareApi.get('/eclipses/lunar', {params: {year: selectedYear, observer: showOnlyVisible ? `${currentUserLocation.lat},${currentUserLocation.lon}` : undefined}})
      setEclipses(eclipses.data)
      setLoading(false)
    }catch (e) {
      console.log("Error while fetching solar eclipses")
    }
    setLoading(false)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('transits.lunarEclipse.title')}
        subtitle={i18n.t('transits.lunarEclipse.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={solarEclipseScreenStyles.content}>
          <CheckBox
            disabled={loading}
            style={{flex: 1, paddingVertical: 5, color: app_colors.white, marginBottom: 10}}
            onClick={() => setShowOnlyVisible(!showOnlyVisible)}
            isChecked={showOnlyVisible}
            checkBoxColor={app_colors.white}
            leftTextStyle={{color: app_colors.white_sixty, fontFamily: 'GilroyRegular'}}
            leftText={"Visible uniquement depuis ma position"}
          />
          <View style={{display: 'flex', flexDirection: 'row', gap: 10, borderBottomWidth: 1, borderBottomColor: app_colors.white_twenty, paddingBottom: 10}}>
            <SimpleButton
              disabled={loading}
              textColor={app_colors.white_sixty}
              align={'center'}
              textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
              active
              icon={require('../../../assets/icons/FiChevronLeft.png')}
              onPress={() => setSelectedYear(selectedYear - 1)}
              activeBorderColor={app_colors.white_twenty}
            />

            <Text style={solarEclipseScreenStyles.content.yearInput}>{selectedYear}</Text>

            <SimpleButton
              disabled={loading}
              textColor={app_colors.white_sixty}
              align={'center'}
              textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
              active
              icon={require('../../../assets/icons/FiChevronRight.png')}
              onPress={() => setSelectedYear(selectedYear + 1)}
              activeBorderColor={app_colors.white_twenty}
            />

            <SimpleButton
              disabled={loading}
              text={"Rechercher"}
              icon={require('../../../assets/icons/FiSearch.png')}
              iconColor={app_colors.black}
              backgroundColor={app_colors.white}
              textColor={app_colors.black}
              align={'center'}
              small
              textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
              onPress={() => findNextEclipse()}
            />
          </View>

          <View style={{display: 'flex', gap: 10, marginTop: 20}}>
            {
              eclipses.length === 0 && !loading && (
                <ScreenInfo image={require('../../../assets/icons/FiInfo.png')} text={i18n.t('transits.lunarEclipse.hint')} />
              )
            }
            {loading ?
              <ActivityIndicator size={"large"} color={app_colors.white} pointerEvents={'none'} />
            :
              eclipses.map((eclipse: LunarEclipse) => {
                return (
                  <EclipseCard
                    type={"lunar"}
                    key={`${eclipse.calendarDate}-${eclipse.duration.penumbral}`}
                    eclipse={eclipse}
                    navigation={navigation}
                  />
                )
              })
            }
          </View>
        </View>
        {
          !loading && eclipses.length > 0 &&
            <ScreenInfo image={require('../../../assets/icons/FiInfo.png')} text={i18n.t('transits.lunarEclipse.imcceQuote')}/>
        }
      </ScrollView>
    </View>
  );
}
