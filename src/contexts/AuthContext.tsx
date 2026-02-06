import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { User } from "../helpers/types/auth/User"
import axios from "axios"
import { showToast } from "../helpers/scripts/showToast"
import { getData, removeData, storeData, storeObject } from "../helpers/storage"
import { storageKeys } from "../helpers/constants"
import { useTranslation } from '../hooks/useTranslation'
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from '../../firebaseConfig'

const AuthContext = createContext<any>({})

export const useAuth = () => useContext(AuthContext)

interface AuthContextProviderProps {
  children: ReactNode
}

export function AuthContextProvider({ children }: AuthContextProviderProps) {

  const { currentLocale } = useTranslation()

  const [currentUser, setCurrentUser] = useState<User | null | undefined>(null)
  const [authLoading, setAuthLoading] = useState<boolean>(false)

  // AUTH PERSISTENCE - garder l'utilisateur connecté entre les sessions
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[Auth] onAuthStateChanged triggered, firebaseUser:', firebaseUser);
      
      try {
        if (!firebaseUser) {
          setCurrentUser(null);
          return;
        }
  
        // Firebase a une session => on récupère un token frais
        const accessToken = await firebaseUser.getIdToken();
  
        // On re-fetch le user Firestore via ton API (recommandé)
        const resp = await axios.post(
          `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/login`,
          {},
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
  
        const { user } = resp.data;
  
        await storeData(storageKeys.auth.accessToken, accessToken);
        await storeObject(storageKeys.auth.user, user);
  
        setCurrentUser(user);
      } catch (e) {
        // Si l’API refuse ou autre, on peut forcer un logout local
        setCurrentUser(null);
      } finally {
        // Si tu as un état "boot/loading"
        // setAuthBooting(false)
      }
    });
  
    return () => unsub();
  }, []);



  const registerUser = async (email: string, password: string) => {
    console.log('[Auth] Registering user')
    try {
      setAuthLoading(true);
      const userToRegister = await axios.post(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/register`, {
        email,
        password
      })

      console.log('[Auth] User registered response:', userToRegister.data);

      const loginResult = await loginUser(email, password);

      setAuthLoading(false);
      return loginResult ? "success" : null;
    } catch (e: any) {
      console.log('[Auth] Error registering user:', e)
      showToast({ message: e.response?.data?.error || "Erreur d'inscription", type: 'error' })
      setAuthLoading(false);
      return null;
    }
  }

  const loginUser = async (email: string, password: string) => {
    console.log("[Auth] Logging in user");
  
    try {
      // 1) Login Firebase côté app
      const credentials = await signInWithEmailAndPassword(auth, email, password);
  
      // 2) Récupérer un ID token (JWT) à envoyer à ton backend
      const accessToken = await credentials.user.getIdToken(); // ou getIdToken(true) si tu veux forcer un refresh
  
      // Optionnel : Firebase expose aussi un refreshToken (mais pas obligatoire de le stocker)
      const refreshToken = credentials.user.refreshToken;
  
      // 3) Vérification du Token coté API
      const userToLog = await axios.post(
        `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/login`,
        {}, // body vide
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );      
  
      const { user } = userToLog.data;
  
      // 4) Stockage local (tu peux garder tes clés actuelles)
      await storeData(storageKeys.auth.accessToken, accessToken);
      await storeObject(storageKeys.auth.user, user);
  
      await checkSubscriptionStatus(user);
  
      setCurrentUser(user);
      console.log("[Auth] User logged in successfully");
      return "success";
    } catch (e: any) {
      console.log("[Auth] Error logging in user:", e);
  
      // Erreurs Firebase fréquentes (meilleure UX)
      const firebaseCode = e?.code;
      const apiError = e?.response?.data?.error;
  
      let message = apiError || "Erreur de connexion";
  
      if (firebaseCode === "auth/invalid-credential") message = "Identifiants invalides.";
      if (firebaseCode === "auth/wrong-password") message = "Mot de passe incorrect.";
      if (firebaseCode === "auth/user-not-found") message = "Aucun compte ne correspond à cet email.";
      if (firebaseCode === "auth/too-many-requests") message = "Trop de tentatives, réessaie plus tard.";
  
      showToast({ message, type: "error" });
      return null;
    }
  };

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
      const accessToken = await getData(storageKeys.auth.accessToken)

      const resp = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const updatedUser = resp.data;

      console.log("[Auth] Updated user:", updatedUser);
      

      setCurrentUser(updatedUser);
    } catch (e: any) {
      console.log('[Auth] Error updating user:', e)
      showToast({ message: e.response?.data?.error || "Erreur de récupération de l'utilisateur", type: 'error' })
    }
  }

  const checkSubscriptionStatus = async (user: User) => {
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

        if(!valid) {
          console.log("[Auth] Subscription is not valid:", reason);
          showToast({ message: `Abonnement invalide : ${reason}`, type: 'error' });
          await updateCurrentUser()
        }

      } catch (err: any) {
        console.log("[Auth] Error checking user subscription status:", err?.message || err);
      }
    } else {
      console.log("[Auth] User has no subscription ID, skipping subscription check");
      return;
    }
  }

  const resetPassword = async (email: string) => {
    console.log('[Auth] Resetting password for user');
  
    if (!email) {
      showToast({ message: "Veuillez renseigner votre email", type: "error" });
      return null;
    }
  
    try {
      setAuthLoading(true);
  
      await axios.post(
        `${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/forgot-password`,
        { email, locale: currentLocale },
        {
          headers: {
            Authorization: process.env.EXPO_PUBLIC_ADMIN_KEY,
          },
          timeout: 8000,
        }
      );
  
      showToast({
        message: "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
        type: "success",
      });

      console.log("[Auth] Password reset link sent successfully with locale :", currentLocale);
      
  
      setAuthLoading(false);
      return "success";
    } catch (e: any) {
      console.log('[Auth] Error resetting password:', e?.response?.data || e);
      showToast({
        message: e.response?.data?.error || "Erreur lors de l’envoi du lien",
        type: "error",
      });
      setAuthLoading(false);
      return null;
    }
  };

  const values = {
    registerUser,
    loginUser,
    logoutUser,
    updateCurrentUser,
    resetPassword,
    currentUser
  }

  return (
    <AuthContext.Provider value={values}>
      {children}
    </AuthContext.Provider>
  )
}
