import React from 'react'
import { View, ScrollView, TouchableOpacity, Text } from 'react-native'
import { i18n } from '../helpers/scripts/i18n'
import { globalStyles } from '../styles/global'
import { useSettings } from '../contexts/AppSettingsContext'
import PageTitle from '../components/commons/PageTitle'
import GlobalSummary from '../components/widgets/home/GlobalSummary'
import { app_colors } from '../helpers/constants'
import { HomeWidget } from '../helpers/types/HomeWidget'
import NightSummary from '../components/widgets/home/NightSummary'

export default function WidgetManager({ navigation }: any) {

  const { selectedHomeWidget, updateSelectedHomeWidget } = useSettings()

  const handleWidget = (newWidget: string) => {
    updateSelectedHomeWidget(newWidget)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('settings.buttons.widgets.title')}
        subtitle={i18n.t('settings.buttons.widgets.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={{ paddingTop: 20 }}>
          {
            Object.keys(HomeWidget).map((widget, index) => {
              return (
                <TouchableOpacity key={`widget-${index}`} onPress={() => handleWidget(widget)} style={{ display: 'flex', flexDirection: 'column', marginBottom: 50, borderTopWidth: 1, borderTopColor: app_colors.white_twenty, paddingTop: 10 }}>
                  <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {widget === 'Live' && <Text style={{ fontSize: 16, textTransform: 'uppercase', fontFamily: 'GilroyBlack', color: app_colors.white }}>Aperçu du ciel en direct</Text>}
                    {widget === 'Night' && <Text style={{ fontSize: 16, textTransform: 'uppercase', fontFamily: 'GilroyBlack', color: app_colors.white }}>Aperçu de la nuit</Text>}
                    {widget === 'None' && <Text style={{ fontSize: 16, textTransform: 'uppercase', fontFamily: 'GilroyBlack', color: app_colors.white }}>Aucun widget</Text>}
                    <View style={{ borderRadius: 100, width: 20, height: 20, backgroundColor: app_colors.white, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <View style={{ borderRadius: 100, width: 18, height: 18, backgroundColor: app_colors.black, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        {selectedHomeWidget === widget && <View style={{ borderRadius: 100, width: 12, height: 12, backgroundColor: app_colors.white }} />}
                      </View>
                    </View>
                  </View>
                  {widget === 'Live' && <GlobalSummary noHeader />}
                  {widget === 'Night' && <NightSummary noHeader />}
                  {widget === 'None' && <></>}

                </TouchableOpacity>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}

const buttonStyle = {

}
