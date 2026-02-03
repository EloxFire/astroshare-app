import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import ProLocker from "../../components/cards/ProLocker"
import SimpleButton from "../../components/commons/buttons/SimpleButton"
import PageTitle from "../../components/commons/PageTitle"
import { AccountInfosCard } from "../../components/profile/AccountInfosCard"
import { DataAndSubscriptionCard } from "../../components/profile/dataAndSubscription/DataAndSubscriptionCard"
import { PersonnalInfosCard } from "../../components/profile/personnalInfos/PersonnalInfosCard"
import { app_colors } from "../../helpers/constants"
import { routes } from "../../helpers/routes"
import { isProUser } from "../../helpers/scripts/auth/checkUserRole"
import { i18n } from "../../helpers/scripts/i18n"
import { globalStyles } from "../../styles/global"
import { profileScreenStyles } from "../../styles/screens/auth/profile"
import { availableUserProfilePictures } from "../../helpers/scripts/auth/availableUserProfilePicture"
import { personnalInfosScreenStyles } from "../../styles/screens/auth/personnalInfosScreen"
import { useAuth } from "../../contexts/AuthContext"
import { useEffect, useState } from "react"
import InputWithIcon from "../../components/forms/InputWithIcon"
import DateTimePicker from '@react-native-community/datetimepicker';
import dayjs from "dayjs"
import { capitalize } from "../../helpers/scripts/utils/formatters/capitalize"

export const PersonnalInfosScreen = ({navigation}: any) => {

  const { currentUser } = useAuth()

  const [firstname, setFirstname] = useState<string>(currentUser.profile?.firstname || "")
  const [lastname, setLastname] = useState<string>(currentUser.profile?.lastname || "")
  const [birthday, setBirthday] = useState<string>(currentUser.profile?.birthday ? currentUser.profile.birthday.toISOString().split('T')[0] : "")
  const [bio, setBio] = useState<string>(currentUser.profile?.bio || "")
  const [pseudonym, setPseudonym] = useState<string>(currentUser.profile?.pseudonym || "")

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)


  const [activeProfilePictureId, setActiveProfilePictureId] = useState<string | null | undefined>(currentUser.profile?.profilePicture || null)
  useEffect(() => {
    console.log('[PersonnalInfosScreen] currentUser.profilePictureId:', currentUser.profile?.profilePicture);
    
    setActiveProfilePictureId(currentUser.profile?.profilePicture || null)
  }, [currentUser.profile?.profilePicture])
  

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('auth.profile.personnalInfos.title')}
        subtitle={i18n.t('auth.profile.personnalInfos.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={profileScreenStyles.content}>
          <View style={profileScreenStyles.content.section}>
            <Text style={[profileScreenStyles.content.section.title, {margin: 0}]}>Image de profil</Text>
            <Text style={profileScreenStyles.content.section.subtitle}>Sélectionnez une illustration pour votre profil utilisateur</Text>
            <View style={personnalInfosScreenStyles.profilePicturesContainer}>
              <View style={{marginBottom: 20}}>
                <TouchableOpacity style={[personnalInfosScreenStyles.profilePicturesContainer.profilePicture, {borderColor: !activeProfilePictureId ? app_colors.white_sixty : app_colors.yellow}]}>
                  <Image style={personnalInfosScreenStyles.profilePicturesContainer.defaultIcon} source={require('../../../assets/icons/FiUser.png')} />
                </TouchableOpacity>
                <Text style={{color: app_colors.white, textAlign: 'center', fontSize: 10}}>Aucun</Text>
              </View>
              {
                availableUserProfilePictures.map((picture) => {
                  return (
                    <View style={{marginBottom: 20}} key={picture.id}>
                      <TouchableOpacity>
                        <Image style={[personnalInfosScreenStyles.profilePicturesContainer.profilePicture, {borderColor: activeProfilePictureId === picture.id ? app_colors.yellow : app_colors.white_sixty}]} source={picture.source} />
                      </TouchableOpacity>
                      <Text style={{color: app_colors.white, textAlign: 'center', fontSize: 10}}>{picture.name}</Text>
                    </View>
                  )
                })
              }
            </View>
          </View>

          <View style={profileScreenStyles.content.section}>
            <Text style={[profileScreenStyles.content.section.title, {margin: 0}]}>Informations supplémentaires</Text>
            <Text style={profileScreenStyles.content.section.subtitle}>Ajoutez des informations supplémentaires à votre profil utilisateur</Text>

            <View>
              <InputWithIcon
                placeholder={currentUser.profile?.firstname || "Prénom"}
                type="text"
                value={firstname}
                changeEvent={setFirstname}
                additionalStyles={{marginVertical: 5}}
                icon={require('../../../assets/icons/FiUser.png')}
              />

              <InputWithIcon
                placeholder={currentUser.profile?.lastname || "Nom"}
                type="text"
                value={lastname}
                changeEvent={setLastname}
                additionalStyles={{marginVertical: 5}}
                icon={require('../../../assets/icons/FiUser.png')}
              />

              <SimpleButton
                icon={require('../../../assets/icons/FiCalendar.png')}
                text={capitalize(birthday) ? dayjs(birthday).format('LL') : "Date de naissance"}
                textColor={app_colors.white}
                align='flex-start'
                fullWidth
                additionalStyles={{marginVertical: 5}}
                onPress={() => setShowDatePicker(true)}
                activeBorderColor={app_colors.white_no_opacity}
                active
              />

              {
                showDatePicker && (
                  <DateTimePicker
                    maximumDate={new Date()}
                    value={ birthday ? new Date(birthday) : new Date() }
                    mode='date'
                    display='default'
                    themeVariant={'dark'}
                    onChange={(event, selectedDate) => {
                      if (event.type === 'dismissed') {
                        setShowDatePicker(false)
                      }
                      if (event.type === 'set' && selectedDate) {
                        console.log("Setting end date:", selectedDate);
                        
                        setShowDatePicker(false)
                        setBirthday(selectedDate.toISOString().split('T')[0])
                      }
                    }}
                  />
                )
              }

              <InputWithIcon
                placeholder={currentUser.profile?.pseudonym || "Pseudonyme"}
                type="text"
                value={pseudonym}
                changeEvent={setPseudonym}
                additionalStyles={{marginVertical: 5}}
              />

              <InputWithIcon
                placeholder={currentUser.profile?.bio || "Bio"}
                type="text"
                value={bio}
                changeEvent={setBio}
                additionalStyles={{marginVertical: 5}}
              />
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}