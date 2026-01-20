import React, { useMemo, useState } from "react";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { i18n } from "../../../helpers/scripts/i18n";
import { app_colors } from "../../../helpers/constants";
import { achievementSectionStyles } from "../../../styles/components/dashboard/achievements/achievementSection";
import * as Progress from 'react-native-progress';
import { AchievementCategory } from "../../../helpers/types/dashboard/achievements/AchievementCategory";
import SimpleBadge from "../../badges/SimpleBadge";
import { AchievementCard } from "./AchievementCard";


interface AchievementSectionProps {
  achievementsCategories: AchievementCategory[];
}

export const AchievementSection: React.FC<AchievementSectionProps> = ({ achievementsCategories }) => {

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [expandedAchievements, setExpandedAchievements] = useState<Record<string, boolean>>({});

  const toggleCategory = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleAchievement = (id: string) => {
    setExpandedAchievements((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <>
      {achievementsCategories.map((category) => {
        const achievedCount = category.items.filter((item) => item.achieved).length;
        const totalCount = category.items.length;
        const categoryProgress = totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0;

        return (
          <Pressable onPress={() => toggleCategory(category.id)} key={category.id} style={achievementSectionStyles.section}>
            <View style={achievementSectionStyles.section.header}>
              <View style={achievementSectionStyles.section.header.progressContainer}>
                <Progress.Circle
                  progress={categoryProgress / 100}
                  size={40}
                  unfilledColor={app_colors.white_forty}
                  color={app_colors.green_eighty}
                  borderWidth={0}
                  thickness={5}
                  showsText
                  formatText={() => `${categoryProgress}%`}
                  textStyle={{ fontSize: 10, color: app_colors.white }}
                />
                <View style={{ display: 'flex', flexDirection: 'column' as 'column', alignItems: 'flex-start' as 'flex-start', flex: 1 }}>
                  <Text style={achievementSectionStyles.section.header.progressContainer.title}>{category.title}</Text>
                  <SimpleBadge
                    text={`${achievedCount}/${totalCount} ${i18n.t("dashboard.sections.achievements.badge.unlocked")}`}
                    backgroundColor={app_colors.white_twenty}
                    foregroundColor={app_colors.white}
                    small
                    icon={require('../../../../assets/icons/FiUnlock.png')}
                  />
                </View>
                
              </View>
              <Image
                style={[achievementSectionStyles.section.header.chevron, {transform: [{ rotate: expanded[category.id] ? "90deg" : "0deg" }]}]}
                source={require("../../../../assets/icons/FiChevronRight.png")}
              />
            </View>
            {
              expanded[category.id] && (
                <View style={achievementSectionStyles.section.achievements}>
                  {
                    category.items.map((achievement) => {
                      const isExpanded = expandedAchievements[achievement.id] ?? false;
                      const hasProgress =
                        typeof achievement.target === "number" &&
                        typeof achievement.current === "number" &&
                        achievement.target > 0;
                      const progressPercent = hasProgress
                        ? Math.min(100, Math.round((achievement.current! / achievement.target!) * 100))
                        : 0;

                      return (
                        <AchievementCard
                          key={achievement.id}
                          achievement={achievement}
                          onPress={() => toggleAchievement(achievement.id)}
                          isExpanded={isExpanded}
                          hasProgress={hasProgress}
                          progressPercent={progressPercent/100}
                        />
                      )}
                    )
                  }
                </View>
              )
            }
          </Pressable>
        );
      })}
    </>
  );
};
