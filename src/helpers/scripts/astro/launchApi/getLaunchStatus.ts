import { i18n } from "../../i18n";

export const getLaunchStatus = (status: number) => {
  switch (status) {
    case 1:
      return i18n.t('spaceStuff.launches.descriptions.go');
    case 2:
      return i18n.t('spaceStuff.launches.descriptions.tbd');
    case 3:
      return i18n.t('spaceStuff.launches.descriptions.success');
    case 4:
      return i18n.t('spaceStuff.launches.descriptions.failure');
    case 5:
      return i18n.t('spaceStuff.launches.descriptions.onHold');
    case 6:
      return i18n.t('spaceStuff.launches.descriptions.inProgress');
    case 7:
      return i18n.t('spaceStuff.launches.descriptions.partialFailure');
    case 8:
      return i18n.t('spaceStuff.launches.descriptions.tbc');
    default:
      return i18n.t('spaceStuff.launches.descriptions.unknown');
  }
}