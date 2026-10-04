import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { profileScreenStyles } from "./ProfileScreen.styles";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Edit } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../types/auth/User";
import { availableUserProfilePictures } from "../../helpers/auth/profile/profilePictures";

export const ProfileScreen = () => {

  const { authUser }: { authUser: User | null } = useAuth();
  const { t } = useTranslation();

  const getUserProfilePicture = () => {
    if(authUser && authUser.profile &&  authUser.profile?.profilePicture){
      return availableUserProfilePictures.find(picture => picture.id === authUser?.profile?.profilePicture)?.source || require('../../../assets/images/placeholders/no-picture.png');
    }
  }

  const getNameToDisplay = () => {
    if(authUser){
      if(authUser.profile && authUser.profile.firstname && authUser.profile.lastname){
        return `${authUser.profile.firstname} ${authUser.profile.lastname}`;
      } else if (authUser.profile && authUser.profile.pseudonym){
        return authUser.profile.pseudonym;
      } else {
        return authUser.email
      }
    }else{
      return null;
    }
  }

  return (
    <ScrollView>
      <View style={profileScreenStyles.screen}>
        <SafeAreaView style={profileScreenStyles.header}>
          <View style={profileScreenStyles.header.navigation}>
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={24} color={app_colors.white} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.back()}>
              <Edit size={20} color={app_colors.white} />
            </TouchableOpacity>
          </View>

          <View style={profileScreenStyles.header.content}>
            {/* ROUND PROFILE PICTURE */}
            <Image
              source={getUserProfilePicture()}
              style={profileScreenStyles.header.content.profilePicture}
            />
            <Text style={profileScreenStyles.header.content.name}>{getNameToDisplay()}</Text>
            <View style={profileScreenStyles.header.content.subInfos}>
              {authUser && authUser.profile && authUser.profile.pseudonym && <Text style={profileScreenStyles.header.content.subInfos.subInfo}>@{authUser.profile.pseudonym}</Text>}
              {/* {authUser && authUser.role === UserRoles.SUBSCRIBER && <Text style={profileScreenStyles.header.content.subInfos.subInfo}>{t("profile.role.subscriber")}</Text>} */}
            </View>
          </View>
        </SafeAreaView>

        <View style={profileScreenStyles.content}>
          <Text>{getNameToDisplay()}</Text>
          <Text>{JSON.stringify(authUser, null, 2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};
