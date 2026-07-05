import dayjs from "dayjs";
import { Text, View } from "react-native";
import { Subscription } from "../../../helpers/types/auth/Subscription";
import { app_colors } from "../../../helpers/constants";
import { i18n } from "../../../helpers/scripts/i18n";
import { getStatusBackgroundColor } from "../../../helpers/api/stripe/getStripeStatusColors";
import SimpleBadge from "../../badges/SimpleBadge";
import DSOValues from "../../commons/DSOValues";
import { subscriptionManagementStyles } from "../../../styles/screens/profile/subscription/subscriptionManagement";

interface SubscriptionSummaryCardProps {
  subscription: Subscription;
}

const productLabelKeys: Record<string, string> = {
  monthly: 'pro.sellScreen.offers.monthly',
  yearly: 'pro.sellScreen.offers.yearly',
  lifetime: 'pro.sellScreen.offers.lifetime',
};

// RevenueCat store product ids (e.g. "fr.eavagliano.astroshare.monthly") contain a
// recognizable suffix we already have friendly labels for. Stripe product ids
// (e.g. "prod_Ab12Cd") are opaque technical ids and are never displayed as-is.
const getProductLabel = (productId: string, isRevenueCat: boolean): string | null => {
  if (!isRevenueCat) return null;

  const matchedKey = Object.keys(productLabelKeys).find((key) => productId.toLowerCase().includes(key));
  return matchedKey ? i18n.t(productLabelKeys[matchedKey]) : productId;
};

const humanizeReason = (reason: string) => reason.replace(/_/g, ' ').toLowerCase().replace(/^./, (char) => char.toUpperCase());

// Dates coming from the backend may be ISO strings or Firestore-shaped ({_seconds}) values
// depending on serialization; parse defensively and hide the row rather than crash or show "Invalid Date".
const formatDate = (value: any): string | null => {
  if (!value) return null;
  const parsed = dayjs(typeof value === 'object' && value._seconds ? value._seconds * 1000 : value);
  return parsed.isValid() ? parsed.format('DD MMMM YYYY') : null;
};

export const SubscriptionSummaryCard = ({ subscription }: SubscriptionSummaryCardProps) => {

  const isRevenueCat = subscription.metadata?.source === 'revenuecat';
  const isTrial = subscription.metadata?.period_type === 'TRIAL' || subscription.metadata?.period_type === 'INTRO';
  const isPastDue = subscription.status === 'past_due';
  const isSandbox = subscription.metadata?.environment === 'SANDBOX';
  const productLabel = getProductLabel(subscription.product, isRevenueCat);
  const periodEnd = formatDate(subscription.current_period_end);
  const gracePeriodEnd = formatDate(subscription.metadata?.grace_period_expiration_at);
  const reason = subscription.metadata?.cancel_reason || subscription.metadata?.expiration_reason;

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <View style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <SimpleBadge
          text={i18n.t('common.paymentStatus.' + subscription.status)}
          backgroundColor={getStatusBackgroundColor(subscription.status).background}
          foregroundColor={getStatusBackgroundColor(subscription.status).foreground}
        />
        {
          isTrial && (
            <SimpleBadge
              text={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.summary.trial')}
              backgroundColor={app_colors.turquoise}
              foregroundColor={app_colors.white}
            />
          )
        }
        {
          isSandbox && (
            <SimpleBadge text="Sandbox" backgroundColor={app_colors.white_twenty} foregroundColor={app_colors.white} small />
          )
        }
      </View>

      {
        isPastDue && (
          <Text style={subscriptionManagementStyles.section.text}>
            {i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.summary.pastDueWarning')}
            {gracePeriodEnd ? ` (${gracePeriodEnd})` : ''}
          </Text>
        )
      }

      {
        productLabel && (
          <DSOValues title={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.summary.product')} value={productLabel} />
        )
      }

      {
        subscription.periodicity && (
          <DSOValues
            title={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.summary.frequency')}
            value={i18n.t('common.subscriptionPeriod.' + subscription.periodicity)}
          />
        )
      }

      {
        subscription.price && isRevenueCat && (
          <DSOValues title={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.summary.price')} value={subscription.price} />
        )
      }

      {
        periodEnd && (
          <DSOValues title={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.summary.periodEnd')} value={periodEnd} />
        )
      }

      {
        reason && (subscription.status === 'canceled' || subscription.status === 'expired') && (
          <DSOValues title={i18n.t('auth.profile.dataAndSubscription.subscriptionManagement.summary.reason')} value={humanizeReason(reason)} />
        )
      }
    </View>
  );
};
