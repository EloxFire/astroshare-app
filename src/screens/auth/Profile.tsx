import React from "react";
import {Dimensions, Image, ScrollView, Text, View} from "react-native";
import {globalStyles} from "../../styles/global";
import {useAuth} from "../../contexts/AuthContext";
import {profileScreenStyles} from "../../styles/screens/auth/profile";
import {i18n} from "../../helpers/scripts/i18n";
import PageTitle from "../../components/commons/PageTitle";
import DSOValues from "../../components/commons/DSOValues";
import dayjs from "dayjs";
import {routes} from "../../helpers/routes";
import {app_colors} from "../../helpers/constants";
import ProLocker from "../../components/cards/ProLocker";
import {isProUser} from "../../helpers/scripts/auth/checkUserRole";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {showToast} from "../../helpers/scripts/showToast";
import { DataAndSubscriptionCard } from "../../components/profile/dataAndSubscription/DataAndSubscriptionCard";
import { PersonnalInfosCard } from "../../components/profile/personnalInfos/PersonnalInfosCard";
import { AccountInfosCard } from "../../components/profile/AccountInfosCard";

export default function ProfileScreen({ navigation }: any) {

  const {currentUser, logoutUser, updateCurrentUser} = useAuth()

  const handleLogout = async () => {
    await logoutUser()
    navigation.push(routes.home.path)
  }

  const humanizeAccountRole = (role: string) => {
    switch (role) {
      case 'member':
        return {role: i18n.t('auth.profile.roles.member'), color: app_colors.green_forty}
      case 'subscriber':
        return {role: i18n.t('auth.profile.roles.subscriber'), color: app_colors.gold}
      default:
        return {role: i18n.t('auth.profile.roles.unknown'), color: app_colors.white_twenty}
    }
  }

  const handleCancelSubscription = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/cancel-subscription-at-period-end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
        },
        body: JSON.stringify({
          userId: currentUser.uid,
          subscriptionId: currentUser.subscriptionId
        })
      });

      await updateCurrentUser()

      showToast({ message: "Annulation de l'abonnement réussie", type: 'success', duration: 3000 })
    } catch (e) {
      console.log('[Auth] Error cancelling subscription:', e)
      showToast({ message: "Erreur d'annulation de l'abonnement, veuillez contacter le support", type: 'error', duration: 5000 })
      return;
    }
  }

  const handleRestoreSubscription = async () => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/restore-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
        },
        body: JSON.stringify({
          userId: currentUser.uid
        })
      });

      await updateCurrentUser()

      showToast({ message: "Renouvellement automatique de l'abonnement réactivé", type: 'success', duration: 3000 })
    } catch (e) {
      console.log('[Auth] Error restoring subscription:', e)
      showToast({ message: "Erreur de restauration de l'abonnement, veuillez contacter le support", type: 'error', duration: 5000 })
      return;
    }
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
            isProUser(currentUser) &&
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
