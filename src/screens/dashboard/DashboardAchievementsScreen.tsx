import React, { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import PageTitle from "../../components/commons/PageTitle";
import SimpleBadge from "../../components/badges/SimpleBadge";
import { globalStyles } from "../../styles/global";
import { dashboardStyles } from "../../styles/screens/dashboard";
import { i18n } from "../../helpers/scripts/i18n";
import { app_colors } from "../../helpers/constants";
import { useDashboardData } from "../../contexts/useDashboardData";

interface NavigationProp {
  goBack: () => void;
  navigate: (...args: unknown[]) => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  current?: number;
  target?: number;
}

interface AchievementCategory {
  id: string;
  title: string;
  items: Achievement[];
}

interface DashboardAchievementsScreenProps {
  navigation: NavigationProp;
}

export const DashboardAchievementsScreen: React.FC<DashboardAchievementsScreenProps> = ({ navigation }) => {
  const { achievementsCategories }: { achievementsCategories: AchievementCategory[] } = useDashboardData({ notify: false });
  const initialState = useMemo(
    () =>
      achievementsCategories.reduce<Record<string, boolean>>((acc, cat) => {
        acc[cat.id] = false;
        return acc;
      }, {}),
    [achievementsCategories]
  );
  const [expanded, setExpanded] = useState<Record<string, boolean>>(initialState);
  const [expandedAchievements, setExpandedAchievements] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAchievement = (id: string) => {
    setExpandedAchievements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t("dashboard.pages.achievements.title")}
        subtitle={i18n.t("dashboard.pages.achievements.subtitle")}
      />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }} contentContainerStyle={dashboardStyles.content}>
        {achievementsCategories.map((category) => (
          <View key={category.id} style={dashboardStyles.section}>
            <Pressable style={dashboardStyles.sectionHeader} onPress={() => toggleCategory(category.id)}>
              <View style={{ flex: 1 }}>
                <Text style={dashboardStyles.sectionTitle}>{category.title}</Text>
                <Text style={dashboardStyles.sectionSubtitle}>{i18n.t("dashboard.sections.achievements.subtitle")}</Text>
                {expanded[category.id] === false && (
                  (() => {
                    const next = category.items.find((item) => !item.achieved);
                    if (!next) return null;
                    return (
                      <View style={dashboardStyles.achievements.nextStep}>
                        <View>
                          <Text style={dashboardStyles.achievements.nextStep.title}>Prochain palier</Text>
                          <Text style={dashboardStyles.achievements.nextStep.description}>
                            {i18n.t("dashboard.sections.achievements.badge.locked")} • {next.title}
                          </Text>
                        </View>
                        <Image
                          source={require("../../../assets/icons/FiLock.png")}
                          style={dashboardStyles.achievements.chevron}
                        />
                      </View>
                    );
                  })()
                )}
              </View>
              <Image
                source={require("../../../assets/icons/FiChevronDown.png")}
                style={[
                  dashboardStyles.achievements.chevron,
                  expanded[category.id] === false && { transform: [{ rotate: "180deg" }] },
                ]}
              />
            </Pressable>

            {expanded[category.id] !== false && (
              <View style={dashboardStyles.achievements.grid}>
                {category.items.map((achievement) => {
                  const isExpanded = expandedAchievements[achievement.id] ?? false;
                  const hasProgress =
                    typeof achievement.target === "number" &&
                    typeof achievement.current === "number" &&
                    achievement.target > 0;
                  const progressPercent = hasProgress
                    ? Math.min(100, Math.round((achievement.current! / achievement.target!) * 100))
                    : 0;

                  return (
                    <Pressable
                      key={achievement.id}
                      onPress={() => toggleAchievement(achievement.id)}
                      style={[
                        dashboardStyles.achievements.card,
                        achievement.achieved && dashboardStyles.achievements.achieved,
                      ]}
                    >
                      <View style={dashboardStyles.achievements.header}>
                        <Text style={dashboardStyles.achievements.title}>{achievement.title}</Text>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                          <SimpleBadge
                            text={
                              achievement.achieved
                                ? i18n.t("dashboard.sections.achievements.badge.unlocked")
                                : i18n.t("dashboard.sections.achievements.badge.locked")
                            }
                            backgroundColor={achievement.achieved ? app_colors.green_eighty : app_colors.white_twenty}
                            foregroundColor={achievement.achieved ? app_colors.black : app_colors.white}
                            small
                          />
                          {hasProgress && (
                            <Image
                              source={require("../../../assets/icons/FiChevronDown.png")}
                              style={[
                                dashboardStyles.achievements.chevron,
                                isExpanded && { transform: [{ rotate: "180deg" }] },
                              ]}
                            />
                          )}
                        </View>
                      </View>
                      <Text style={dashboardStyles.achievements.description}>{achievement.description}</Text>

                      {isExpanded && hasProgress && (
                        <View style={dashboardStyles.achievements.progress}>
                          <View style={dashboardStyles.progress.bar}>
                            <View
                              style={[
                                dashboardStyles.progress.fill,
                                { width: `${progressPercent}%` as const },
                              ]}
                            />
                          </View>
                          <Text style={dashboardStyles.achievements.progressText}>
                            {i18n.t("dashboard.sections.achievements.progressLabel", {
                              current: achievement.current ?? 0,
                              target: achievement.target ?? 0,
                            })}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
