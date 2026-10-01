import { Text, TouchableOpacity, View } from "react-native"
import { forgotPasswordScreenStyles } from "./ForgotPassword.styles"
import { SafeAreaView } from "react-native-safe-area-context"
import { useEffect, useState } from "react"
import { StatusBar } from "expo-status-bar"
import { KeyRoundIcon, MailCheck } from "lucide-react-native"
import { InputWithIcon } from "../../../components/InputWithIcon/InputWithIcon"
import { useTranslation } from "react-i18next"
import { router } from "expo-router"
import { app_colors } from "../../../helpers/variables"
import InfoCard from "../../../components/cards/InfoCard/InfoCard"

const ForgotPasswordScreen = () => {

  const { t } = useTranslation("auth/forgotPassword");

  const [email, setEmail] = useState("");

  useEffect(() => {
    StatusBar.setStyle("dark")
  }, [])

  const handleSubmit = () => {
    if(email.trim() === "") {
      // TODO: Show error message for empty email
      return;
    }

    // TODO: Implement forgot password logic here (e.g., send a request to the backend)

  }

  return (
    <SafeAreaView style={forgotPasswordScreenStyles.screen}>
      <View style={forgotPasswordScreenStyles.screen.logoContainer}>
        <View style={forgotPasswordScreenStyles.screen.logoContainer.iconContainer}>
          <KeyRoundIcon size={32} color={app_colors.primary.main} />
        </View>
        <Text style={forgotPasswordScreenStyles.screen.logoContainer.title}>{t("title")}</Text>
        <Text style={forgotPasswordScreenStyles.screen.logoContainer.subtitle}>{t("subtitle")}</Text>
      </View>

      <View style={forgotPasswordScreenStyles.screen.formContainer}>
        <InputWithIcon
          label={t("form.email.label")}
          placeholder={t("form.email.placeholder")}
          value={email}
          onChangeText={setEmail}
          action={() => console.log("Email submitted")}
          additionnalInputStyles={{paddingVertical: 5}}
        />
      </View>

      <TouchableOpacity style={forgotPasswordScreenStyles.screen.formContainer.button}>
        <Text style={forgotPasswordScreenStyles.screen.formContainer.button.text}>{t("submitButton")}</Text>
      </TouchableOpacity>

      <View style={{marginTop: 20}}>
        <InfoCard
          title={t("confirmation.title")}
          description={t("confirmation.description", {email: email || "your email"})}
          icon={MailCheck}
          variant="light"
          additionnalDescriptionStyle={{fontFamily: "DMMonoRegular"}}
        />
      </View>


      <View style={forgotPasswordScreenStyles.screen.bottomContainer}>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={forgotPasswordScreenStyles.screen.bottomContainer.backToLoginText.link}>{t("loginLink")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ForgotPasswordScreen