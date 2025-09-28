const checkSubscriptionStatus = async (userId: string) => {
  if (!userId) return;

  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/check-subscription-status`, {
      method: 'POST',
      headers: {
        'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId
      })
    });

    if (!response.ok) {
      console.warn('[Subscription] Failed to check subscription status');
      return;
    }

    const data = await response.json();
    const { status } = data;

    console.log("[Subscription] Current status:", status);
  } catch (e) {
    console.error("[Subscription] Error while checking status:", e);
  }
};