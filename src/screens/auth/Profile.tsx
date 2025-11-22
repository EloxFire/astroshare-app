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

export default function ProfileScreen({ navigation }: any) {

  const {currentUser, logoutUser, updateCurrentUser} = useAuth()

  const handleLogout = async () => {
    await logoutUser()
    navigation.push(routes.home.path)
  }

  const humanizeAccountRole = (role: string) => {
    switch (role) {
      case 'admin':
        return {role: i18n.t('auth.profile.roles.admin'), color: app_colors.red_forty}
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
          <View style={profileScreenStyles.content.header}>
            <View style={profileScreenStyles.content.header.fakePicture}>
              <Image source={require('../../../assets/icons/FiUser.png')} style={profileScreenStyles.content.header.fakePicture.icon} />
            </View>
            <View style={profileScreenStyles.content.header.infos}>
              <Text style={profileScreenStyles.content.header.infos.title}>{i18n.t('auth.profile.welcome')}</Text>
              <Text style={profileScreenStyles.content.header.infos.mail}>{currentUser?.displayName || currentUser?.email}</Text>
            </View>
          </View>

          <View style={profileScreenStyles.content.body}>
            <DSOValues title={i18n.t('auth.profile.downloadedResources')} value={currentUser?.downloadsCount}/>
            <DSOValues title={i18n.t('auth.profile.createdAt')} value={dayjs.unix(currentUser.createdAt.seconds).format("DD MMM YYYY à HH:mm").replace(':', 'h')}/>
            <DSOValues title={i18n.t('auth.profile.updatedAt')} value={dayjs.unix(currentUser.updatedAt.seconds).format("DD MMM YYYY à HH:mm").replace(':', 'h')}/>
            <DSOValues title={i18n.t('auth.profile.accountRole')} chipValue chipColor={humanizeAccountRole(currentUser.role).color} value={humanizeAccountRole(currentUser.role).role}/>
            {
              isProUser(currentUser) &&
                <>
                  <View style={{backgroundColor: app_colors.white_twenty, height: 1, width: Dimensions.get("window").width - 20, marginVertical: 10}}/>
                  <DSOValues title={i18n.t('auth.profile.subscriptionName')} value={`Astroshare Pro - ${i18n.t(`auth.profile.subscriptionTypes.${currentUser.subscriptionCategory}`)}`}/>
                  <DSOValues title={i18n.t('auth.profile.subscriptionType')} value={i18n.t(`auth.profile.subscriptionTypes.${currentUser.subscriptionType}`)}/>
                  <DSOValues title={i18n.t('auth.profile.subscriptionDate')} value={dayjs.unix(currentUser.subscriptionDate.seconds).format("DD MMMM YYYY")}/>
                  <DSOValues title={i18n.t('auth.profile.subscriptionRenewal')} value={dayjs.unix(currentUser.subscriptionRenewal.seconds).format("DD MMMM YYYY")}/>
                  <DSOValues title={i18n.t('auth.profile.subscriptionTypes.renewal')} chipValue chipColor={currentUser.hasCancelledSubscription ? app_colors.red_forty : app_colors.green_forty} value={currentUser.hasCancelledSubscription ? i18n.t('auth.profile.subscriptionTypes.renewalTypes.canceled') : i18n.t('auth.profile.subscriptionTypes.renewalTypes.auto')}/>
                  {
                    currentUser.subscriptionCancelledAt &&
                    <DSOValues title={i18n.t('auth.profile.subscriptionCancellationDate')} value={dayjs.unix(currentUser.subscriptionCancelledAt.seconds).format("DD MMMM YYYY à HH:mm").replace(':', 'h')}/>
                  }
                </>
            }
          </View>

          <View style={{marginBottom: 20}}>
            {
              !isProUser(currentUser) &&
                <ProLocker id={routes.auth.profile.path} navigation={navigation} image={require('../../../assets/images/tools/apod.png')} darker small />
            }
          </View>

          <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
            <SimpleButton
              fullWidth
              icon={require('../../../assets/icons/FiLogout.png')}
              align={'center'}
              iconColor={app_colors.red_eighty}
              textAdditionalStyles={{color: app_colors.red_eighty, fontFamily: 'GilroyBlack', textTransform: 'uppercase', fontSize: 16}}
              text={i18n.t('auth.profile.logout')}
              onPress={handleLogout}
            />

            {
              isProUser(currentUser) && !currentUser.hasCancelledSubscription &&
                <SimpleButton
                    fullWidth
                    icon={require('../../../assets/icons/FiXCircle.png')}
                    align={'center'}
                    iconColor={app_colors.red_eighty}
                    textAdditionalStyles={{color: app_colors.red_eighty, fontFamily: 'GilroyBlack', textTransform: 'uppercase', fontSize: 16}}
                    text={i18n.t('auth.profile.cancelSubscription')}
                    onPress={handleCancelSubscription}
                />
            }

            {
              isProUser(currentUser) && currentUser.hasCancelledSubscription &&
                <SimpleButton
                    fullWidth
                    icon={require('../../../assets/icons/FiHeartFill.png')}
                    align={'center'}
                    iconColor={app_colors.white}
                    textAdditionalStyles={{color: app_colors.white, fontFamily: 'GilroyBlack', textTransform: 'uppercase', fontSize: 16}}
                    text={i18n.t('auth.profile.restoreSubscription')}
                    onPress={handleRestoreSubscription}
                />
            }
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
