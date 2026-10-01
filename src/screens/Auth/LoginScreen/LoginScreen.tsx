import { Image, Text, TouchableOpacity, View } from "react-native"
import { loginScreenStyles } from "./LoginScreen.styles"
import { SafeAreaView } from "react-native-safe-area-context"
import { InputWithIcon } from "../../../components/InputWithIcon/InputWithIcon"
import { app_colors, withOpacity } from "../../../helpers/variables"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { useTranslation } from "react-i18next"

const LoginScreen = () => {
  const { t } = useTranslation("auth/login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    StatusBar.setStyle("light")
  }, [])

  const handleSubmit = () => {
    if(email.trim() === "" || password.trim() === "") {
      // TODO: Show error message for empty fields
      return;
    }

    // TODO: Implement login logic here (e.g., send a request to the backend)
  }

  return (
    <SafeAreaView style={loginScreenStyles.screen}>
      <View style={loginScreenStyles.screen.logoContainer}>
        <Image
          source={require("../../../../assets/icons/icon_white.png")}
          style={{ width: 100, height: 100 }}
        />
        <Text style={loginScreenStyles.screen.logoContainer.title}>Astroshare</Text>
        <Text style={loginScreenStyles.screen.logoContainer.slogan}>{t("slogan")}</Text>
      </View>

      <View style={loginScreenStyles.screen.formContainer}>
        <InputWithIcon
          label={t("form.email.label")}
          labelStyle={{ color: withOpacity(app_colors.white, 0.7) }}
          placeholder={t("form.email.placeholder")}
          value={email}
          onChangeText={setEmail}
          action={() => console.log("Email submitted")}
          additionnalInputStyles={{paddingVertical: 5}}
        />

        <InputWithIcon
          label={t("form.password.label")}
          labelStyle={{ color: withOpacity(app_colors.white, 0.7) }}
          placeholder={t("form.password.placeholder")}
          value={password}
          onChangeText={setPassword}
          action={() => console.log("Password submitted")}
          additionnalInputStyles={{paddingVertical: 5}}
          password
        />
      </View>
      <View>
        <TouchableOpacity onPress={() => router.push("/auth/forgot-password")}>
          <Text style={loginScreenStyles.screen.forgotText}>{t("forgotPassword")}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={loginScreenStyles.screen.formContainer.button}>
        <Text style={loginScreenStyles.screen.formContainer.button.text}>{t("submitButton")}</Text>
      </TouchableOpacity>

      <View style={loginScreenStyles.screen.bottomContainer}>
        <Text style={loginScreenStyles.screen.bottomContainer.noAccountText}>
          {t("noAccount")}
        </Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={loginScreenStyles.screen.bottomContainer.noAccountText.link}>{t("registerLink")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen
