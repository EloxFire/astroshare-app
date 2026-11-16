import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { groupLaunchesByPeriod } from "../../../helpers/spaceLaunches/launchGrouping";
import { Launch } from "../../../types/spaceLaunches/Launch";
import LaunchCard from "../LaunchCard/LaunchCard";
import { launchesListStyles } from "./LaunchesList.styles";
import SectionHeader from "../../layout/SectionHeader/SectionHeader";

const LaunchesList = ({ launches }: { launches: Launch[] }) => {
  const { t } = useTranslation("tools/spaceLaunches");
  const { formatDate } = useAppUnits();

  if (launches.length === 0) {
    return <Text style={launchesListStyles.empty}>{t("list.empty")}</Text>;
  }

  const groups = groupLaunchesByPeriod(launches, new Date(), formatDate, t);

  return (
    <View style={launchesListStyles.container}>
      {groups.map((group) => (
        <View key={group.key} style={launchesListStyles.container.group}>
          <SectionHeader title={group.label} />
          {group.launches.map((launch) => (
            <LaunchCard key={launch.id} launch={launch} />
          ))}
        </View>
      ))}
    </View>
  );
}

export default LaunchesList;
