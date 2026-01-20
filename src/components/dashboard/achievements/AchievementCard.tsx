import { Image, Pressable, Text, TouchableOpacity, View } from "react-native"
import { achievementCardStyles } from "../../../styles/components/dashboard/achievements/achievementCard"
import { Achievement } from "../../../helpers/types/dashboard/achievements/Achievement"
import { app_colors } from "../../../helpers/constants"
import * as Progress from 'react-native-progress';
import { i18n } from "../../../helpers/scripts/i18n";

interface AchievementCardProps {
  achievement: Achievement
  progressPercent: number
  onPress?: () => void
  isExpanded?: boolean
  hasProgress?: boolean
}

export const AchievementCard = ({achievement, onPress, isExpanded, hasProgress, progressPercent}: AchievementCardProps) => {
  return (
    <Pressable onPress={onPress} style={[achievementCardStyles.card, {backgroundColor: achievement.achieved ? app_colors.green_twenty : 'transparent'}]}>
      <View style={achievementCardStyles.card.header}>
        <Image style={achievementCardStyles.card.header.icon} source={achievement.achieved ? require('../../../../assets/icons/FiUnlock.png') : require('../../../../assets/icons/FiLock.png')} />
        <View style={{flex: 1}}>
          <Text style={achievementCardStyles.card.header.title}>{achievement.title}</Text>
          <Text style={achievementCardStyles.card.header.description}>{achievement.description}</Text>
        </View>
        {
          hasProgress && (
            <Image style={achievementCardStyles.card.header.icon} source={isExpanded ? require('../../../../assets/icons/FiChevronDown.png') : require('../../../../assets/icons/FiChevronRight.png')} />
          )
        }
      </View>
      {
        isExpanded && hasProgress && (
          <View style={achievementCardStyles.card.progressContainer}>
            <Text style={achievementCardStyles.card.progressContainer.text}>
              {i18n.t("dashboard.sections.achievements.progressLabel", {
                current: achievement.current,
                target: achievement.target,
              })}
            </Text>
            <Progress.Bar
              progress={progressPercent}
              color={app_colors.green_eighty}
              unfilledColor={app_colors.white_forty}
              borderWidth={0}
              height={10}
              width={null}
              borderRadius={5}
            />
          </View>
        )
      }
    </Pressable>
  )
}