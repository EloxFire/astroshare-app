import React, { useEffect, useMemo, useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";
import PageTitle from "../../components/commons/PageTitle";
import { globalStyles } from "../../styles/global";
import { dashboardStyles } from "../../styles/screens/dashboard";
import { useDashboardData } from "../../contexts/useDashboardData";
import { i18n } from "../../helpers/scripts/i18n";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import { app_colors } from "../../helpers/constants";
import { astroImages } from "../../helpers/scripts/loadImages";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";

type ObjectMetric = "observed" | "photographed" | "sketched";

export const DashboardAllStatsScreen = ({ navigation }: any) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Dashboard detailed statistics screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])


  const { stats, objectStats, typeObservedTotals, typeObservedCounts } = useDashboardData({ notify: false });
  const [selectedMetric, setSelectedMetric] = useState<ObjectMetric>("observed");

  const typeIcons: Record<string, any> = {
    star: astroImages.BRIGHTSTAR,
    galaxy: astroImages.G,
    nebula: astroImages.NEB,
    cluster: astroImages.OCL,
    planet: astroImages.SATURN,
    other: astroImages.OTHER,
  };

  const metricFilters: { key: ObjectMetric; label: string; icon: any }[] = [
    { key: "observed", label: i18n.t("dashboard.allStats.filters.observed"), icon: require("../../../assets/icons/FiEye.png") },
    { key: "photographed", label: i18n.t("dashboard.allStats.filters.photographed"), icon: require("../../../assets/icons/FiCamera.png") },
    { key: "sketched", label: i18n.t("dashboard.allStats.filters.sketched"), icon: require("../../../assets/icons/FiPenTool.png") },
  ];

  const sortedObjects = useMemo(() => {
    const sorted = [...(objectStats || [])].sort((a, b) => (b[selectedMetric] || 0) - (a[selectedMetric] || 0));
    return sorted.filter((item) => (item[selectedMetric] || 0) > 0).slice(0, 12);
  }, [objectStats, selectedMetric]);

  const sortedTypes = useMemo(() => {
    const entries = Object.entries(typeObservedTotals || {}).filter(([, count]) => count > 0);
    return entries.sort((a, b) => b[1] - a[1]);
  }, [typeObservedTotals]);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t("dashboard.pages.stats.title")}
        subtitle={i18n.t("dashboard.pages.stats.subtitle")}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={dashboardStyles.content}>
        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.stats.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.stats.subtitle")}</Text>
          </View>
          <View style={dashboardStyles.statGrid}>
            <View style={dashboardStyles.statCard.container}>
              <Image source={require("../../../assets/icons/FiEye.png")} style={dashboardStyles.statCard.icon} />
              <View>
                <Text style={dashboardStyles.statCard.value}>{stats.observed}</Text>
                <Text style={dashboardStyles.statCard.label}>{i18n.t("dashboard.stats.observed.other", { count: stats.observed })}</Text>
              </View>
            </View>
            <View style={dashboardStyles.statCard.container}>
              <Image source={require("../../../assets/icons/FiCamera.png")} style={dashboardStyles.statCard.icon} />
              <View>
                <Text style={dashboardStyles.statCard.value}>{stats.photographs}</Text>
                <Text style={dashboardStyles.statCard.label}>{i18n.t("dashboard.stats.photographs.other", { count: stats.photographs })}</Text>
              </View>
            </View>
            <View style={dashboardStyles.statCard.container}>
              <Image source={require("../../../assets/icons/FiPenTool.png")} style={dashboardStyles.statCard.icon} />
              <View>
                <Text style={dashboardStyles.statCard.value}>{stats.sketches}</Text>
                <Text style={dashboardStyles.statCard.label}>{i18n.t("dashboard.stats.sketches.other", { count: stats.sketches })}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.allStats.objects.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.allStats.objects.subtitle")}</Text>
          </View>
          <View style={dashboardStyles.filters.row}>
            {metricFilters.map((filter) => (
              <SimpleButton
                key={filter.key}
                small
                fullWidth
                align="center"
                active={selectedMetric === filter.key}
                onPress={() => setSelectedMetric(filter.key)}
                icon={filter.icon}
                iconColor={selectedMetric === filter.key ? app_colors.black : app_colors.white}
                text={filter.label}
                textColor={selectedMetric === filter.key ? app_colors.black : app_colors.white}
                backgroundColor={selectedMetric === filter.key ? app_colors.white : app_colors.white_no_opacity}
              />
            ))}
          </View>
          <View style={dashboardStyles.rankings.list}>
            {sortedObjects.length === 0 && (
              <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.allStats.objects.empty")}</Text>
            )}
            {sortedObjects.map((item, index) => (
              <View key={item.key} style={dashboardStyles.rankings.item}>
                <View style={dashboardStyles.rankings.indexBadge}>
                  <Text style={dashboardStyles.rankings.indexText}>{index + 1}</Text>
                </View>
                <Image source={item.icon} style={dashboardStyles.rankings.icon} />
                <View style={dashboardStyles.rankings.info}>
                  <Text style={dashboardStyles.rankings.title} numberOfLines={1}>{item.name}</Text>
                  <Text style={dashboardStyles.rankings.subtitle} numberOfLines={1}>
                    {i18n.t("dashboard.allStats.objects.line", {
                      observed: item.observed,
                      photographed: item.photographed,
                      sketched: item.sketched,
                    })}
                  </Text>
                </View>
                <View style={dashboardStyles.rankings.countPill}>
                  <Text style={dashboardStyles.rankings.countText}>x{item[selectedMetric] || 0}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.allStats.types.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.allStats.types.subtitle")}</Text>
          </View>
          <View style={dashboardStyles.rankings.list}>
            {sortedTypes.length === 0 && (
              <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.allStats.types.empty")}</Text>
            )}
            {sortedTypes.map(([type, total], index) => (
              <View key={type} style={dashboardStyles.rankings.item}>
                <View style={dashboardStyles.rankings.indexBadge}>
                  <Text style={dashboardStyles.rankings.indexText}>{index + 1}</Text>
                </View>
                <Image
                  source={typeIcons[type] || astroImages.OTHER}
                  style={dashboardStyles.rankings.icon}
                  resizeMode="contain"
                />
                <View style={dashboardStyles.rankings.info}>
                  <Text style={dashboardStyles.rankings.title}>
                    {i18n.t(`dashboard.allStats.types.labels.${type}`, { defaultValue: type })}
                  </Text>
                  <Text style={dashboardStyles.rankings.subtitle}>
                    {i18n.t("dashboard.allStats.types.line", {
                      observations: total,
                      unique: typeObservedCounts?.[type] ?? 0,
                    })}
                  </Text>
                </View>
                <View style={dashboardStyles.rankings.countPill}>
                  <Text style={dashboardStyles.rankings.countText}>x{total}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
