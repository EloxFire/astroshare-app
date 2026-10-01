import { Image, Text, TouchableOpacity, View } from "react-native"
import { registerScreenStyles } from "./RegisterScreen.styles"
import { SafeAreaView } from "react-native-safe-area-context"
import { InputWithIcon } from "../../../components/InputWithIcon/InputWithIcon"
import { app_colors } from "../../../helpers/variables"
import { useEffect, useState } from "react"
import { router } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Trans, useTranslation } from "react-i18next"
import { PasswordRequirementsChecklist } from "../../../components/PasswordRequirementsChecklist/PasswordRequirementsChecklist"
import Checkbox from "../../../components/Checkbox/Checkbox"

const RegisterScreen = () => {
  const { t } = useTranslation("auth/register");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    StatusBar.setStyle("dark")
  }, [])

  const handleSubmit = () => {
    if(username.trim() === "" || email.trim() === "" || password.trim() === "") {
      // TODO: Show error message for empty fields
      return;
    }

    if(!acceptedTerms) {
      // TODO: Show error message for not accepting terms
      return;
    }

    // TODO: Implement registration logic here (e.g., send a request to the backend)
  }

  return (
    <SafeAreaView style={registerScreenStyles.screen}>
      <View style={registerScreenStyles.screen.logoContainer}>
        <Image
          source={require("../../../../assets/icons/icon_primary.png")}
          style={{ width: 70, height: 70 }}
        />
        <Text style={registerScreenStyles.screen.logoContainer.title}>{t("title")}</Text>
        <Text style={registerScreenStyles.screen.logoContainer.subtitle}>{t("subtitle")}</Text>
      </View>

      <View style={registerScreenStyles.screen.formContainer}>
        <InputWithIcon
          label={t("form.username.label")}
          placeholder={t("form.username.placeholder")}
          value={username}
          onChangeText={setUsername}
          action={() => console.log("Username submitted")}
          additionnalInputStyles={{paddingVertical: 5}}
        />

        <InputWithIcon
          label={t("form.email.label")}
          placeholder={t("form.email.placeholder")}
          value={email}
          onChangeText={setEmail}
          action={() => console.log("Email submitted")}
          additionnalInputStyles={{paddingVertical: 5}}
        />

        <InputWithIcon
          label={t("form.password.label")}
          placeholder={t("form.password.placeholder")}
          value={password}
          onChangeText={setPassword}
          action={() => console.log("Password submitted")}
          additionnalInputStyles={{paddingVertical: 5}}
          password
        />

        <PasswordRequirementsChecklist
          password={password}
          style={{ width: "100%", alignSelf: "flex-start" }}
          requirements={[
            { label: t("form.password.requirements.minLength"), test: (value) => value.length >= 8 },
            { label: t("form.password.requirements.uppercase"), test: (value) => /[A-Z]/.test(value) },
            { label: t("form.password.requirements.digit"), test: (value) => /[0-9]/.test(value) },
          ]}
        />
      </View>

      <View style={registerScreenStyles.screen.termsRow}>
        <Checkbox checked={acceptedTerms} onChange={setAcceptedTerms} />
        <Text style={registerScreenStyles.screen.termsRow.text}>
          <Trans i18nKey="terms.accept" ns="auth/register">
            <Text style={registerScreenStyles.screen.termsRow.text.bold} />
            <Text style={registerScreenStyles.screen.termsRow.text.bold} />
          </Trans>
        </Text>
      </View>

      <TouchableOpacity style={registerScreenStyles.screen.formContainer.button} disabled={!acceptedTerms}>
        <Text style={registerScreenStyles.screen.formContainer.button.text}>{t("submitButton")}</Text>
      </TouchableOpacity>

      <View style={registerScreenStyles.screen.bottomContainer}>
        <Text style={registerScreenStyles.screen.bottomContainer.noAccountText}>
          {t("hasAccount")}
        </Text>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text style={registerScreenStyles.screen.bottomContainer.noAccountText.link}>{t("loginLink")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default RegisterScreen
