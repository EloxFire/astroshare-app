import { Image, ImageBackground, Text, TouchableOpacity, View } from "react-native"
import { app_colors } from "../../helpers/constants"
import { i18n } from "../../helpers/scripts/i18n"
import { profileScreenStyles } from "../../styles/screens/auth/profile"
import SimpleButton from "../commons/buttons/SimpleButton"
import { useAuth } from "../../contexts/AuthContext"
import SimpleBadge from "../badges/SimpleBadge"
import { availableUserProfilePictures } from "../../helpers/scripts/auth/availableUserProfilePicture"
import { personnalInfosScreenStyles } from "../../styles/screens/auth/personnalInfosScreen"

export const AccountInfosCard = ({navigation}: any) => {

  const { currentUser } = useAuth()

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
  
  return (
    <View style={profileScreenStyles.content.section}>
      <View style={profileScreenStyles.content.accountCard}>
        {
          (currentUser.profile && currentUser.profile.profilePicture) ?
            <ImageBackground source={availableUserProfilePictures.find(picture => picture.id === currentUser.profile.profilePicture)?.source} style={profileScreenStyles.content.accountCard.pictureContainer} resizeMode="cover" imageStyle={profileScreenStyles.content.accountCard.pictureContainer.picture}/>
            :
            <View style={[personnalInfosScreenStyles.profilePicturesContainer.profilePicture, {borderColor: app_colors.white_sixty}]}>
              <Image style={personnalInfosScreenStyles.profilePicturesContainer.defaultIcon} source={require('../../../assets/icons/FiUser.png')} />
            </View>

        }
        <View style={profileScreenStyles.content.accountCard.userInfos}>
          <View>
            {
              (currentUser.profile?.firstname && currentUser.profile?.lastname) ? (
                <Text style={profileScreenStyles.content.accountCard.userInfos.name}>{currentUser.profile.firstname} {currentUser.profile.lastname}</Text>
              ) : (
                <Text style={profileScreenStyles.content.accountCard.userInfos.name}>Bienvenue,</Text>
              )
            }
            <Text style={profileScreenStyles.content.accountCard.userInfos.mail}>{currentUser.email}</Text>
          </View>
          <SimpleBadge text={humanizeAccountRole(currentUser.role).role} backgroundColor={humanizeAccountRole(currentUser.role).color} small />
        </View>
      </View>
    </View>
  )
}