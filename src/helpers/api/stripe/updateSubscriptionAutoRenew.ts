import { storageKeys } from "../../constants"
import { getData } from "../../storage"

export const updateSubscriptionAutoRenew = async (): Promise<any> => {

  try {

    const token = await getData(storageKeys.auth.accessToken)

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/subscriptions/auto-renew`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })

    if(!response.ok) {
      throw new Error('Failed to update subscription auto-renew status')
    }

    const updatedSubscription = await response.json()

    console.log('Updated subscription auto-renew status for subscription :', updatedSubscription.updatedSubscription.id)
    return updatedSubscription.updatedSubscription
  } catch (error: any) {
    console.error('Error updating subscription auto-renew status:', error)
    throw new Error(error.message || 'An error occurred while updating subscription auto-renew status')
  }
}