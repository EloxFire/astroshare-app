import React from "react";
import { ScrollView, Text, View } from "react-native";
import PageTitle from "../../components/commons/PageTitle";
import { dashboardStyles } from "../../styles/screens/dashboard";
import { globalStyles } from "../../styles/global";
import { useDashboardData } from "../../contexts/useDashboardData";
import { i18n } from "../../helpers/scripts/i18n";
import { DashboardRecentActivityCard } from "../../components/cards/DashboardRecentActivityCard";

export const DashboardActivitiesScreen = ({ navigation }: any) => {
  const { recentActivities } = useDashboardData({ notify: false });

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t("dashboard.pages.activities.title")}
        subtitle={i18n.t("dashboard.pages.activities.subtitle")}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={dashboardStyles.content}>
        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.recent.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.recent.subtitle")}</Text>
          </View>
          <View style={dashboardStyles.activities.list}>
            {recentActivities.length === 0 && (
              <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.recent.empty")}</Text>
            )}
            {recentActivities.map((activity) => (
              <DashboardRecentActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
