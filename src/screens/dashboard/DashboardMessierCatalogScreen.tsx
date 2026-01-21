import React, { useEffect } from "react";
import { Image, Pressable, ScrollView, Text, View, type DimensionValue } from "react-native";
import PageTitle from "../../components/commons/PageTitle";
import SimpleBadge from "../../components/badges/SimpleBadge";
import { globalStyles } from "../../styles/global";
import { dashboardStyles } from "../../styles/screens/dashboard";
import { useDashboardData, TOTAL_MESSIER_OBJECTS } from "../../contexts/useDashboardData";
import { routes } from "../../helpers/routes";
import { i18n } from "../../helpers/scripts/i18n";
import { app_colors } from "../../helpers/constants";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import * as Progress from "react-native-progress";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";

export const DashboardMessierCatalogScreen = ({ navigation }: any) => {

  const {
    messierCatalog,
    observedMessierSet,
    messierPhotographedSet,
    messierSketchedSet,
    messierProgress,
    dsoCatalog,
  } = useDashboardData({ notify: false });

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Dashboard messier catalog statistics view', eventTypes.SCREEN_VIEW, {completed: messierProgress}, currentLocale)
  }, [])


  const getMessierDso = (number: number) => {
    return (dsoCatalog as any[] | undefined)?.find((dso) => {
      if (!dso?.m) return false;
      return Number(dso.m) === number;
    });
  };

  const handleMessierCardPress = (item: any) => {
    const targetDso = getMessierDso(item.number);
    if (targetDso) {
      sendAnalyticsEvent(currentUser, currentUserLocation, 'Clicked messier catalog item from dashboard', eventTypes.BUTTON_CLICK, {messier: targetDso.m}, currentLocale)
      navigation.navigate(routes.celestialBodies.details.path, { object: targetDso });
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t("dashboard.pages.messier.title")}
        subtitle={i18n.t("dashboard.pages.messier.subtitle")}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={dashboardStyles.content}>
        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.messier.title")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>
              {i18n.t("dashboard.sections.messier.subtitle", { progress: messierProgress })}
            </Text>
          </View>
          <Progress.Bar
            progress={messierProgress / 100}
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
        </View>

        <View style={dashboardStyles.section}>
          <View style={dashboardStyles.sectionHeader}>
            <Text style={dashboardStyles.sectionTitle}>{i18n.t("dashboard.sections.messier.catalogTitle")}</Text>
            <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.messier.catalogSubtitle")}</Text>
          </View>
          <View style={dashboardStyles.messierGrid}>
            {messierCatalog.map((item) => {
              const observed = observedMessierSet.has(item.number);
              const photographed = messierPhotographedSet.has(item.number);
              const sketched = messierSketchedSet.has(item.number);
              const targetDso = getMessierDso(item.number);

              return (
                <Pressable
                  key={item.id}
                  style={[
                    dashboardStyles.messierCard.container,
                    observed && dashboardStyles.messierCard.observed,
                  ]}
                  android_ripple={{ color: app_colors.white_twenty }}
                  onPress={() => {
                    handleMessierCardPress(item);
                  }}
                >
                  <View style={dashboardStyles.messierCard.header}>
                    <SimpleButton
                      icon={observed ? require('../../../assets/icons/FiCheck.png') : require('../../../assets/icons/FiClock.png')}
                      backgroundColor={observed ? app_colors.green_forty : app_colors.white_twenty}
                      iconColor={observed ? app_colors.green : app_colors.white}
                      active
                      activeBorderColor={observed ? app_colors.green_eighty : app_colors.white_twenty}
                      small
                    />
                    <Text style={dashboardStyles.messierCard.title}>{item.label}</Text>
                    {item.commonName ? (
                      <Text style={dashboardStyles.messierCard.subtitle} numberOfLines={2}>
                        {item.commonName}
                      </Text>
                    ) : null}
                  </View>

                  {(observed || photographed || sketched) && (
                    <View style={dashboardStyles.messierCard.actions}>
                      {observed && (
                        <Image
                          source={require("../../../assets/icons/FiEye.png")}
                          style={dashboardStyles.messierCard.actionIcon}
                        />
                      )}
                      {photographed && (
                        <Image
                          source={require("../../../assets/icons/FiCamera.png")}
                          style={dashboardStyles.messierCard.actionIcon}
                        />
                      )}
                      {sketched && (
                        <Image
                          source={require("../../../assets/icons/FiPenTool.png")}
                          style={dashboardStyles.messierCard.actionIcon}
                        />
                      )}
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
