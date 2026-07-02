import {User} from "../../types/auth/User";
import {UserRoles} from "../../types/auth/UserRoles";
import {getData} from "../../storage";
import {storageKeys} from "../../constants";
import {getSubscriptionStatus} from "../../api/revenuecat/getSubscriptionStatus";

export const isProUser: (user: User) => boolean = (user: User): boolean => {
  if(!user) return false;
  if(user.isAdmin) return true;
  return user.role === UserRoles.SUBSCRIBER
};

/**
 * Authoritative PRO check: queries the backend (GET /auth/me, unified Stripe + RevenueCat role)
 * and falls back to the RevenueCat "pro" entitlement directly if the backend is unreachable.
 * Use this when a fresh/authoritative status is needed (e.g. after a purchase or restore);
 * use the synchronous `isProUser(currentUser)` for render-time gating from the cached user.
 */
export const checkProStatusFromBackend = async (): Promise<boolean> => {
  try {
    const accessToken = await getData(storageKeys.auth.accessToken);

    const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    const user: User = await response.json();
    return isProUser(user);
  } catch (error) {
    console.warn('[isProUser] Backend unavailable, falling back to RevenueCat entitlement:', error);
    return getSubscriptionStatus();
  }
};