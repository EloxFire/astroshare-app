export const createStripeSubscription = async (userId: string, priceId: string) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/create-subscription`, {
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