/** @deprecated Stripe one-time payments are replaced by RevenueCat (see src/helpers/api/revenuecat). Kept for the existing Stripe web subscriber base. */
export const createStripeOneTimePayment = async (userId: string, priceId: string) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/create-one-time-payment`, {
      method: 'POST',
      headers: {
        'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId,
        priceId
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create Stripe payment');
    }

    return response;
  } catch (error) {
    console.error('Error creating Stripe payment:', error);
    throw error;
  }
}