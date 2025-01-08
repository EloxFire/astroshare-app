import React from "react";
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../../styles/global";
import {useAuth} from "../../contexts/AuthContext";
import {profileScreenStyles} from "../../styles/screens/auth/profile";
import {i18n} from "../../helpers/scripts/i18n";
import PageTitle from "../../components/commons/PageTitle";
import DSOValues from "../../components/commons/DSOValues";
import dayjs from "dayjs";
import {authStyles} from "../../styles/screens/auth/auth";
import {routes} from "../../helpers/routes";
import {app_colors} from "../../helpers/constants";
import ProLocker from "../../components/cards/ProLocker";
import {isProUser} from "../../helpers/scripts/auth/checkUserRole";

export default function ProfileScreen({ navigation }: any) {

  const {currentUser, logoutUser} = useAuth()

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
            <DSOValues title={i18n.t('auth.profile.downloadedRessources')} value={currentUser?.downloadsCount}/>
            <DSOValues title={i18n.t('auth.profile.createdAt')} value={dayjs.unix(currentUser.createdAt.seconds).format("DD MMM YYYY à HH:mm").replace(':', 'h')}/>
            <DSOValues title={i18n.t('auth.profile.updatedAt')} value={dayjs.unix(currentUser.updatedAt.seconds).format("DD MMM YYYY à HH:mm").replace(':', 'h')}/>
            <DSOValues title={i18n.t('auth.profile.accountRole')} chipValue chipColor={humanizeAccountRole(currentUser.role).color} value={humanizeAccountRole(currentUser.role).role}/>
          </View>

          {
            !isProUser(currentUser) &&
            <ProLocker navigation={navigation} image={require('../../../assets/images/tools/apod.png')} darker small />
          }

          <TouchableOpacity style={profileScreenStyles.content.button} onPress={() => handleLogout()}>
            <Text style={profileScreenStyles.content.button.text}>{i18n.t('auth.profile.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
