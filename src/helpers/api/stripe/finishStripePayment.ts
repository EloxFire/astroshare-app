export const finishStripePayment = async (userId: string, subscription: string, subscriptionName: string, subscriptionType: string) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/finish-payment`, {
      method: 'POST',
      headers: {
        'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        subscription: subscription,
        subscriptionName: subscriptionName,
        subscriptionType: subscriptionType
      })
    });

    console.log("Stripe payment response: ", response.ok);

    if (!response.ok) {
      throw new Error('Failed to finish Stripe payment');
    }

    console.log("Stripe payment finished successfully: ", response);
    return response;
  } catch (error) {
    console.error('Error finishing Stripe payment:', error);
    throw error;
  }
}