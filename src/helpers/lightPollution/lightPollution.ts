import i18next from "../../i18n";

export const getBortleMpsas = (bortle: number): number => {
  return parseFloat(i18next.t(`lightPollution.sqm.numeric.${bortle}`));
};