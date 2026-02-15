import dayjs from "dayjs";
import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { PaymentIcon } from 'react-native-payment-card-icons';
import { app_colors } from "../../../helpers/constants";
import { i18n } from "../../../helpers/scripts/i18n";
import { subscriptionCardStyles } from "../../../styles/components/cards/subscriptions/subscriptionCard";
import SimpleBadge from "../../badges/SimpleBadge";
import { routes } from "../../../helpers/routes";
import { downloadReceipt } from "../../../helpers/api/stripe/downloadReceipt";
import { Link } from "@react-navigation/native";
import { getStatusBackgroundColor } from "../../../helpers/api/stripe/getStripeStatusColors";

interface SubscriptionCardProps {
  type: 'payment_intent' | 'subscription';
  payment: any;
  navigation: any
}

export const SubscriptionCard = ({ type, payment, navigation }: SubscriptionCardProps) => {

  

  const handleButtonPress = async () => {
    if(type === 'payment_intent') {
      const url = await downloadReceipt(payment.latest_charge)
      Linking.openURL(url)
    } else {
      navigation.navigate(routes.auth.profile.subscriptionManagement.subscriptionDetails.path, { subscription: payment })
    }
  }

  return (
    <View style={subscriptionCardStyles.card}>
      <SimpleBadge
        text={i18n.t('common.paymentStatus.' + payment.status)}
        backgroundColor={getStatusBackgroundColor(payment.status).background}
        foregroundColor={getStatusBackgroundColor(payment.status).foreground}
        small
      />
      {
        type === 'payment_intent' ? (
          <>
            <View>
              <Text style={subscriptionCardStyles.card.label}>Date</Text>
              <Text style={subscriptionCardStyles.card.date}>{dayjs(payment.created * 1000).format('DD/MM/YY')}</Text>
            </View>
            <View>
              <Text style={subscriptionCardStyles.card.label}>Montant</Text>
              <Text style={subscriptionCardStyles.card.amount}>{payment.amount / 100}€</Text>
            </View>
            <View>
              <Text style={subscriptionCardStyles.card.label}>Paiement</Text>
              <View style={subscriptionCardStyles.card.row}>
                <PaymentIcon type={payment.payment_method?.card?.brand || 'security-code-front'} variant="flatRounded" width={24} height={16} />
                <Text style={{ color: app_colors.white, fontSize: 14, fontFamily: 'DMMonoRegular' as 'DMMonoRegular' }}>{payment.payment_method?.card?.last4 || '****'}</Text>
              </View>
            </View>
            <TouchableOpacity style={subscriptionCardStyles.card.button} onPress={handleButtonPress}>
              <Image source={require('../../../../assets/icons/FiFileText.png')} style={{ width: 18, height: 18, tintColor: app_colors.white }} />
            </TouchableOpacity>
          </>
        ) : (
          <>
           <View>
            <Text style={subscriptionCardStyles.card.label}>Renouvellement</Text>
            <Text style={subscriptionCardStyles.card.date}>{dayjs(payment.current_period_end * 1000).format('DD/MM/YY')}</Text>
           </View>

           <View>
            <Text style={subscriptionCardStyles.card.label}>Récurence</Text>
            <Text style={subscriptionCardStyles.card.date}>{i18n.t('common.subscriptionPeriod.' + payment.items.data[0].plan.interval)}</Text>
           </View>

           <View>
            <Text style={subscriptionCardStyles.card.label}>Tarif</Text>
            <Text style={subscriptionCardStyles.card.amount}>{payment.items.data[0].plan.amount / 100}€</Text>
           </View>

           <TouchableOpacity style={subscriptionCardStyles.card.button} onPress={handleButtonPress}>
              <Image source={require('../../../../assets/icons/FiChevronRight.png')} style={{ width: 18, height: 18, tintColor: app_colors.white }} />
            </TouchableOpacity>
          </>
        )
      }
    </View>
  )
}