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

export default function ProfileScreen({ navigation }: any) {

  const {currentUser, logoutUser} = useAuth()

  const handleLogout = async () => {
    await logoutUser()
    navigation.push(routes.home.path)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('auth.profile.title')}
        subtitle={i18n.t('auth.profile.subtitle')}
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
          <DSOValues title={i18n.t('auth.profile.downloadedRessources')} value={currentUser?.downloadsCount}/>
          <DSOValues title={i18n.t('auth.profile.createdAt')} value={dayjs.unix(currentUser.createdAt.seconds).format("DD MMM YYYY à HH:mm").replace(':', 'h')}/>
          <DSOValues title={i18n.t('auth.profile.updatedAt')} value={dayjs.unix(currentUser.updatedAt.seconds).format("DD MMM YYYY à HH:mm").replace(':', 'h')}/>

          <TouchableOpacity style={profileScreenStyles.content.button} onPress={() => handleLogout()}>
            <Text style={profileScreenStyles.content.button.text}>{i18n.t('auth.profile.logout')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
