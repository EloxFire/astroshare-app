import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { profileScreenStyles } from "./ProfileScreen.styles";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronLeft, Edit, LogOut, Notebook, Telescope, UserCog } from "lucide-react-native";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { User } from "../../types/auth/User";
import { availableUserProfilePictures, getUserProfilePicture } from "../../helpers/auth/profile/profilePictures";
import { ScreenHeader } from "../../components/layout/ScreenHeader/ScreenHeader";
import { globalStyles } from "../../helpers/globalStyles";
import InfoCard from "../../components/cards/InfoCard/InfoCard";
import ListCard from "../../components/cards/ListCard/ListCard";
import { firestoreTimestampToDate } from "../../helpers/api/firestoreTimestamp";
import { formatCompactDuration } from "../../helpers/format";
import { getTotalObservationDuration, getTotalObservedObjects } from "../../helpers/journal/sessions";
import { useUserDataStore } from "../../store/userData.store";
import IconButtonCard from "../../components/cards/IconButtonCard/IconButtonCard";
import LockedFeatureCard from "../../components/cards/LockedFeatureCard/LockedFeatureCard";
import Button from "../../components/buttons/Button/Button";
import { isProUser } from "../../helpers/auth/subscription";


const ChangePasswordButton = ({ t }: { t: any }) => {
  return (
    <TouchableOpacity style={profileScreenStyles.content.changePasswordButton} onPress={() => router.push('/auth/forgot-password')}>
      <Text style={profileScreenStyles.content.changePasswordButton.text}>{t('infos.changePassword')}</Text>
    </TouchableOpacity>
  )
}

export const ProfileScreen = () => {
  const { t } = useTranslation("auth/profile");

  const { authUser, logoutUser }: { authUser: User | null, logoutUser: () => void } = useAuth();
  const userSessions = useUserDataStore(state => state.statistics.astronomySessions);
  const subscribedUser = authUser ? isProUser(authUser) : false;

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

  const handleLogout = () => {
    // router.replace AVANT logoutUser : la navigation part immédiatement, avant que
    // logoutUser() ne vide authUser (async) — réduit la fenêtre où cet écran reste affiché
    // avec un authUser devenu null/undefined.
    router.replace('/');
    logoutUser();
  }

  // Garde-fou nécessaire : authUser passe à null pendant la déconnexion (le temps que
  // router.replace prenne effet) — sans ce early return, les `authUser!`/`authUser?.x!`
  // plus bas tentent de lire des propriétés sur null/undefined et plantent.
  if (!authUser) return null;

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader main={true} />

      <ScrollView>
        <View style={profileScreenStyles.header}>
          {/* ROUND PROFILE PICTURE */}
          <Image
            source={getUserProfilePicture(authUser)}
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
              <Text style={profileScreenStyles.content.recap.item.value}>{userSessions.length}</Text>
              <Text style={profileScreenStyles.content.recap.item.label}>{t("recap.sessions")}</Text>
            </View>

            <View style={profileScreenStyles.content.recap.separator}/>

            <View style={profileScreenStyles.content.recap.item}>
              <Text style={profileScreenStyles.content.recap.item.value}>{formatCompactDuration(getTotalObservationDuration(userSessions))}</Text>
              <Text style={profileScreenStyles.content.recap.item.label}>{t("recap.hoursObserved")}</Text>
            </View>
            
            <View style={profileScreenStyles.content.recap.separator}/>

            <View style={profileScreenStyles.content.recap.item}>
              <Text style={profileScreenStyles.content.recap.item.value}>{getTotalObservedObjects(userSessions)}</Text>
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

          <View style={{display: "flex", flexDirection: "column", gap: 5}}>
            <Text style={globalStyles.categoryTitle}>{t('infos.title')}</Text>

            <ListCard
              items={[
                {
                  title: t('infos.username'),
                  value: authUser?.profile?.pseudonym || t('infos.noUsername'),
                },
                {
                  title: t('infos.firstname'),
                  value: authUser?.profile?.firstname || t('infos.noFirstname'),
                },
                {
                  title: t('infos.lastname'),
                  value: authUser?.profile?.lastname || t('infos.noLastname'),
                },
                {
                  title: t('infos.email'),
                  value: authUser?.email,
                },
                {
                  title: t('infos.password'),
                  value: ChangePasswordButton({ t }),
                }
              ]}
            />
          </View>

          <View style={{display: "flex", flexDirection: "column", gap: 5}}>
            <Text style={globalStyles.categoryTitle}>{t('infos.timestamps.title')}</Text>
            <ListCard
              items={[
                {
                  title: t('infos.timestamps.createdAt'),
                  value:  firestoreTimestampToDate(authUser.createdAt).toLocaleDateString(),
                },
                {
                  title: t('infos.timestamps.updatedAt'),
                  value:  firestoreTimestampToDate(authUser.updatedAt).toLocaleDateString(),
                }
              ]}
            />
          </View>

          <View style={{display: "flex", flexDirection: "column", gap: 5}}>
            <Text style={globalStyles.categoryTitle}>{t('infos.subscription.title')}</Text>

            {subscribedUser && authUser.subscription ? (
              <ListCard
                items={[
                  {
                    title: t('infos.subscription.type'),
                    value: t('infos.subscription.subscribed'),
                  },
                  {
                    title: t('infos.subscription.status'),
                    // Clé dynamique par statut réel (voir Subscription.ts : active/canceled/expired/
                    // past_due/unknown) plutôt qu'un simple booléen abonné/pas abonné — repli sur
                    // "unknown" si l'API renvoie une valeur pas encore traduite ici.
                    value: t(`infos.subscription.statusValues.${authUser.subscription.status}`, { defaultValue: t('infos.subscription.statusValues.unknown') }),
                  },
                  ...(authUser.subscription.current_period_end ? [{
                    title: t('infos.subscription.nextPayment'),
                    value: new Date(authUser.subscription.current_period_end).toLocaleDateString(),
                  }] : []),
                  // Annuler n'a de sens que pour un abonnement encore actif.
                  ...(authUser.subscription.status === 'active' ? [{
                    title: t('infos.subscription.cancelSubscription'),
                    value: <Button label={t('infos.subscription.cancelSubscription')} variant="danger" onPress={() => { /* TODO : Annuler l'abonnement */ }} />,
                  }] : []),
                ]}
              />
            ) : (
              <LockedFeatureCard
                title={t('infos.subscription.locked.title')}
                description={t('infos.subscription.locked.description')}
                ctaLabel={t('infos.subscription.locked.cta')}
                // Pas encore d'écran PRO/abonnement dans l'app (voir le TODO équivalent dans
                // SatellitesScreen/SpaceWeatherScreen) : le bouton n'a pas encore de destination.
                onPressCta={() => {}}
              />
            )}
          </View>


          <IconButtonCard
            icon={Notebook}
            title={t('journal.title')}
            subtitle={t('journal.description')}
            onPress={() => router.push('/tools/journal')}
          />

          <IconButtonCard
            icon={Telescope}
            title={t('observations.title')}
            subtitle={t('observations.description')}
            onPress={() => router.push('/tools/observations')}
          />

          {/* TODO : Link to new form screen to update account infos */}
          <Button label={t('edit')} icon={UserCog} />
          <Button label={t('logout')} icon={LogOut} variant="danger" onPress={() => handleLogout()} />
        </View>
      </ScrollView>
    </View>
  );
};
