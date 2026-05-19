import { Text, View } from "react-native"
import { app_colors } from "../../../helpers/constants"
import { i18n } from "../../../helpers/scripts/i18n"
import { profileScreenStyles } from "../../../styles/screens/auth/profile"
import SimpleButton from "../../commons/buttons/SimpleButton"
import { TextWithIcon } from "../../commons/texts/TextWithIcon"
import ToolButton from "../../commons/buttons/ToolButton"
import { routes } from "../../../helpers/routes"
import { useAuth } from "../../../contexts/AuthContext"
import { isProUser } from "../../../helpers/scripts/auth/checkUserRole"

export const DataAndSubscriptionCard = ({navigation}: any) => {

  const {currentUser} = useAuth()

  return (
    <View style={profileScreenStyles.content.section}>
      <Text style={profileScreenStyles.content.section.title}>{i18n.t('auth.profile.dataAndSubscription.title')}</Text>
      {/* <SimpleButton
        fullWidth
        withArrow
        align="flex-start"
        icon={require('../../../../assets/icons/FiDatabase.png')}
        text={i18n.t('auth.profile.dataAndSubscription.dataSync.title')}
        onPress={() => {}}
        iconColor={app_colors.white}
        textColor={app_colors.white}
        backgroundColor={app_colors.white_no_opacity}
      /> */}
      <SimpleButton
        fullWidth
        withArrow
        align="flex-start"
        icon={require('../../../../assets/icons/FiCreditCard.png')}
        text={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.title')}
        onPress={() => navigation.navigate(routes.auth.profile.subscriptionManagement.home.path)}
        iconColor={app_colors.white}
        textColor={app_colors.white}
        backgroundColor={app_colors.white_no_opacity}
      />
    </View>
  )
}