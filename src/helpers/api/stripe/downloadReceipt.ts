export const downloadReceipt = async (chargeId: string) => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/subscriptions/receipt?chargeId=${chargeId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to download receipt');
    }

    const data = await response.json();
    return data.receiptUrl; // Assuming the API returns the URL of the receipt
  } catch (error) {
    console.error('Error downloading receipt:', error);
    throw error;
  }
}