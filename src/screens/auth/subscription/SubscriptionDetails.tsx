import { View, ScrollView, Text, Linking } from "react-native"
import PageTitle from "../../../components/commons/PageTitle"
import { i18n } from "../../../helpers/scripts/i18n"
import { globalStyles } from "../../../styles/global"
import { subscriptionDetailsStyles } from "../../../styles/screens/profile/subscription/subscriptionDetails"
import SimpleBadge from "../../../components/badges/SimpleBadge"
import { subscriptionManagementStyles } from "../../../styles/screens/profile/subscription/subscriptionManagement"
import { getStatusBackgroundColor } from "../../../helpers/api/stripe/getStripeStatusColors"
import DSOValues from "../../../components/commons/DSOValues"
import dayjs from "dayjs"
import { PaymentIcon } from "react-native-payment-card-icons"
import { app_colors } from "../../../helpers/constants"
import SimpleButton from "../../../components/commons/buttons/SimpleButton"
import { updatePaymentMethod } from "../../../helpers/api/stripe/updatePaymentMethod"

export const SubscriptionDetails = ({ navigation, route }: any) => {

  const { subscription } = route.params

  const updateCard = async () => {
    const portalUrl = await updatePaymentMethod()
    if (portalUrl) {
      Linking.openURL(portalUrl);
    } else {
      console.error('Failed to retrieve the customer portal URL');
    }
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
            <View style={[globalStyles.row, {justifyContent: 'space-between', marginBottom: 20}]}>
              <Text style={subscriptionDetailsStyles.title}>{i18n.t(`common.subscriptionPeriod.${subscription.items.data[0].plan.nickname}`)}</Text>
              <SimpleBadge
                text={i18n.t('common.paymentStatus.' + subscription.status)}
                backgroundColor={getStatusBackgroundColor(subscription.status).background}
                foregroundColor={getStatusBackgroundColor(subscription.status).foreground}
              />
            </View>

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
                />
              )
            }

            <SimpleButton
              text="Télécharger la dernière facture"
              icon={require('../../../../assets/icons/FiDownload.png')}
              backgroundColor={app_colors.white}
              textColor={app_colors.black}
              iconColor={app_colors.black}
              fullWidth
              align="flex-start"
            />
          </View>


          {/* <Text style={subscriptionManagementStyles.section.text}>{JSON.stringify(subscription, null, 8)}</Text> */}
        </View>
      </ScrollView>
    </View>
  )
}