import React from "react";
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

export const DashboardMessierCatalogScreen = ({ navigation }: any) => {
  const {
    messierCatalog,
    observedMessierSet,
    messierPhotographedSet,
    messierSketchedSet,
    messierProgress,
    dsoCatalog,
  } = useDashboardData({ notify: false });

  const progressWidth = `${Math.min(100, Math.max(0, messierProgress))}%` as DimensionValue;

  const getMessierDso = (number: number) => {
    return (dsoCatalog as any[] | undefined)?.find((dso) => {
      if (!dso?.m) return false;
      return Number(dso.m) === number;
    });
  };

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
                    if (targetDso) {
                      navigation.navigate(routes.celestialBodies.details.path, { object: targetDso });
                    }
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
