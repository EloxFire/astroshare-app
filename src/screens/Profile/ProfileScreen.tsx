import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { profileScreenStyles } from "./ProfileScreen.styles";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Edit, Notebook, UserCog } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../types/auth/User";
import { availableUserProfilePictures } from "../../helpers/auth/profile/profilePictures";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { globalStyles } from "../../helpers/globalStyles";
import InfoCard from "../../components/cards/InfoCard/InfoCard";
import ListCard from "../../components/cards/ListCard/ListCard";

export const ProfileScreen = () => {

  const { authUser }: { authUser: User | null } = useAuth();
  const { t } = useTranslation("auth/profile");

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
    <View style={globalStyles.screen}>
      <ScreenHeader main={true} />
      <View style={profileScreenStyles.header}>
        {/* ROUND PROFILE PICTURE */}
        <Image
          source={getUserProfilePicture()}
          style={profileScreenStyles.header.profilePicture}
        />

        <Text style={profileScreenStyles.header.name}>{getNameToDisplay()}</Text>
        <View style={profileScreenStyles.header.subInfos}>
          {authUser && authUser.profile && authUser.profile.pseudonym && <Text style={profileScreenStyles.header.subInfos.subInfo}>@{authUser.profile.pseudonym}</Text>}
        </View>
      </View>

      <View style={globalStyles.content}>
        <View style={profileScreenStyles.content.recap}>
          <View style={profileScreenStyles.content.recap.item}>
            <Text style={profileScreenStyles.content.recap.item.value}>0</Text>
            <Text style={profileScreenStyles.content.recap.item.label}>{t("recap.sessions")}</Text>
          </View>

          <View style={profileScreenStyles.content.recap.separator}/>

          <View style={profileScreenStyles.content.recap.item}>
            <Text style={profileScreenStyles.content.recap.item.value}>0 h</Text>
            <Text style={profileScreenStyles.content.recap.item.label}>{t("recap.hoursObserved")}</Text>
          </View>
          
          <View style={profileScreenStyles.content.recap.separator}/>

          <View style={profileScreenStyles.content.recap.item}>
            <Text style={profileScreenStyles.content.recap.item.value}>0</Text>
            <Text style={profileScreenStyles.content.recap.item.label}>{t("recap.objectsObserved")}</Text>
          </View>
        </View>

        <View style={profileScreenStyles.content.bio}>
          <Text style={profileScreenStyles.content.bio.title}>{t('bio.title')}</Text>
          {
            authUser && authUser.profile && authUser.profile.bio ? (
              <Text style={profileScreenStyles.content.bio.text}>{authUser.profile.bio}</Text>
            ) : (
              <Text style={profileScreenStyles.content.bio.text}>{t('bio.noBio')}</Text>
            )
          }
        </View>

        <ListCard
          items={[
            {
              title: t('infos.timestamps.createdAt'),
              value:  "",
            }
          ]}
        />

        <Text>{JSON.stringify(authUser, null, 2)}</Text>

        <InfoCard
          icon={Notebook}
          title={t('journal.title')}
          description={t('journal.description')}
          link={'profile/session'}
          variant="light"
        />

        <TouchableOpacity style={profileScreenStyles.content.editButton}>
          <UserCog size={20} color={app_colors.white} />
          <Text style={profileScreenStyles.content.editButton.text}>{t('edit')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
