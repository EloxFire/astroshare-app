import { routes } from "../routes";
import { getData } from "../storage";

export const checkFirstLaunch = async (navigation: any) => {
    const launchStatus = await getData('firstLaunch');
    console.log("First launch status : ", launchStatus);

    if (!launchStatus || launchStatus === 'true') {
      navigation.navigate(routes.onboarding.path);
    }
    if (launchStatus === 'false') {
      navigation.navigate(routes.home.path);
    }
  }