import React, {useEffect, useState} from "react";
import {ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../../styles/global";
import {i18n} from "../../helpers/scripts/i18n";
import {authStyles} from "../../styles/screens/auth/auth";
import {useAuth} from "../../contexts/AuthContext";
import InputWithIcon from "../../components/forms/InputWithIcon";
import {useTranslation} from "../../hooks/useTranslation";
import {localizedWhiteLogo} from "../../helpers/scripts/loadImages";
import {routes} from "../../helpers/routes";
import {pageTitleStyles} from "../../styles/components/commons/pageTitle";
import {showToast} from "../../helpers/scripts/showToast";
import {app_colors} from "../../helpers/constants";
import { useSettings } from "../../contexts/AppSettingsContext";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";

export default function LoginScreen({ navigation }: any) {

  const {loginUser} = useAuth()
  const {currentUser} = useAuth()
  const { currentLocale } = useTranslation()
  const { currentUserLocation } = useSettings()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async () => {
    if(email === "" || password === ""){
      showToast({message: i18n.t('auth.errors.missingField'), type: 'error'})
      return;
    }

    setLoading(true)
    const response = await loginUser(email, password)
    console.log("[Auth] Login response", response)
    sendAnalyticsEvent(currentUser, currentUserLocation, 'login_attempt', eventTypes.BUTTON_CLICK, {target: "profile screen"}, currentLocale)

    if (!response) {
      setLoading(false)
      // showToast({message: i18n.t('common.errors.unknown'), type: 'error'})
      sendAnalyticsEvent(currentUser, currentUserLocation, 'login_failure', eventTypes.ERROR, {}, currentLocale)
      return;
    }

    sendAnalyticsEvent(currentUser, currentUserLocation, 'login_success', eventTypes.USER_LOGIN, {}, currentLocale)
    navigation.push(routes.auth.profile.path)
    setLoading(false)
  }

  const handleRegisterNavigation = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'navigate_to_register', eventTypes.BUTTON_CLICK, {from: "login screen"}, currentLocale)
    navigation.push(routes.auth.register.path)
  }

  const handleForgotPassword = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'navigate_to_forgot_password', eventTypes.BUTTON_CLICK, {from: "login screen"}, currentLocale)
    navigation.push(routes.auth.forgotPassword.path)
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

          <Text style={authStyles.content.title}>{i18n.t('auth.login.title')}</Text>
          <Text style={authStyles.content.subtitle}>{i18n.t('auth.login.subtitle')}</Text>

          <View style={authStyles.content.form}>
            <InputWithIcon
              value={email}
              changeEvent={(email: string) => setEmail(email)}
              placeholder={i18n.t('auth.placeholders.email')}
              type={"text"}
              additionalStyles={{marginBottom: 0}}
            />

            <InputWithIcon
              value={password}
              changeEvent={(password: string) => setPassword(password)}
              placeholder={i18n.t('auth.placeholders.password')}
              icon={showPassword ? require('../../../assets/icons/FiEyeOff.png') : require('../../../assets/icons/FiEye.png')}
              search={() => setShowPassword(!showPassword)}
              type={showPassword ? 'text' : 'password'}
              additionalStyles={{marginBottom: 0}}
              alternateSubmitEvent={() => handleFormSubmit()}
            />

            <TouchableOpacity onPress={() => handleRegisterNavigation()}>
              <Text style={authStyles.content.forgotPassword}>{i18n.t('auth.login.noAccount')}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleForgotPassword()}>
             <Text style={authStyles.content.forgotPassword}>{i18n.t('auth.login.forgotPassword')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={authStyles.content.form.button} onPress={() => handleFormSubmit()}>
              <Text style={authStyles.content.form.button.text}>{i18n.t('auth.login.submit')}</Text>
              {loading && <ActivityIndicator size={"small"} color={app_colors.black} />}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
