import React, {useState} from "react";
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
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

export default function RegisterScreen({ navigation }: any) {

  const {registerUser, loginUser} = useAuth()
  const {currentLocale} = useTranslation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async () => {
    if(password !== passwordConfirmation) {
      showToast({message: i18n.t('auth.register.passwordMismatch'), type: 'error'})
      return;
    }
    setLoading(true)
    const response = await registerUser(email, password);

    if(!response) {
      showToast({message: i18n.t('auth.register.error'), type: 'error'})
      setLoading(false);
      return;
    }else{
      const response = await loginUser(email, password)
      if(response !== 'success') {
        showToast({message: i18n.t('auth.register.error'), type: 'error'})
        setLoading(false);
        return;
      }
      navigation.push(routes.auth.profile.path);
      setLoading(false);
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

          <Text style={authStyles.content.title}>{i18n.t('auth.register.title')}</Text>
          <Text style={authStyles.content.subtitle}>{i18n.t('auth.register.subtitle')}</Text>

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

            <InputWithIcon
              value={passwordConfirmation}
              changeEvent={(password: string) => setPasswordConfirmation(password)}
              placeholder={i18n.t('auth.placeholders.passwordConfirmation')}
              icon={showPassword ? require('../../../assets/icons/FiEyeOff.png') : require('../../../assets/icons/FiEye.png')}
              search={() => setShowPassword(!showPassword)}
              type={showPassword ? 'text' : 'password'}
              additionalStyles={{marginBottom: 0}}
            />

            <TouchableOpacity onPress={() => navigation.push(routes.auth.login.path)}>
              <Text style={authStyles.content.forgotPassword}>{i18n.t('auth.register.noAccount')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={authStyles.content.form.button} onPress={() => handleFormSubmit()}>
              <Text style={authStyles.content.form.button.text}>{i18n.t('auth.register.submit')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
