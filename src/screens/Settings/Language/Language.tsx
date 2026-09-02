import { Text, View, TouchableOpacity } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { getTranslationCompleteness } from "../../../i18n/translationCompleteness";
import { supportedLanguages } from "../../../helpers/langs";
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { languageScreenStyles } from "./Language.styles";
import { useUserDataStore } from "../../../store/userData.store";
import { Check, Languages, Smartphone } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import SwitchButton from "../../../components/SwitchButton/SwitchButton";
import * as Localization from "expo-localization";
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import InfoCard from "../../../components/InfoCard/InfoCard";

const LanguageScreen = () => {

  const currentLocale = useUserDataStore(state => state.locale);
  const setLocale = useUserDataStore(state => state.setLocale);
  const { t } = useTranslation("settings");

  const deviceLanguage = Localization.getLocales()[0]?.languageCode ?? null;

  const [completeTranslations, setCompleteTranslations] = useState<{ [key: string]: number }>({});
  const [inProgressTranslations, setInProgressTranslations] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    StatusBar.setStyle("dark");    
  }, [])

  useEffect(() => {
    for (const lang of supportedLanguages) {
      const completeness = getTranslationCompleteness(lang.code);
      if (completeness === 100) {
        setCompleteTranslations(prev => ({ ...prev, [lang.code]: completeness }));
      } else {
        setInProgressTranslations(prev => ({ ...prev, [lang.code]: completeness }));
      }
    }
  }, [])

  const handleChangeLocale = (langCode: string) => {
    if (currentLocale === langCode) return;
    setLocale(langCode);
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("language.title")} main={false} />
      <View style={globalStyles.content}>

        <View style={languageScreenStyles.autoLanguageCard}>
          <View style={languageScreenStyles.autoLanguageCard.row}>
            <Smartphone size={20} color={app_colors.accent.main} />
            <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Text style={languageScreenStyles.autoLanguageCard.title}>{t("language.autoLanguage.title")}</Text>
              <Text style={languageScreenStyles.autoLanguageCard.description}>{t("language.autoLanguage.description", { deviceLanguage: deviceLanguage ?? "system" })}</Text>
            </View>
          </View>
          <SwitchButton isEnabled={currentLocale === null} onToggle={() => setLocale(null)} />
        </View>

        <Text style={globalStyles.categoryTitle}>{t("language.sections.completed")}</Text>
        <View style={globalStyles.content.heroCard}>
          {
            Object.entries(completeTranslations).map(([code, completeness], index) => {
              const lang = supportedLanguages.find(l => l.code === code);
              if (!lang) return null;
              return (
                <TouchableOpacity onPress={() => handleChangeLocale(lang.code)} key={lang.code} style={[globalStyles.content.heroCard.item, index !== Object.entries(completeTranslations).length - 1 && globalStyles.content.heroCard.item.withBorder]}>
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text>{getUnicodeFlagIcon(lang.flagCode)}</Text>
                    <Text style={languageScreenStyles.itemCardTitle}>{lang.name}</Text>
                  </View>
                  {
                    currentLocale === lang.code && (
                      <Check size={20} color={app_colors.accent.main} style={{ marginLeft: 10 }} />
                    )
                  }
                </TouchableOpacity>
              )
            })
          }
        </View>

        <Text style={globalStyles.categoryTitle}>{t("language.sections.inProgress")}</Text>
        <View style={globalStyles.content.heroCard}>
          {
            Object.entries(inProgressTranslations).map(([code, completeness], index) => {
              const lang = supportedLanguages.find(l => l.code === code);
              if (!lang) return null;
              return (
                <TouchableOpacity onPress={() => handleChangeLocale(lang.code)} key={lang.code} style={[globalStyles.content.heroCard.item, index !== Object.entries(inProgressTranslations).length - 1 && globalStyles.content.heroCard.item.withBorder]}>
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <Text>{getUnicodeFlagIcon(lang.flagCode)}</Text>
                    <Text style={languageScreenStyles.itemCardTitle}>{lang.name}</Text>
                  </View>
                  <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    <View style={languageScreenStyles.completenessBadge}>
                      <Text style={languageScreenStyles.completenessBadge.text}>{completeness}%</Text>
                    </View>
                    {
                      currentLocale === lang.code && (
                        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", marginLeft: 10 }}>
                          <Check size={20} color={app_colors.accent.main} />
                        </View>
                      )
                    }
                  </View>
                </TouchableOpacity>
              )
            })
          }
          {
            Object.entries(inProgressTranslations).length === 0 && (
              <Text style={{ color: app_colors.primary.medium, fontFamily: "ZTNatureRegular", fontSize: 14}}>{t("language.noInProgress")}</Text>
            )
          }
        </View>

        <InfoCard
          title={t("language.infoCard.title")}
          description={t("language.infoCard.description")}
          icon={Languages}
          link="https://traduction.astroshare.fr"
        />
      </View>
    </View>
  )
}

export default LanguageScreen;