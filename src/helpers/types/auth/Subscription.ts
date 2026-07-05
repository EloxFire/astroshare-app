export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'past_due' | 'unknown';

export type Subscription = {
  id: string;
  price?: string | null;
  product: string;
  status: SubscriptionStatus;
  periodicity?: string;
  current_period_end: Date | null;
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    category: string;
    source?: 'stripe' | 'revenuecat';
    store?: string;
    environment?: string | null;
    period_type?: string | null;
    transaction_id?: string | null;
    entitlement_ids?: string[];
    country_code?: string | null;
    renewal_number?: number | null;
    cancel_reason?: string;
    expiration_reason?: string;
    grace_period_expiration_at?: Date;
  }
}
