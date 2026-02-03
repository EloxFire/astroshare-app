import { Text, View } from "react-native"
import { app_colors } from "../../../helpers/constants"
import { i18n } from "../../../helpers/scripts/i18n"
import { profileScreenStyles } from "../../../styles/screens/auth/profile"
import SimpleButton from "../../commons/buttons/SimpleButton"
import { TextWithIcon } from "../../commons/texts/TextWithIcon"
import ToolButton from "../../commons/buttons/ToolButton"
import { routes } from "../../../helpers/routes"

export const PersonnalInfosCard = ({navigation}: any) => {
  return (
    <View style={profileScreenStyles.content.section}>
      <Text style={profileScreenStyles.content.section.title}>{i18n.t('auth.profile.personnalInfos.title')}</Text>
      <SimpleButton
        fullWidth
        withArrow
        align="flex-start"
        icon={require('../../../../assets/icons/FiTranslation.png')}
        text={i18n.t('auth.profile.personnalInfos.language')}
        onPress={() => {navigation.navigate(routes.settings.language.path)}}
        iconColor={app_colors.white}
        textColor={app_colors.white}
        backgroundColor={app_colors.white_no_opacity}
      />
      <SimpleButton
        fullWidth
        withArrow
        align="flex-start"
        icon={require('../../../../assets/icons/FiInfo.png')}
        text={i18n.t('auth.profile.personnalInfos.infos.title')}
        onPress={() => {navigation.navigate(routes.auth.profile.personnalInfosForm.path)}}
        iconColor={app_colors.white}
        textColor={app_colors.white}
        backgroundColor={app_colors.white_no_opacity}
      />
      <SimpleButton
        fullWidth
        withArrow
        align="flex-start"
        icon={require('../../../../assets/icons/FiPinMap.png')}
        text={i18n.t('auth.profile.personnalInfos.addresses.title')}
        onPress={() => {}}
        iconColor={app_colors.white}
        textColor={app_colors.white}
        backgroundColor={app_colors.white_no_opacity}
      />
      <SimpleButton
        fullWidth
        withArrow
        align="flex-start"
        icon={require('../../../../assets/icons/FiTelescope.png')}
        text={i18n.t('auth.profile.personnalInfos.gear.title')}
        onPress={() => {}}
        iconColor={app_colors.white}
        textColor={app_colors.white}
        backgroundColor={app_colors.white_no_opacity}
      />
    </View>
  )
}