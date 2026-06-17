import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { ActivityIndicator, Linking, ScrollView, Text, View } from "react-native"
import { PaymentIcon } from "react-native-payment-card-icons"
import { getStatusBackgroundColor } from "../../../helpers/api/stripe/getStripeStatusColors"
import { updatePaymentMethod } from "../../../helpers/api/stripe/updatePaymentMethod"
import { app_colors } from "../../../helpers/constants"
import { eventTypes } from "../../../helpers/constants/analytics"
import { sendAnalyticsEvent } from "../../../helpers/scripts/analytics"
import { i18n } from "../../../helpers/scripts/i18n"
import { useSettings } from "../../../contexts/AppSettingsContext"
import { useAuth } from "../../../contexts/AuthContext"
import { useTranslation } from "../../../hooks/useTranslation"
import { globalStyles } from "../../../styles/global"
import { subscriptionDetailsStyles } from "../../../styles/screens/profile/subscription/subscriptionDetails"
import { subscriptionManagementStyles } from "../../../styles/screens/profile/subscription/subscriptionManagement"
import SimpleBadge from "../../../components/badges/SimpleBadge"
import SimpleButton from "../../../components/commons/buttons/SimpleButton"
import DSOValues from "../../../components/commons/DSOValues"
import PageTitle from "../../../components/commons/PageTitle"
import { updateSubscriptionAutoRenew } from "../../../helpers/api/stripe/updateSubscriptionAutoRenew"

export const SubscriptionDetails = ({ navigation, route }: any) => {

  const { object } = route.params
  const { currentUserLocation } = useSettings()
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'subscription_details_screen_view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  useEffect(() => {
    setSubscription(object)
  }, [object])

  const updateCard = async () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'update_payment_method_clicked', eventTypes.BUTTON_CLICK, {}, currentLocale)
    const portalUrl = await updatePaymentMethod()
    if (portalUrl) {
      Linking.openURL(portalUrl);
    } else {
      console.error('Failed to retrieve the customer portal URL');
    }
  }

  const updateRenewal = async () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'toggle_subscription_renewal_clicked', eventTypes.BUTTON_CLICK, {cancel_at_period_end: subscription?.cancel_at_period_end}, currentLocale)
    const updatedSub = await updateSubscriptionAutoRenew()
    setSubscription(null)
    setSubscription(updatedSub)
  }

  if (!subscription) {
    return (
      <View style={globalStyles.body}>
        <PageTitle
          navigation={navigation}
          title={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.subscriptionDetails.title')}
          subtitle={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.subscriptionDetails.subtitle')}
        />
        <View style={globalStyles.screens.separator} />
        <ActivityIndicator size="large" color={app_colors.white} style={{ marginTop: 50 }} />
      </View>
    )
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.subscriptionDetails.title')}
        subtitle={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.subscriptionDetails.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={[globalStyles.content, {gap: 0}]}>
          <View style={globalStyles.globalContainer}>
            <View style={[globalStyles.row, {justifyContent: 'space-between', marginBottom: subscription.cancel_at_period_end ? 5 : 20}]}>
              <Text style={subscriptionDetailsStyles.title}>{i18n.t(`common.subscriptionPeriod.${subscription.items.data[0].plan.nickname}`)}</Text>
              <SimpleBadge
                text={i18n.t('common.paymentStatus.' + subscription.status)}
                backgroundColor={getStatusBackgroundColor(subscription.status).background}
                foregroundColor={getStatusBackgroundColor(subscription.status).foreground}
              />
            </View>
            {
              subscription.cancel_at_period_end && (
                <View style={[globalStyles.row, {justifyContent: 'space-between', marginBottom: 10}]}>
                  <SimpleBadge
                    text={i18n.t('common.paymentStatus.' + subscription.cancellation_details.reason)}
                    backgroundColor={app_colors.orange_eighty}
                    foregroundColor={app_colors.white}
                  />
                </View>
              )
            }

            <DSOValues
              title="Débuté le"
              value={dayjs(subscription.current_period_start * 1000).format('DD/MM/YY')}
            />
            {
              subscription.canceled_at && (
                <DSOValues
                  title="Résilié le"
                  value={dayjs(subscription.canceled_at * 1000).format('DD/MM/YY')}
                />
              )
            }
            <DSOValues
              title="Prochaine facture"
              value={subscription.canceled_at ? 'Aucune' : `${subscription.items.data[0].plan.amount / 100}€ le ${dayjs(subscription.current_period_end * 1000).format('DD MMMM YYYY')}`}
            />
            <DSOValues
              title="Fin de la période actuelle"
              value={`${dayjs(subscription.current_period_end * 1000).format('DD MMMM YYYY')}`}
            />
            <DSOValues
              title="Renouvellement automatique"
              value={subscription.canceled_at ? 'Non' : (subscription.cancel_at_period_end ? 'Non' : 'Oui')}
            />
          </View>

          <View style={[globalStyles.globalContainer, {display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start'}]}>
            <Text style={subscriptionManagementStyles.section.title}>Moyen de paiement</Text>

            <View style={globalStyles.row}>
              <PaymentIcon type={'security-code-front'} variant="flatRounded" width={120} height={100} />
              <View style={{ marginLeft: 20 }}>
                <Text style={subscriptionDetailsStyles.payment.brand}>{subscription.default_payment_method?.card?.brand || 'Carte de crédit'}</Text>
                <Text style={{ color: app_colors.white, fontSize: 14, fontFamily: 'DMMonoRegular' as 'DMMonoRegular' }}>**** **** **** {subscription.default_payment_method?.card?.last4 || '****'}</Text>
                <Text style={{ color: app_colors.white, fontSize: 14, fontFamily: 'DMMonoRegular' as 'DMMonoRegular' }}>Exp : {subscription.default_payment_method?.card?.exp_month || '**'}/{subscription.default_payment_method?.card?.exp_year || '**'}</Text>
              </View>
            </View>
            <SimpleButton
              text="Modifier le moyen de paiement"
              icon={require('../../../../assets/icons/FiCreditCard.png')}
              backgroundColor={app_colors.white}
              textColor={app_colors.black}
              iconColor={app_colors.black}
              fullWidth
              align="flex-start"
              disabled={subscription.canceled_at}
              onPress={() => updateCard()}
            />
          </View>


          <View style={[globalStyles.globalContainer, {display: 'flex', flexDirection: 'column', gap: 10}]}>
            <Text style={subscriptionManagementStyles.section.title}>Actions</Text>

            {
              !subscription.canceled_at && (
                <SimpleButton
                  text="Désactiver le renouvellement automatique"
                  icon={require('../../../../assets/icons/FiXCircle.png')}
                  backgroundColor={app_colors.red_eighty}
                  textColor={app_colors.white}
                  iconColor={app_colors.white}
                  fullWidth
                  align="flex-start"
                  disabled={subscription.canceled_at}
                  onPress={() => updateRenewal()}
                />
              )
            }

            {
              subscription.canceled_at && new Date(subscription.current_period_end * 1000) > new Date() && subscription.status !== 'canceled' && (
                <SimpleButton
                  text="Réactiver l'abonnement"
                  icon={require('../../../../assets/icons/FiZap.png')}
                  backgroundColor={app_colors.green_eighty}
                  textColor={app_colors.white}
                  iconColor={app_colors.white}
                  fullWidth
                  align="flex-start"
                  disabled={!subscription.canceled_at}
                  onPress={() => updateRenewal()}
                />
              )
            }

            {(subscription.canceled_at && new Date(subscription.current_period_end * 1000) <= new Date()) || subscription.status === 'canceled' && (
              <>
                <Text style={{ color: app_colors.white, fontSize: 14, fontFamily: 'DMMonoRegular' as 'DMMonoRegular' }}>Aucune action possible (abonnement résilié). Pour plus d'aide contactez le support Astroshare.</Text>
                <Text style={{ color: app_colors.white, fontSize: 14, fontFamily: 'DMMonoRegular' as 'DMMonoRegular', textAlign: 'center' }}>contact@astroshare.fr</Text>
              </>
            )}
          </View>


          {/* <Text style={subscriptionManagementStyles.section.text}>{JSON.stringify(subscription, null, 8)}</Text> */}
        </View>
      </ScrollView>
    </View>
  )
}