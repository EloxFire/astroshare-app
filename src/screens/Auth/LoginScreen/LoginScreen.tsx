import { Image, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { loginScreenStyles } from "./LoginScreen.styles"
import { SafeAreaView } from "react-native-safe-area-context"
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon"
import { app_colors, withOpacity } from "../../../helpers/variables"
import { router } from "expo-router"
import { useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { useTranslation } from "react-i18next"
import { ChevronLeft } from "lucide-react-native"
import { useAuth } from "../../../context/AuthContext"
import Button from "../../../components/buttons/Button/Button"

const LoginScreen = () => {

  const { loginUser, authLoading } = useAuth(); // Assuming you have a custom hook for authentication
  const { t } = useTranslation("auth/login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    StatusBar.setStyle("light")
  }, [])

  const handleSubmit = async () => {
    if(email.trim() === "" || password.trim() === "") {
      // TODO: Show error message for empty fields
      return;
    }

    try {
      await loginUser(email, password);
      router.push("/");
    } catch (error) {
      console.error("[LoginScreen] Error during login:", error);
    }
  }

  return (
    <SafeAreaView style={loginScreenStyles.screen}>
      {/* Aucun ScrollView à l'origine : rien ne remontait ni ne défilait pour garder les champs et
          le bouton visibles une fois le clavier ouvert. flexGrow:1 sur le conteneur de contenu
          garde la mise en page (bottomContainer en flex:1 poussé en bas) identique tant que tout
          tient à l'écran, et autorise le défilement sinon. */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
      <TouchableOpacity style={loginScreenStyles.screen.backButton} onPress={() => router.back()}>
        <ChevronLeft size={24} color={app_colors.white} />
      </TouchableOpacity>

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
        <TouchableOpacity onPress={() => router.push("/auth/forgot-password")} disabled={authLoading}>
          <Text style={loginScreenStyles.screen.forgotText}>{t("forgotPassword")}</Text>
        </TouchableOpacity>
      </View>

      <Button label={t("submitButton")} onPress={handleSubmit} loading={authLoading} style={{ marginTop: 20 }} />

      <View style={loginScreenStyles.screen.bottomContainer}>
        <Text style={loginScreenStyles.screen.bottomContainer.noAccountText}>
          {t("noAccount")}
        </Text>
        <TouchableOpacity onPress={() => router.push("/auth/register")}>
          <Text style={loginScreenStyles.screen.bottomContainer.noAccountText.link}>{t("registerLink")}</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default LoginScreen
