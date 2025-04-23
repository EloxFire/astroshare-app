import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import {User} from "../helpers/types/auth/User";
import axios from "axios";
import {showToast} from "../helpers/scripts/showToast";
import {getData, getObject, removeData, storeData, storeObject} from "../helpers/storage";
import {storageKeys} from "../helpers/constants";
import {jwtDecode} from "jwt-decode";

const AuthContext = createContext<any>({})

export const useAuth = () => {
  return useContext(AuthContext)
}

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {

  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const token = await getData(storageKeys.auth.refreshToken);

    console.log('[Auth] Checking user')
    console.log('[Auth] Refresh token :', token)

    if(!token){
      console.log('[Auth] No token found')
      return;
    }else{
      const {exp} = jwtDecode(token);
      if(exp! * 1000 < Date.now()) {
        console.log('[Auth] Token expired')
        await removeData(storageKeys.auth.refreshToken)
        await removeData(storageKeys.auth.accessToken)
        await removeData(storageKeys.auth.user)
        setCurrentUser(null)
        return;
      }else{
        console.log('[Auth] Token still valid')
        const user: User = await getObject(storageKeys.auth.user);
        console.log('[Auth] User found :', user.email)
        setCurrentUser(user)
      }
    }
  }

  const loginUser = async (email: string, password: string) => {
    console.log('[Auth] Logging in user')
    try {
      const userToLog = await axios.post(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/login`, {
        email,
        password
      })
      console.log('[Auth] User logged in :', userToLog.data.user.email)
      console.log('[Auth] Access token :', userToLog.data.accessToken)
      await storeData(storageKeys.auth.refreshToken, userToLog.data.refreshToken)
      await storeData(storageKeys.auth.accessToken, userToLog.data.accessToken)
      await storeObject(storageKeys.auth.user, userToLog.data.user)
      setCurrentUser(userToLog.data.user)
    } catch (e: any) {
      console.log('[Auth] Error logging in user :', e)
      showToast({message: e.response.data.error, type: 'error'})
    }
  }

  const registerUser = async (email: string, password: string) => {
    console.log('[Auth] Registering user')
  }

  const logoutUser = async () => {
    console.log('[Auth] Logging out user')
    await removeData(storageKeys.auth.refreshToken)
    await removeData(storageKeys.auth.accessToken)
    await removeData(storageKeys.auth.user)
    setCurrentUser(null)
  }

  const updateCurrentUser = async () => {
    if(!currentUser) {
      console.log('[Auth] No user found')
      return;
    }

    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/get?userId=${currentUser.uid}`, {
        method: 'GET',
        headers: {
          'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.log('[Auth] Error fetching and updating currentUser data')
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();

      console.log("User found", data)
      setCurrentUser(data)
    } catch (e: any) {
      console.log('[Auth] Error updating user :', e)
      showToast({message: e.response.data.error, type: 'error'})
    }
  }


  const values = {
    loginUser,
    registerUser,
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
