import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../helpers/globalStyles";
import { useRouter } from 'expo-router';
import { settingsScreenStyles } from "./SettingsScreen.styles";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { useEffect } from "react";
import { ChevronRightIcon } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";
import { settingsCategories } from "../../helpers/settings/appSettingsCategories";
import { settingsList } from "../../helpers/settings/appSetting";
import { useTranslation } from "react-i18next";

export const SettingsScreen = () => {
  const router = useRouter();
  const { t } = useTranslation("settings");
  useEffect(() => {
    StatusBar.setBarStyle("dark-content")
  }, [])

  const handleCreateAccountPress = () => {
    console.log("[SettingsScreen] Create Account button pressed. Navigate to account creation flow.");
  }

  const handleSettingPress = (route: string) => {
    console.log(`[SettingsScreen] Navigate to ${route}`);
    router.push(route);
  };

  return (
    <View style={settingsScreenStyles.screen}>
      <ScreenHeader title={t("screen.title")} main={false} disableBackButton />
      <View style={settingsScreenStyles.content}>

        {/* Carte de gestion du compte */}
        {/* Si utilisateur connecté affochage détails infos sinon affichage carte "Créer un compte pour plus de personalisation" */}
        {/* Carte "Créer un compte en dur pour l'instant" */}
        <TouchableOpacity style={settingsScreenStyles.createAccountCard} onPress={handleCreateAccountPress}>
          <View style={settingsScreenStyles.createAccountCard.textContainer}>
            <Text style={settingsScreenStyles.createAccountCard.textContainer.title}>{t("screen.createAccountCard.title")}</Text>
            <Text style={settingsScreenStyles.createAccountCard.textContainer.subtitle}>{t("screen.createAccountCard.subtitle")}</Text>
          </View>
          <View style={settingsScreenStyles.createAccountCard.button}>
            <ChevronRightIcon color={app_colors.white} size={20} />
          </View>
        </TouchableOpacity>

        <View style={settingsScreenStyles.settingsList}>
          {
            settingsCategories.map((category) => {
              return (
                <View key={category.id} style={{marginBottom: 20}}>
                  <Text style={globalStyles.categoryTitle}>{t(`categories.${category.id}`)}</Text>
                  {
                    settingsList.map((setting) => {
                      if (setting.category === category.id) {
                        return (
                          <TouchableOpacity key={setting.id} style={settingsScreenStyles.settingsList.settingItem} onPress={() => handleSettingPress(setting.route)}>
                            <View style={settingsScreenStyles.settingsList.settingItem.content}>
                              {setting.icon && <setting.icon color={app_colors.primary.main} size={20} style={{marginBottom: 5}} />}
                              <View>
                                <Text style={settingsScreenStyles.settingsList.settingItem.content.title}>{t(`items.${setting.id}.name`)}</Text>
                                <Text style={settingsScreenStyles.settingsList.settingItem.content.subtitle}>{t(`items.${setting.id}.description`)}</Text>
                              </View>
                            </View>
                            <ChevronRightIcon color={app_colors.primary.main} size={20} />
                          </TouchableOpacity>
                        );
                      }
                      return null;
                    })
                  }
                </View>
              )
            })
          }
          
        </View>
      </View>
    </View>
  );
};
