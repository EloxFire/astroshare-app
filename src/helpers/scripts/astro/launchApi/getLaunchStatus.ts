import { i18n } from "../../i18n";

export const getLaunchStatus = (status: number) => {
  switch (status) {
    case 8:
      return i18n.t('spaceStuff.launches.descriptions.tbc');
    case 2:
      return i18n.t('spaceStuff.launches.descriptions.success');
    case 3:
      return i18n.t('spaceStuff.launches.descriptions.failure');
    case 4:
      return i18n.t('spaceStuff.launches.descriptions.inProgress');
    default:
      return i18n.t('spaceStuff.launches.descriptions.unknown');
  }
}