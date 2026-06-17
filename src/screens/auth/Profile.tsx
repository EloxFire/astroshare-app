import React, { useEffect } from "react";
import {ScrollView, View} from "react-native";
import {globalStyles} from "../../styles/global";
import {useAuth} from "../../contexts/AuthContext";
import {profileScreenStyles} from "../../styles/screens/auth/profile";
import {i18n} from "../../helpers/scripts/i18n";
import PageTitle from "../../components/commons/PageTitle";
import {routes} from "../../helpers/routes";
import {app_colors} from "../../helpers/constants";
import ProLocker from "../../components/cards/ProLocker";
import {isProUser} from "../../helpers/scripts/auth/checkUserRole";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import { DataAndSubscriptionCard } from "../../components/profile/dataAndSubscription/DataAndSubscriptionCard";
import { PersonnalInfosCard } from "../../components/profile/personnalInfos/PersonnalInfosCard";
import { AccountInfosCard } from "../../components/profile/AccountInfosCard";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useTranslation } from "../../hooks/useTranslation";
import { eventTypes } from "../../helpers/constants/analytics";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";

export default function ProfileScreen({ navigation }: any) {

  const {currentUser, logoutUser, updateCurrentUser} = useAuth()
  const { currentUserLocation } = useSettings();
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'profile_screen_view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  const handleLogout = async () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'logout_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)
    await logoutUser()
    navigation.navigate(routes.home.path)
  }

  if(!currentUser) return (<></>)

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('auth.profile.title')}
        subtitle={i18n.t('auth.profile.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={profileScreenStyles.content}>
          <AccountInfosCard navigation={navigation} />
          {
            !isProUser(currentUser) &&
              <ProLocker id={routes.sellScreen.path} navigation={navigation} image={require('../../../assets/images/tools/apod.png')} darker small />
          }
          <PersonnalInfosCard navigation={navigation} />
          <DataAndSubscriptionCard navigation={navigation} />

          <SimpleButton
            fullWidth
            icon={require('../../../assets/icons/FiLogout.png')}
            align={'center'}
            iconColor={app_colors.red_eighty}
            textAdditionalStyles={{color: app_colors.red_eighty, fontFamily: 'GilroyBlack', textTransform: 'uppercase', fontSize: 16}}
            text={i18n.t('auth.profile.logout')}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </View>
  );
}
