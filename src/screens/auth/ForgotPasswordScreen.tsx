import { useState } from "react"
import { View, TouchableOpacity, ScrollView, ActivityIndicator, Image, Text } from "react-native"
import InputWithIcon from "../../components/forms/InputWithIcon"
import { useSettings } from "../../contexts/AppSettingsContext"
import { useAuth } from "../../contexts/AuthContext"
import { app_colors } from "../../helpers/constants"
import { eventTypes } from "../../helpers/constants/analytics"
import { routes } from "../../helpers/routes"
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics"
import { i18n } from "../../helpers/scripts/i18n"
import { localizedWhiteLogo } from "../../helpers/scripts/loadImages"
import { showToast } from "../../helpers/scripts/showToast"
import { useTranslation } from "../../hooks/useTranslation"
import { pageTitleStyles } from "../../styles/components/commons/pageTitle"
import { globalStyles } from "../../styles/global"
import { authStyles } from "../../styles/screens/auth/auth"

export const ForgotPasswordScreen = ({ navigation }: any) => {

  const { resetPassword, currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const { currentUserLocation } = useSettings()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async () => {
    if(email === ""){
      showToast({message: i18n.t('auth.errors.missingEmail'), type: 'error'})
      return;
    }

    setLoading(true)
    const response = await resetPassword(email)
    console.log("[Auth] Reset password response", response)
    sendAnalyticsEvent(currentUser, currentUserLocation, 'reset_password_attempt', eventTypes.BUTTON_CLICK, {target: "forgot_password_screen"}, currentLocale)

    if (!response) {
      setLoading(false)
      showToast({message: i18n.t('common.errors.unknown'), type: 'error'})
      sendAnalyticsEvent(currentUser, currentUserLocation, 'reset_password_failure', eventTypes.ERROR, {}, currentLocale)
      return;
    }

    sendAnalyticsEvent(currentUser, currentUserLocation, 'reset_password_success', eventTypes.USER_LOGIN, {}, currentLocale)
    navigation.push(routes.auth.login.path)
    setLoading(false)
  }

  const handleReturnToLogin = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'navigate_to_login', eventTypes.BUTTON_CLICK, {from: "forgot_password_screen"}, currentLocale)
    navigation.push(routes.auth.login.path)
  }

  return (
    <View style={globalStyles.body}>
      <View style={pageTitleStyles.container}>
        <TouchableOpacity onPress={() => navigation.push(routes.home.path)}>
          <Image style={pageTitleStyles.container.icon} source={require('../../../assets/icons/FiChevronDown.png')}/>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={authStyles.content}>

          <Image source={localizedWhiteLogo[currentLocale]} style={authStyles.content.logo} resizeMode={"contain"} />

          <Text style={authStyles.content.title}>{i18n.t('auth.forgotPassword.title')}</Text>
          <Text style={authStyles.content.subtitle}>{i18n.t('auth.forgotPassword.subtitle')}</Text>

          <View style={authStyles.content.form}>
            <InputWithIcon
              value={email}
              changeEvent={(email: string) => setEmail(email)}
              placeholder={i18n.t('auth.placeholders.email')}
              type={"text"}
              additionalStyles={{marginBottom: 0}}
              alternateSubmitEvent={() => handleFormSubmit()}
            />

            <TouchableOpacity onPress={() => handleReturnToLogin()}>
              <Text style={authStyles.content.forgotPassword}>{i18n.t('auth.forgotPassword.returnToLogin')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={authStyles.content.form.button} onPress={() => handleFormSubmit()}>
              <Text style={authStyles.content.form.button.text}>{i18n.t('auth.forgotPassword.submit')}</Text>
              {loading && <ActivityIndicator size={"small"} color={app_colors.black} />}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}