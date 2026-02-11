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
import { GearCard } from "../../../components/cards/gear/GearCard"
import { useIsFocused } from "@react-navigation/native"
import { useAstroGear } from "../../../contexts/GearContext"
import { getEyepieces } from "../../../helpers/scripts/gear/eyepieces"
import { Eyepiece } from "../../../helpers/types/gear/Eyepiece"
import { Camera } from "../../../helpers/types/gear/Camera"
import { getCameras } from "../../../helpers/scripts/gear/cameras"

export const AstroGearManagementScreen = ({navigation}: any) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const isFocused = useIsFocused()
  const { currentGear } = useAstroGear()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'astro_gear_management_screen_view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  const [telescopes, setTelescopes] = useState<Telescope[]>([])
  const [eyepieces, setEyepieces] = useState<Eyepiece[]>([])
  const [cameras, setCameras] = useState<Camera[]>([])

  useEffect(() => {
    if (!isFocused || !currentUser?.uid) {
      return
    }

    (async () => {
      const telescopes = await getTelescopes(currentUser.uid)
      const eyepieces = await getEyepieces(currentUser.uid)
      const cameras = await getCameras(currentUser.uid)
      console.log(`[AstroGearManagementScreen] Telescopes fetched:`, telescopes);
      console.log(`[AstroGearManagementScreen] Eyepieces fetched:`, eyepieces);
      console.log(`[AstroGearManagementScreen] Cameras fetched:`, cameras);
      
      
      
      setTelescopes(telescopes)
      setEyepieces(eyepieces)
      setCameras(cameras)
    })()
  }, [isFocused, currentUser?.uid])


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
            <Text style={[profileScreenStyles.content.section.title, {marginBottom: 0}]}>{i18n.t('auth.profile.personnalInfos.gear.telescopes.title')}</Text>
            {telescopes.length === 0 && <Text style={profileScreenStyles.content.section.subtitle}>Vous n'avez encore aucun télescope enregistré.</Text>}

            <View style={{display: 'flex', gap: 10, marginVertical: 10}}>
              {
                telescopes.length > 0 && telescopes.map((telescope, index) => {
                  return (
                    <GearCard key={index} gear={telescope} isActive={currentGear?.telescope === telescope.id} navigation={navigation} />
                  )
                })
              }
            </View>

            <SimpleButton
              withArrow
              fullWidth
              text="Ajouter un télescope"
              onPress={() => {navigation.navigate(routes.auth.profile.astroGearManagement.telescopes.crud.path)}}
              textColor={app_colors.white}
              backgroundColor={app_colors.white_no_opacity}
              iconColor={app_colors.white}
              small
            />
          </View>

          <View style={profileScreenStyles.content.section}>
            <Text style={[profileScreenStyles.content.section.title, {marginBottom: 0}]}>Mes oculaires</Text>
            {eyepieces.length === 0 && <Text style={profileScreenStyles.content.section.subtitle}>Vous n'avez encore aucun oculaire enregistré.</Text>}

            <View style={{display: 'flex', gap: 10, marginVertical: 10}}>
              {
                eyepieces.length > 0 && eyepieces.map((eyepiece, index) => {
                  return (
                    <GearCard key={index} gear={eyepiece} isActive={currentGear?.eyepiece === eyepiece.id} navigation={navigation} />
                  )
                })
              }
            </View>
            <SimpleButton
              withArrow
              fullWidth
              text="Ajouter un oculaire"
              onPress={() => {navigation.navigate(routes.auth.profile.astroGearManagement.eyepieces.crud.path)}}
              textColor={app_colors.white}
              backgroundColor={app_colors.white_no_opacity}
              iconColor={app_colors.white}
              small
            />
          </View>

          <View style={profileScreenStyles.content.section}>
            <Text style={[profileScreenStyles.content.section.title, {marginBottom: 0}]}>Mes caméras</Text>
            {cameras.length === 0 && <Text style={profileScreenStyles.content.section.subtitle}>Vous n'avez encore aucune caméra enregistrée.</Text>}

            <View style={{display: 'flex', gap: 10, marginVertical: 10}}>
              {
                cameras.length > 0 && cameras.map((camera, index) => {
                  return (
                    <GearCard key={index} gear={camera} isActive={currentGear?.camera === camera.id} navigation={navigation} />
                  )
                })
              }
            </View>

            <SimpleButton
              withArrow
              fullWidth
              text="Ajouter une caméra"
              onPress={() => {navigation.navigate(routes.auth.profile.astroGearManagement.cameras.crud.path)}}
              textColor={app_colors.white}
              backgroundColor={app_colors.white_no_opacity}
              iconColor={app_colors.white}
              small
            />
          </View>

          <View style={profileScreenStyles.content.section}>
            <Text style={[profileScreenStyles.content.section.title, {marginBottom: 0}]}>Mes montures</Text>
          </View>
        </View>

        {/* <Text style={profileScreenStyles.content.section.subtitle}>{JSON.stringify(telescopes, null, 2)}</Text> */}
        {/* <Text style={profileScreenStyles.content.section.subtitle}>{JSON.stringify(eyepieces, null, 2)}</Text> */}
        {/* <Text style={profileScreenStyles.content.section.subtitle}>{JSON.stringify(currentGear, null, 2)}</Text> */}

        <ScreenInfo
          image={require('../../../../assets/icons/FiTelescope.png')}
          text="Ajouter et gérez votre matériel d'astronomie pour une expérience encore plus personnalisée !"
        />
      </ScrollView>
    </View>
  )
}
