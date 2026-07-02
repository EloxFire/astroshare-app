/** @deprecated Stripe checkout products are replaced by RevenueCat offerings (see src/helpers/api/revenuecat/getOfferings.ts). Kept for the existing Stripe web subscriber base. */
export const getStripeProducts = async () => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/products`, {
      method: 'GET',
      headers: {
        'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    throw error;
  }
}