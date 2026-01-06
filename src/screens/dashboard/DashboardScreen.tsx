import React from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, Text, View } from "react-native";
import dayjs from "dayjs";
import PageTitle from "../../components/commons/PageTitle";
import SimpleBadge from "../../components/badges/SimpleBadge";
import { globalStyles } from "../../styles/global";
import { dashboardStyles } from "../../styles/screens/dashboard";
import { routes } from "../../helpers/routes";
import { i18n } from "../../helpers/scripts/i18n";
import { app_colors } from "../../helpers/constants";
import { useDashboardData, TOTAL_MESSIER_OBJECTS } from "../../contexts/useDashboardData";

export const DashboardScreen = ({ navigation }: any) => {
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
    { label: i18n.t("dashboard.stats.favorites"), value: stats.favorites, icon: require("../../../assets/icons/FiHeart.png") },
    { label: i18n.t("dashboard.stats.observed"), value: stats.observed, icon: require("../../../assets/icons/FiEye.png") },
    { label: i18n.t("dashboard.stats.photographs"), value: stats.photographs, icon: require("../../../assets/icons/FiCamera.png") },
    { label: i18n.t("dashboard.stats.sketches"), value: stats.sketches, icon: require("../../../assets/icons/FiPenTool.png") },
    { label: i18n.t("dashboard.stats.galaxies"), value: observedTypes.galaxy, icon: require("../../../assets/icons/astro/G.png") },
    { label: i18n.t("dashboard.stats.nebulae"), value: observedTypes.nebula, icon: require("../../../assets/icons/astro/NEB.png") },
    { label: i18n.t("dashboard.stats.clusters"), value: observedTypes.cluster, icon: require("../../../assets/icons/astro/GCL.png") },
    { label: i18n.t("dashboard.stats.stars"), value: observedTypes.star, icon: require("../../../assets/icons/astro/STAR.png") },
  ];

  const clampedProgress = Math.min(100, Math.max(0, messierProgress));
  const progressWidth: `${number}%` = `${clampedProgress}%`;

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
        </View>

        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.messier.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>
              {i18n.t("dashboard.sections.messier.subtitle", { progress: messierProgress })}
            </Text>
          </View>
          <View style={dashboardStyles.progress.wrapper}>
            <View style={dashboardStyles.progress.bar}>
              <View style={[dashboardStyles.progress.fill, { width: progressWidth }]} />
            </View>
            <Text style={dashboardStyles.progress.text}>
              {i18n.t("dashboard.sections.messier.progressLabel", {
                observed: observedMessierSet.size,
                total: TOTAL_MESSIER_OBJECTS,
              })}
            </Text>
          </View>
          <Pressable
            style={dashboardStyles.linkButton}
            onPress={() => navigation.navigate(routes.dashboard.messier.path)}
          >
            <Text style={dashboardStyles.linkButton.text}>{i18n.t("dashboard.actions.viewMessier")}</Text>
            <Image source={require("../../../assets/icons/FiChevronRight.png")} style={dashboardStyles.linkButton.icon} />
          </Pressable>
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
            {recentActivities.slice(0, 5).map((activity) => (
              <View key={activity.id} style={dashboardStyles.activities.item}>
                <View style={dashboardStyles.activities.meta}>
                  <Text style={dashboardStyles.activities.title} numberOfLines={1}>{activity.title}</Text>
                  <Text style={dashboardStyles.activities.time}>
                    {activity.timestamp && dayjs(activity.timestamp).isValid()
                      ? dayjs(activity.timestamp).fromNow()
                      : i18n.t("dashboard.sections.recent.noDate")}
                  </Text>
                </View>
                <Text style={dashboardStyles.activities.description} numberOfLines={2}>{activity.description}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.achievements.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.achievements.subtitle")}</Text>
          </View>

          {latestAchievement ? (
            <View
              style={[
                dashboardStyles.achievements.card,
                latestAchievement.achieved && dashboardStyles.achievements.achieved,
              ]}
            >
              <View style={dashboardStyles.achievements.header}>
                <Text style={dashboardStyles.achievements.title}>{latestAchievement.title}</Text>
                <SimpleBadge
                  text={i18n.t("dashboard.sections.achievements.badge.unlocked")}
                  backgroundColor={app_colors.green_eighty}
                  foregroundColor={app_colors.black}
                  small
                />
              </View>
              <Text style={dashboardStyles.achievements.description}>{latestAchievement.description}</Text>
            </View>
          ) : (
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.achievements.previewEmpty")}</Text>
          )}

          <Pressable
            style={dashboardStyles.linkButton}
            onPress={() => navigation.navigate(routes.dashboard.achievements.path)}
          >
            <Text style={dashboardStyles.linkButton.text}>{i18n.t("dashboard.actions.viewAchievements")}</Text>
            <Image source={require("../../../assets/icons/FiChevronRight.png")} style={dashboardStyles.linkButton.icon} />
          </Pressable>
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
