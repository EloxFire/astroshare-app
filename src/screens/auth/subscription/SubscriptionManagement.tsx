import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { globalStyles } from "../../../styles/global"
import { useSettings } from "../../../contexts/AppSettingsContext";
import { useAuth } from "../../../contexts/AuthContext";
import { useTranslation } from "../../../hooks/useTranslation";
import { useEffect, useState } from "react";
import { sendAnalyticsEvent } from "../../../helpers/scripts/analytics";
import { eventTypes } from "../../../helpers/constants/analytics";
import { i18n } from "../../../helpers/scripts/i18n";
import PageTitle from "../../../components/commons/PageTitle";
import { app_colors, storageKeys } from "../../../helpers/constants";
import { getData } from "../../../helpers/storage";
import { subscriptionManagementStyles } from "../../../styles/screens/profile/subscription/subscriptionManagement";
import { SubscriptionCard } from "../../../components/cards/subscriptions/SubscriptionCard";
import ScreenInfo from "../../../components/ScreenInfo";
import ProLocker from "../../../components/cards/ProLocker";
import { routes } from "../../../helpers/routes";
import { useIsFocused } from "@react-navigation/native";
import { getSubscriptionStatus } from "../../../helpers/api/revenuecat/getSubscriptionStatus";
import { openStoreSubscriptionSettings } from "../../../helpers/api/revenuecat/openStoreSubscriptionSettings";
import SimpleButton from "../../../components/commons/buttons/SimpleButton";

export const SubscriptionManagement = ({ navigation } : any) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const isFocused = useIsFocused()

  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isPro, setIsPro] = useState<boolean>(false)

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'subscription_management_screen_view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  useEffect(() => {
    if (!isFocused) {
      return
    }

    retrieveCurrentSubscription()
    getSubscriptionStatus().then(setIsPro)
  }, [isFocused])

  const retrieveCurrentSubscription = async () => {
    const accessToken = await getData(storageKeys.auth.accessToken)
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/subscriptions/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    const data = await response.json()
    console.log('Current subscription data:', data.subscriptions)

    setPayments(data.payments)
    setSubscriptions(data.subscriptions)
    setLoading(false)
  }

  const handleManageSubscription = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'manage_subscription_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)
    openStoreSubscriptionSettings()
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.title')}
        subtitle={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={globalStyles.content}>
          {
            isPro && (
              <View style={subscriptionManagementStyles.section}>
                <Text style={subscriptionManagementStyles.section.title}>Abonnement actif</Text>
                <View style={subscriptionManagementStyles.section.body}>
                  <Text style={subscriptionManagementStyles.section.text}>
                    Votre abonnement Astroshare PRO est actif. Vous pouvez gérer son renouvellement ou son mode de paiement directement depuis les réglages de votre store.
                  </Text>
                  <SimpleButton
                    text="Gérer mon abonnement"
                    icon={require('../../../../assets/icons/FiCreditCard.png')}
                    backgroundColor={app_colors.white}
                    textColor={app_colors.black}
                    iconColor={app_colors.black}
                    fullWidth
                    align="flex-start"
                    onPress={handleManageSubscription}
                  />
                </View>
              </View>
            )
          }

          <View style={subscriptionManagementStyles.section}>
            <Text style={subscriptionManagementStyles.section.title}>Vos abonnements Astroshare PRO</Text>
            <View style={subscriptionManagementStyles.section.body}>
            {
              loading && (
                <ActivityIndicator size="large" color={app_colors.white} />
              )
            }
            {
              !loading && subscriptions.length === 0 && (
                <Text style={subscriptionManagementStyles.section.text}>Vous n'avez aucun abonnement actif ou passé.</Text>
              )
            }
            {
              !loading && subscriptions.length > 0 && subscriptions.map((subscription: any, index: number) => {
                return (
                  <SubscriptionCard key={index} type={subscription.object} payment={subscription} navigation={navigation} />
                )
              })
            }
            </View>
          </View>

          <View style={subscriptionManagementStyles.section}>
            <Text style={subscriptionManagementStyles.section.title}>Vos derniers paiements</Text>
            <View style={subscriptionManagementStyles.section.body}>
            {
              loading && (
                <ActivityIndicator size="large" color={app_colors.white} />
              )
            }
            {
              !loading && payments.length === 0 && (
                <Text style={subscriptionManagementStyles.section.text}>Vous n'avez aucun paiement actif ou passé.</Text>
              )
            }
            {
              !loading && payments.length > 0 && payments.map((payment: any, index: number) => {
                return (
                  <SubscriptionCard key={index} type={payment.object} payment={payment} navigation={navigation} />
                )
              })
            }
            </View>
          </View>

          {
            !loading && !isPro && subscriptions.length === 0 && payments.length === 0 && (
              <ProLocker id={routes.auth.profile.subscriptionManagement.home.path} navigation={navigation} image={require('../../../../assets/images/tools/apod.png')} darker small />
            )
          }

          {/* <Text style={subscriptionManagementStyles.section.text}>{JSON.stringify(subscriptions[0], null, 8)}</Text> */}

          <ScreenInfo
            image={require('../../../../assets/icons/FiFileText.png')}
            text="Consultez l'historique de vos paiements, téléchargez vos factures et gérez votre abonnement simplement !"
          />
        </View>
      </ScrollView>
    </View>
  )
}
