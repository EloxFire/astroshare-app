import PageTitle from "../../../components/commons/PageTitle"
import { routes } from "../../../helpers/routes"
import { i18n } from "../../../helpers/scripts/i18n"
import { globalStyles } from "../../../styles/global"
import { ScrollView, Text, View } from "react-native"
import { astroGearManagementScreenStyles } from "../../../styles/screens/auth/astroGearManagementScreen"
import { useSettings } from "../../../contexts/AppSettingsContext"
import { useAuth } from "../../../contexts/AuthContext"
import { useTranslation } from "../../../hooks/useTranslation"
import { useEffect, useState } from "react"
import { eventTypes } from "../../../helpers/constants/analytics"
import { sendAnalyticsEvent } from "../../../helpers/scripts/analytics"
import { profileScreenStyles } from "../../../styles/screens/auth/profile"
import ScreenInfo from "../../../components/ScreenInfo"
import SimpleButton from "../../../components/commons/buttons/SimpleButton"
import { app_colors } from "../../../helpers/constants"
import { getTelescopes } from "../../../helpers/scripts/gear/telescopes"
import { Telescope } from "../../../helpers/types/gear/Telescope"

export const AstroGearManagementScreen = ({navigation}: any) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'astro_gear_management_screen_view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  const [telescopes, setTelescopes] = useState<Telescope[]>([])

  useEffect(() => {
    (async () => {
      const telescopes = await getTelescopes(currentUser.id)
    })()
  }, [])


  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('auth.profile.personnalInfos.gear.title')}
        subtitle={i18n.t('auth.profile.personnalInfos.gear.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={astroGearManagementScreenStyles.content}>

          <View style={profileScreenStyles.content.section}>
            <Text style={profileScreenStyles.content.section.title}>{i18n.t('auth.profile.personnalInfos.gear.telescopes.title')}</Text>

            {telescopes.length === 0 && <Text style={profileScreenStyles.content.section.subtitle}>Vous n'avez encore aucun télescope enregistré.</Text>}

            <SimpleButton
              withArrow
              fullWidth
              text="Ajouter un télescope"
              onPress={() => {navigation.navigate(routes.auth.profile.astroGearManagement.addTelescope.path)}}
              textColor={app_colors.white}
              backgroundColor={app_colors.white_no_opacity}
            />
          </View>

          <View style={profileScreenStyles.content.section}>
            <Text style={profileScreenStyles.content.section.title}>Mes oculaires</Text>
            
          </View>

          <View style={profileScreenStyles.content.section}>
            <Text style={profileScreenStyles.content.section.title}>Mes caméras</Text>
          </View>

          <View style={profileScreenStyles.content.section}>
            <Text style={profileScreenStyles.content.section.title}>Mes montures</Text>
          </View>

        </View>
        <ScreenInfo
          image={require('../../../../assets/icons/FiTelescope.png')}
          text="Ajouter et gérez votre matériel d'astronomie pour une expérience encore plus personnalisée !"
        />
      </ScrollView>
    </View>
  )
}