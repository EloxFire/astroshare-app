import { storageKeys } from "../../constants";
import { getData } from "../../storage";

export const updatePaymentMethod = async (): Promise<string> => {
  try {
    const accessToken = await getData(storageKeys.auth.accessToken)
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/subscriptions/update-payment-method`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to update payment method');
    }

    const data = await response.json();

    return data.url;
  } catch (error) {
    console.error(error);
    throw error;
  }
}