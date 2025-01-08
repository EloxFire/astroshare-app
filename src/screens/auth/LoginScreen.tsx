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

export default function LoginScreen({ navigation }: any) {

  const {loginUser} = useAuth()
  const {currentLocale} = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async () => {
    if(email === "" || password === ""){
      showToast({message: i18n.t('auth.errors.missingField'), type: 'error'})
      return;
    }

    try{
      setLoading(true)
      await loginUser(email, password)
      navigation.push(routes.auth.profile.path)
    } catch (e) {
      setLoading(false)
      showToast({message: i18n.t('auth.errors.generic'), type: 'error'})
    }
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
            />

            <TouchableOpacity onPress={() => navigation.push(routes.auth.register.path)}>
              <Text style={authStyles.content.forgotPassword}>{i18n.t('auth.login.noAccount')}</Text>
            </TouchableOpacity>
            {/*<TouchableOpacity onPress={() => navigation.navigate('ForgotPasswordScreen')}>*/}
            {/*  <Text style={authStyles.content.forgotPassword}>{i18n.t('auth.login.forgotPassword')}</Text>*/}
            {/*</TouchableOpacity>*/}

            <TouchableOpacity style={authStyles.content.form.button} onPress={handleFormSubmit}>
              <Text style={authStyles.content.form.button.text}>{i18n.t('auth.login.submit')}</Text>
              {loading && <ActivityIndicator size={"small"} color={app_colors.black} />}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
