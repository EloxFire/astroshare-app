export const getStripePublishableKey = async (): Promise<string> => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/stripetoken`, {
      method: 'GET',
      headers: {
        'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch Stripe publishable key');
    }

    const data = await response.json();
    return data.publishableKey;
  } catch (error) {
    console.error('Error fetching Stripe publishable key:', error);
    throw error;
  }
}