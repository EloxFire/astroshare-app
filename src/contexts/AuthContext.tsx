import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { User } from "../helpers/types/auth/User"
import axios from "axios"
import { showToast } from "../helpers/scripts/showToast"
import { getData, removeData, storeData, storeObject } from "../helpers/storage"
import { storageKeys } from "../helpers/constants"

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const refreshToken = await getData(storageKeys.auth.refreshToken)

    console.log('[Auth] Checking user')

    if (!refreshToken) {
      console.log('[Auth] No token found : Skipping user login')
      return
    }

    try {
      // Firebase refresh tokens are opaque, skip manual decoding
      await refreshAccessToken()
    } catch (e) {
      console.log('[Auth] Error during token validation:', e)
      await logoutUser()
    }
  }

  const refreshAccessToken = async (): Promise<string | null> => {
    const refreshToken = await getData(storageKeys.auth.refreshToken);

    if (!refreshToken) {
      console.log("[Auth] No refresh token found, user is not logged in");
      await logoutUser();
      return null;
    }

    console.log("[Auth] Refreshing user access token");

    try {
      // 1) Refresh token
      const { data } = await axios.post(
        `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/refresh`,
        { refreshToken },
        { timeout: 8000 }
      );

      const {
        accessToken,
        refreshToken: newRefreshToken,
        user,
      }: { accessToken: string; refreshToken: string; user: User } = data;

      // 2) Persist & set state
      await storeData(storageKeys.auth.accessToken, accessToken);
      await storeData(storageKeys.auth.refreshToken, newRefreshToken);
      await storeObject(storageKeys.auth.user, user);

      setCurrentUser(user);
      console.log("[Auth] Access token refreshed & current user updated");

      // 3) Vérif abonnement (silencieuse)
      if (user?.subscriptionId) {
        console.log("[Auth] User has a subscription, checking subscription status...");

        try {
          const subRes = await axios.post(
            `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stripe/check-subscription-status`,
            { userId: user.uid }, // le backend lit l'ID user et va chercher subscriptionId en DB
            {
              headers: {
                Authorization: process.env.EXPO_PUBLIC_ADMIN_KEY, // assure-toi que c'est ce que checkCallFromApp attend
              },
              timeout: 8000,
            }
          );

          // Attendu côté backend robuste: { status, valid, reason, current_period_end, ... }
          const { valid, status, reason } = subRes.data || {};
          console.log("[Auth] Subscription status:", { valid, status, reason });

        } catch (err: any) {
          console.log("[Auth] Error checking user subscription status:", err?.message || err);
        }
      } else {
        console.log("[Auth] User has no subscription ID, skipping subscription check");
      }

      return accessToken;
    } catch (e: any) {
      console.log("[Auth] Failed to refresh token", e?.message || e);
      await logoutUser();
      return null;
    }
  };

  const loginUser = async (email: string, password: string) => {
    console.log('[Auth] Logging in user')
    try {
      const userToLog = await axios.post(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/login`, {
        email,
        password
      })

      const { accessToken, refreshToken, user } = userToLog.data
      await storeData(storageKeys.auth.refreshToken, refreshToken)
      await storeData(storageKeys.auth.accessToken, accessToken)
      await storeObject(storageKeys.auth.user, user)

      setCurrentUser(user)
      console.log('[Auth] User logged in successfully')
      return 'success';
    } catch (e: any) {
      console.log('[Auth] Error logging in user:', e)
      showToast({ message: e.response?.data?.error || "Erreur de connexion", type: 'error' })
      return null;
    }
  }

  const logoutUser = async () => {
    console.log('[Auth] Logging out user')
    await removeData(storageKeys.auth.refreshToken)
    await removeData(storageKeys.auth.accessToken)
    await removeData(storageKeys.auth.user)
    setCurrentUser(null)
  }

  const updateCurrentUser = async () => {
    if (!currentUser) {
      console.log('[Auth] No user found')
      return
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/get?userId=${currentUser.uid}`, {
        method: 'GET',
        headers: {
          'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) throw new Error('Failed to fetch user data')

      const data = await response.json()
      setCurrentUser(data)
    } catch (e: any) {
      console.log('[Auth] Error updating user:', e)
      showToast({ message: e.response?.data?.error || "Erreur de récupération de l'utilisateur", type: 'error' })
    }
  }

  const values = {
    loginUser,
    logoutUser,
    updateCurrentUser,
    currentUser
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  )
}
