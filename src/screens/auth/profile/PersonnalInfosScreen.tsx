import dayjs from "dayjs"
import React, { useState, useEffect } from "react"
import { View, ScrollView, TouchableOpacity, Text, Image } from "react-native"
import SimpleButton from "../../../components/commons/buttons/SimpleButton"
import PageTitle from "../../../components/commons/PageTitle"
import InputWithIcon from "../../../components/forms/InputWithIcon"
import { useAuth } from "../../../contexts/AuthContext"
import { storageKeys, app_colors } from "../../../helpers/constants"
import { availableUserProfilePictures } from "../../../helpers/scripts/auth/availableUserProfilePicture"
import { i18n } from "../../../helpers/scripts/i18n"
import { showToast } from "../../../helpers/scripts/showToast"
import { capitalize } from "../../../helpers/scripts/utils/formatters/capitalize"
import { getData } from "../../../helpers/storage"
import { globalStyles } from "../../../styles/global"
import { personnalInfosScreenStyles } from "../../../styles/screens/auth/personnalInfosScreen"
import { profileScreenStyles } from "../../../styles/screens/auth/profile"
import DateTimePickerModal from '../../../components/commons/DateTimePickerModal';

export const PersonnalInfosScreen = ({navigation}: any) => {

  const { currentUser, updateCurrentUser } = useAuth()

  const [firstname, setFirstname] = useState<string>(currentUser.profile?.firstname || "")
  const [lastname, setLastname] = useState<string>(currentUser.profile?.lastname || "")
  const [birthday, setBirthday] = useState<string>(currentUser.profile?.birthday ? currentUser.profile.birthday : "")
  const [bio, setBio] = useState<string>(currentUser.profile?.bio || "")
  const [pseudonym, setPseudonym] = useState<string>(currentUser.profile?.pseudonym || "")
  const [activeProfilePictureId, setActiveProfilePictureId] = useState<string | null | undefined>(currentUser.profile?.profilePicture || null)

  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)


  useEffect(() => {
    console.log('[PersonnalInfosScreen] currentUser.profilePictureId:', currentUser.profile?.profilePicture);
    
    setActiveProfilePictureId(currentUser.profile?.profilePicture || null)
  }, [currentUser.profile?.profilePicture])

  const handleSavePersonnalInfos = async () => {
    console.log("Saving personnal infos...", {firstname, lastname, birthday, pseudonym, bio, activeProfilePictureId});

    const accessToken = await getData(storageKeys.auth.accessToken);

    try {
      await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/profile/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          profile: {
            firstname,
            lastname,
            birthday: birthday ? new Date(birthday) : null,
            pseudonym,
            bio,
            profilePicture: activeProfilePictureId,
          }
        })
      })

      await updateCurrentUser()

      navigation.goBack()
      showToast({ message: "Informations personnelles sauvegardées avec succès.", type: 'success', duration: 3000 });
    } catch (e) {
      console.log("[PersonnalInfosScreen] Error saving personnal infos:", e);
      showToast({ message: "Erreur lors de la sauvegarde des informations personnelles.", type: 'error', duration: 5000 });
      return;
    }
  }
  

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('auth.profile.personnalInfos.title')}
        subtitle={"Mettez à jour vos informations personnelles"}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={profileScreenStyles.content}>
          <View style={profileScreenStyles.content.section}>
            <Text style={[profileScreenStyles.content.section.title, {margin: 0}]}>Image de profil</Text>
            <Text style={profileScreenStyles.content.section.subtitle}>Sélectionnez une illustration pour votre profil utilisateur</Text>
            <View style={personnalInfosScreenStyles.profilePicturesContainer}>
              <View style={{marginBottom: 20}}>
                <TouchableOpacity onPress={() => setActiveProfilePictureId(null)} style={[personnalInfosScreenStyles.profilePicturesContainer.profilePicture, {borderColor: !activeProfilePictureId ? app_colors.yellow : app_colors.white_sixty}]}>
                  <Image style={personnalInfosScreenStyles.profilePicturesContainer.defaultIcon} source={require('../../../../assets/icons/FiUser.png')} />
                </TouchableOpacity>
                <Text style={{color: app_colors.white, textAlign: 'center', fontSize: 10}}>Aucun</Text>
              </View>
              {
                availableUserProfilePictures.map((picture) => {
                  return (
                    <View style={{marginBottom: 20}} key={picture.id}>
                      <TouchableOpacity onPress={() => setActiveProfilePictureId(picture.id)}>
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
                icon={require('../../../../assets/icons/FiUser.png')}
              />

              <InputWithIcon
                placeholder={currentUser.profile?.lastname || "Nom"}
                type="text"
                value={lastname}
                changeEvent={setLastname}
                additionalStyles={{marginVertical: 5}}
                icon={require('../../../../assets/icons/FiUser.png')}
              />

              <SimpleButton
                icon={require('../../../../assets/icons/FiCalendar.png')}
                text={capitalize(birthday) ? dayjs(birthday).format('LL') : "Date de naissance"}
                textColor={app_colors.white}
                align='flex-start'
                fullWidth
                additionalStyles={{marginVertical: 5}}
                onPress={() => setShowDatePicker(true)}
                activeBorderColor={app_colors.white_no_opacity}
                active
              />

              <DateTimePickerModal
                visible={showDatePicker}
                mode='date'
                value={birthday ? new Date(birthday) : new Date()}
                onCancel={() => setShowDatePicker(false)}
                onConfirm={(selectedDate) => {
                  setShowDatePicker(false)
                  setBirthday(selectedDate.toISOString().split('T')[0])
                }}
                minimumDate={new Date('1900-01-01')}
                maximumDate={new Date()}
              />

              <InputWithIcon
                placeholder={currentUser.profile?.pseudonym || "Pseudonyme"}
                type="text"
                value={pseudonym}
                changeEvent={setPseudonym}
                additionalStyles={{marginVertical: 5}}
                icon={require('../../../../assets/icons/FiUser.png')}
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
          
          <SimpleButton
            backgroundColor={app_colors.green_forty}
            textColor={app_colors.white}
            text="Sauvegarder les modifications"
            textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
            fullWidth
            onPress={handleSavePersonnalInfos}
            align="center"
          />
        </View>
      </ScrollView>
    </View>
  )
}