import React from 'react'
import { View, ScrollView, Text } from 'react-native'
import PageTitle from '../components/commons/PageTitle'
import { i18n } from '../helpers/scripts/i18n'
import { globalStyles } from '../styles/global'
import { settingsStyles } from '../styles/screens/settings'

export default function AstroDataInfos({ navigation }: any) {
  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('settings.buttons.data.title')}
        subtitle={i18n.t('settings.buttons.data.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={settingsStyles.content}>
          <View style={globalStyles.globalContainer}>
            <Text style={globalStyles.sections.title}>{i18n.t('astroDataInfos.dso.title')}</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.dso.text1')}</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 3 }]}>- Messier (M)</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 3 }]}>- New General Catalog (NGC)</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 3 }]}>- Saguaro Astronomy Club (SAC)</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 3 }]}>- Index Catalog (IC)</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 3 }]}>- Set of Identifications, Measurements, and Bibliography for Astronomical Data (SIMBAD)</Text>
          </View>
          <View style={globalStyles.globalContainer}>
            <Text style={globalStyles.sections.title}>{i18n.t('astroDataInfos.stars.title')}</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.stars.text1')}</Text>
          </View>
          <View style={globalStyles.globalContainer}>
            <Text style={globalStyles.sections.title}>{i18n.t('astroDataInfos.planets.title')}</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.planets.text1')}</Text>
          </View>
          <View style={globalStyles.globalContainer}>
            <Text style={globalStyles.sections.title}>{i18n.t('astroDataInfos.launchData.title')}</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.launchData.text1')}</Text>
          </View>
          <View style={globalStyles.globalContainer}>
            <Text style={globalStyles.sections.title}>{i18n.t('astroDataInfos.satellites.title')}</Text>
            <View style={{ marginBottom: 0 }}>
              <Text style={[globalStyles.sections.text, { marginTop: 10, textTransform: 'uppercase', fontFamily: 'GilroyBlack' }]}>{i18n.t('astroDataInfos.satellites.iss.title')}</Text>
              <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.satellites.iss.text1')}</Text>
              <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.satellites.iss.text2')}</Text>
            </View>
            <View style={{ marginBottom: 0 }}>
              <Text style={[globalStyles.sections.text, { marginTop: 10, textTransform: 'uppercase', fontFamily: 'GilroyBlack' }]}>{i18n.t('astroDataInfos.satellites.iss.title')}</Text>
              <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.satellites.starlink.text1')}</Text>
            </View>
          </View>
          <View style={globalStyles.globalContainer}>
            <Text style={globalStyles.sections.title}>{i18n.t('astroDataInfos.solarWeather.title')}</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.solarWeather.text1')}</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 3 }]}>- Solar Dynamics Observatory (sdo.gsfc.nasa.gov)</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 3 }]}>- Solar And Heliospheric Observatory (soho.nascom.nasa.gov)</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 3 }]}>- National Oceanic and Atmospheric Administration (noaa.gov)</Text>
          </View>
          <View style={globalStyles.globalContainer}>
            <Text style={globalStyles.sections.title}>{i18n.t('astroDataInfos.apod.title')}</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.apod.text1')}</Text>
          </View>
          <View style={globalStyles.globalContainer}>
            <Text style={globalStyles.sections.title}>{i18n.t('astroDataInfos.moonPhases.title')}</Text>
            <Text style={[globalStyles.sections.text, { marginBottom: 10 }]}>{i18n.t('astroDataInfos.moonPhases.text1')}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
