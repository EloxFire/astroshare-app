import React, { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { dashboardStyles } from "../../styles/screens/dashboard";
import { useDashboardData } from "../../contexts/useDashboardData";
import { AchievementSection } from "../../components/dashboard/achievements/AchievementSection";
import { AchievementCategory } from "../../helpers/types/dashboard/achievements/AchievementCategory";
import { i18n } from "../../helpers/scripts/i18n";
import PageTitle from "../../components/commons/PageTitle";
import ScreenInfo from "../../components/ScreenInfo";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";

interface NavigationProp {
  goBack: () => void;
  navigate: (...args: unknown[]) => void;
}

interface DashboardAchievementsScreenProps {
  navigation: NavigationProp;
}

export const DashboardAchievementsScreen: React.FC<DashboardAchievementsScreenProps> = ({ navigation }) => {
  const { achievementsCategories }: { achievementsCategories: AchievementCategory[] } = useDashboardData({ notify: false });


  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Dashboard achievements statistics screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t("dashboard.pages.achievements.title")}
        subtitle={i18n.t("dashboard.pages.achievements.subtitle")}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={dashboardStyles.content}>
        <AchievementSection achievementsCategories={achievementsCategories} />

        <ScreenInfo
          image={require('../../../assets/icons/FiUnlock.png')}
          text={i18n.t('dashboard.sections.achievements.info')}
        />
      </ScrollView>
    </View>
  );
};
