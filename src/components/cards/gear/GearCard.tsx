import { Image, Text, TouchableOpacity, View } from "react-native"
import { Telescope } from "../../../helpers/types/gear/Telescope"
import SimpleBadge from "../../badges/SimpleBadge"
import { app_colors } from "../../../helpers/constants"
import { astroImages } from "../../../helpers/scripts/loadImages"
import DSOValues from "../../commons/DSOValues"
import { routes } from "../../../helpers/routes"
import { useSettings } from "../../../contexts/AppSettingsContext"
import { useAuth } from "../../../contexts/AuthContext"
import { useTranslation } from "../../../hooks/useTranslation"
import { eventTypes } from "../../../helpers/constants/analytics"
import { sendAnalyticsEvent } from "../../../helpers/scripts/analytics"
import { useAstroGear } from "../../../contexts/GearContext"
import { Eyepiece } from "../../../helpers/types/gear/Eyepiece"
import { Mount } from "../../../helpers/types/gear/Mount"
import { Camera } from "../../../helpers/types/gear/Camera"
import { gearCardStyles } from "../../../styles/components/cards/gear/gearCard"
import { getGearShortCharacteristicsString } from "../../../helpers/scripts/gear/gearUtils"

interface GearCardProps {
  gear: Telescope | Eyepiece | Mount | Camera,
  isActive: boolean,
  navigation: any
}

export const GearCard = ({gear, isActive, navigation}: GearCardProps) => {
  const { currentUserLocation } = useSettings()
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const { updateCurrentTelescope, updateCurrentEyepiece, updateCurrentMount, updateCurrentCamera } = useAstroGear()

  const handleEditRoute = () => {
    if(gear.gearType === 'telescope'){
      return navigation.navigate(routes.auth.profile.astroGearManagement.telescopes.crud.path, { selectedTelescope: gear as Telescope });
    }else if(gear.gearType === 'eyepiece'){
      return navigation.navigate(routes.auth.profile.astroGearManagement.eyepieces.crud.path, { selectedEyepiece: gear as Eyepiece });
    }else if(gear.gearType === 'mount'){
      return navigation.navigate(routes.auth.profile.astroGearManagement.mounts.crud.path, { selectedMount: gear as Mount });
    }else if(gear.gearType === 'camera'){
      return navigation.navigate(routes.auth.profile.astroGearManagement.cameras.crud.path, { selectedCamera: gear as Camera });
    }
  }

  const handleUpdateCurrentGearEvent = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'update_current_gear', eventTypes.BUTTON_CLICK, {gear: gear.name, type: gear.gearType}, currentLocale)

    if(gear.gearType === 'telescope'){
      updateCurrentTelescope(gear as Telescope)
    } else if(gear.gearType === 'eyepiece'){
      updateCurrentEyepiece(gear as Eyepiece)
    } else if(gear.gearType === 'mount'){
      updateCurrentMount(gear as Mount)
    } else if(gear.gearType === 'camera'){
      updateCurrentCamera(gear as Camera)
    }
  }

  const handleEdit = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'click_gear_card_edit', eventTypes.BUTTON_CLICK, {gear: gear.name, type: gear.gearType}, currentLocale)
    handleEditRoute()
  }

  const handleSelect = () => {
    handleUpdateCurrentGearEvent()
  }

  return (
    <View style={[gearCardStyles.card, isActive && {borderColor: app_colors.white, borderWidth: 1}]}>
      <View style={gearCardStyles.card.content}>
        {gear.gearType === 'telescope' && <Image source={require('../../../../assets/icons/FiTelescope.png')} style={gearCardStyles.card.content.image} />}
        {gear.gearType === 'eyepiece' && <Image source={require('../../../../assets/icons/FiEye.png')} style={gearCardStyles.card.content.image} />}
        {gear.gearType === 'camera' && <Image source={require('../../../../assets/icons/FiCamera.png')} style={gearCardStyles.card.content.image} />}
        {gear.gearType === 'mount' && <Image source={require('../../../../assets/icons/FiTelescopeMount.png')} style={gearCardStyles.card.content.image} />}
        <View style={gearCardStyles.card.content.body}>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Text style={gearCardStyles.card.content.body.title}>{gear.name}</Text>
            {isActive && <SimpleBadge text="Séléctionné" small backgroundColor={app_colors.white} foregroundColor={app_colors.black} />}
          </View>
          <Text style={gearCardStyles.card.content.body.subtitle}>{getGearShortCharacteristicsString(gear)}</Text>
        </View>

        <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 10}}>
          <TouchableOpacity onPress={() => handleSelect()} style={gearCardStyles.card.content.iconContainer}>
            <Image source={isActive ? require('../../../../assets/icons/FiToggleFilled.png') :require('../../../../assets/icons/FiToggleEmpty.png')} style={gearCardStyles.card.content.iconContainer.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleEdit()} style={gearCardStyles.card.content.iconContainer}>
            <Image source={require('../../../../assets/icons/FiEdit.png')} style={gearCardStyles.card.content.iconContainer.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}