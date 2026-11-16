import { useTranslation } from "react-i18next";
import Badge from "../../Badges/Badge/Badge";
import { getLaunchStatusColors } from "../../../helpers/spaceLaunches/launchStatus";
import { LaunchStatus } from "../../../types/spaceLaunches/Launch";

const LaunchStatusBadge = ({ status }: { status: LaunchStatus }) => {
  const { t } = useTranslation("tools/spaceLaunches");
  const colors = getLaunchStatusColors(status.abbrev);

  return (
    <Badge
      text={t(`status.${status.abbrev}`, { defaultValue: status.name })}
      backgroundColor={colors.background}
      foregroundColor={colors.text}
    />
  );
}

export default LaunchStatusBadge;
