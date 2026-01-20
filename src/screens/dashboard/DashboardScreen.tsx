import React, { useEffect } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, Touchable, TouchableOpacity, View } from "react-native";
import dayjs from "dayjs";
import PageTitle from "../../components/commons/PageTitle";
import SimpleBadge from "../../components/badges/SimpleBadge";
import { globalStyles } from "../../styles/global";
import { dashboardStyles } from "../../styles/screens/dashboard";
import { routes } from "../../helpers/routes";
import { i18n } from "../../helpers/scripts/i18n";
import { app_colors } from "../../helpers/constants";
import { useDashboardData, TOTAL_MESSIER_OBJECTS } from "../../contexts/useDashboardData";
import { DashboardRecentActivityCard } from "../../components/cards/DashboardRecentActivityCard";
import { AchievementCard } from "../../components/dashboard/achievements/AchievementCard";
import * as Progress from "react-native-progress";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";

export const DashboardScreen = ({ navigation }: any) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Dashboard screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  const {
    loading,
    stats,
    messierProgress,
    observedMessierSet,
    recentActivities,
    latestAchievement,
    typeObservedCounts,
  } = useDashboardData({ notify: false });

  const observedTypes = {
    galaxy: typeObservedCounts?.galaxy ?? 0,
    nebula: typeObservedCounts?.nebula ?? 0,
    cluster: typeObservedCounts?.cluster ?? 0,
    star: typeObservedCounts?.star ?? 0,
  };

  const statsCards = [
    { label: i18n.t("dashboard.stats.favorites", { count: stats.favorites }), value: stats.favorites, icon: require("../../../assets/icons/FiHeart.png") },
    { label: i18n.t("dashboard.stats.observed", { count: stats.observed }), value: stats.observed, icon: require("../../../assets/icons/FiEye.png") },
    { label: i18n.t("dashboard.stats.photographs", { count: stats.photographs }), value: stats.photographs, icon: require("../../../assets/icons/FiCamera.png") },
    { label: i18n.t("dashboard.stats.sketches", { count: stats.sketches }), value: stats.sketches, icon: require("../../../assets/icons/FiPenTool.png") },
    { label: i18n.t("dashboard.stats.galaxies", { count: observedTypes.galaxy }), value: observedTypes.galaxy, icon: require("../../../assets/icons/astro/G.png") },
    { label: i18n.t("dashboard.stats.nebulae", { count: observedTypes.nebula }), value: observedTypes.nebula, icon: require("../../../assets/icons/astro/NEB.png") },
    { label: i18n.t("dashboard.stats.clusters", { count: observedTypes.cluster }), value: observedTypes.cluster, icon: require("../../../assets/icons/astro/GCL.png") },
    { label: i18n.t("dashboard.stats.stars", { count: observedTypes.star }), value: observedTypes.star, icon: require("../../../assets/icons/astro/BRIGHTSTAR.png") },
  ];

  const clampedProgress = Math.min(100, Math.max(0, messierProgress));

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t("dashboard.title")}
        subtitle={i18n.t("dashboard.subtitle")}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={dashboardStyles.content}>
        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.stats.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.stats.subtitle")}</Text>
          </View>
          <View style={dashboardStyles.statGrid}>
            {statsCards.map((card) => (
              <View key={card.label} style={dashboardStyles.statCard.container}>
                <Image source={card.icon} style={dashboardStyles.statCard.icon} />
                <View>
                  <Text style={dashboardStyles.statCard.value}>{card.value}</Text>
                  <Text style={dashboardStyles.statCard.label}>{card.label}</Text>
                </View>
              </View>
            ))}
          </View>
          <TouchableOpacity
            style={dashboardStyles.linkButton}
            onPress={() => navigation.navigate(routes.dashboard.stats.path)}
          >
            <Text style={dashboardStyles.linkButton.text}>{i18n.t("dashboard.actions.viewAllStats")}</Text>
            <Image source={require("../../../assets/icons/FiChevronRight.png")} style={dashboardStyles.linkButton.icon} />
          </TouchableOpacity>
        </View>

        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.messier.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>
              {i18n.t("dashboard.sections.messier.subtitle", { progress: messierProgress })}
            </Text>
          </View>
          <Progress.Bar
            progress={clampedProgress / 100}
            width={null}
            color={app_colors.green_eighty}
            unfilledColor={app_colors.white_forty}
            borderWidth={0}
            height={10}
            borderRadius={5}
          />
          <Text style={dashboardStyles.progress.text}>
            {i18n.t("dashboard.sections.messier.progressLabel", {
              observed: observedMessierSet.size,
              total: TOTAL_MESSIER_OBJECTS,
              count: observedMessierSet.size,
            })}
          </Text>
          {/* <View style={dashboardStyles.progress.wrapper}>
            <View style={dashboardStyles.progress.bar}>
              <View style={[dashboardStyles.progress.fill, { width: progressWidth }]} />
            </View>
          </View> */}
          <TouchableOpacity
            style={dashboardStyles.linkButton}
            onPress={() => navigation.navigate(routes.dashboard.messier.path)}
          >
            <Text style={dashboardStyles.linkButton.text}>{i18n.t("dashboard.actions.viewMessier")}</Text>
            <Image source={require("../../../assets/icons/FiChevronRight.png")} style={dashboardStyles.linkButton.icon} />
          </TouchableOpacity>
        </View>

        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.recent.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.recent.subtitle")}</Text>
          </View>
          <View style={dashboardStyles.activities.list}>
            {recentActivities.length === 0 && (
              <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.recent.empty")}</Text>
            )}
            {recentActivities.slice(0, 3).map((activity) => (
              <DashboardRecentActivityCard key={activity.id} activity={activity} />
            ))}
          </View>
          <TouchableOpacity
            style={dashboardStyles.linkButton}
            onPress={() => navigation.navigate(routes.dashboard.activities.path)}
          >
            <Text style={dashboardStyles.linkButton.text}>{i18n.t("dashboard.actions.viewActivities")}</Text>
            <Image source={require("../../../assets/icons/FiChevronRight.png")} style={dashboardStyles.linkButton.icon} />
          </TouchableOpacity>
        </View>

        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.achievements.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.achievements.subtitle")}</Text>
          </View>

          {
            latestAchievement && (
              <View>
                <Text style={[dashboardStyles.sectionTitle, {fontSize: 14, marginBottom: 5}]}>{i18n.t("dashboard.sections.achievements.lastAchievementTitle")}</Text>
                <AchievementCard
                  achievement={latestAchievement}
                  progressPercent={1}
                />
              </View>
            )
          }

          <TouchableOpacity
            style={dashboardStyles.linkButton}
            onPress={() => navigation.navigate(routes.dashboard.achievements.path)}
          >
            <Text style={dashboardStyles.linkButton.text}>{i18n.t("dashboard.actions.viewAchievements")}</Text>
            <Image source={require("../../../assets/icons/FiChevronRight.png")} style={dashboardStyles.linkButton.icon} />
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={dashboardStyles.loading}>
            <ActivityIndicator color={app_colors.white} />
            <Text style={dashboardStyles.loading.text}>{i18n.t("dashboard.loading")}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
