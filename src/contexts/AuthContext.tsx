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

  const refreshAccessToken = async () => {
    const refreshToken = await getData(storageKeys.auth.refreshToken)

    if (!refreshToken) {
      console.log('[Auth] No refresh token found, user is not logged in')
      await logoutUser()
      return null
    }

    console.log('[Auth] Refreshing user access token')
    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/refresh`, {
        refreshToken
      })

      const { accessToken, refreshToken: newRefreshToken, user } = response.data

      // Firebase renvoie parfois un refreshToken actualisé → on le stocke aussi
      await storeData(storageKeys.auth.accessToken, accessToken)
      await storeData(storageKeys.auth.refreshToken, newRefreshToken)
      await storeObject(storageKeys.auth.user, user)

      console.log('[Auth] Access token refreshed successfully')


      setCurrentUser(user)
      console.log('[Auth] Current user updated')

      if(user.subscriptionId){
        console.log('[Auth] User has a subscription, checking subscription status...')
        const subscriptionResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/subscription/status`, {
          headers: {
            'Authorization': accessToken
          }
        })
      }
      return accessToken
    } catch (e) {
      console.log('[Auth] Failed to refresh token', e)
      await logoutUser()
      return null
    }
  }

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
    } catch (e: any) {
      console.log('[Auth] Error logging in user:', e)
      showToast({ message: e.response?.data?.error || "Erreur de connexion", type: 'error' })
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
