import { Image, Text, View } from "react-native";
import { ActivityItem } from "../../helpers/types/dashboard/ActivityItem";
import { dashboardStyles } from "../../styles/screens/dashboard";
import dayjs from "dayjs";
import { i18n } from "../../helpers/scripts/i18n";

export const DashboardRecentActivityCard = ({ activity }: { activity: ActivityItem }) => {
  return (
    <View key={activity.id} style={dashboardStyles.activities.item}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={activity.icon} style={dashboardStyles.activities.item.icon} />
        <View>
          <Text style={dashboardStyles.activities.item.title} numberOfLines={1}>{activity.title}</Text>
          <Text style={dashboardStyles.activities.item.description} numberOfLines={2}>{activity.description}</Text>
        </View>
      </View>
      <Text style={dashboardStyles.activities.item.time}>
        {activity.timestamp && dayjs(activity.timestamp).isValid()
          ? dayjs(activity.timestamp).fromNow()
          : i18n.t("dashboard.sections.recent.noDate")}
      </Text>
    </View>
  )
}