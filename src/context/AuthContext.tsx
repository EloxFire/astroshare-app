import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../types/auth/User";
import { auth } from "../../firebaseConfig";
import { onAuthStateChanged, signInWithEmailAndPassword } from "@firebase/auth";

const AuthContext = createContext<any | null>(null);

export const useAuth = () => {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthContextProvider({ children }: AuthProviderProps) {

  const [authUser, setAuthUser] = useState<User  | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  // Auth Persistance | Grader l'utilisateur connexté entre les sessions
  useEffect(() => {
    const unSub = onAuthStateChanged(auth, async(firebaseUser) => {
      console.log(`[AuthContext] onAuthStateChanged: `, firebaseUser);
      
      try{
        if(!firebaseUser){
          setAuthUser(null);
          console.log(`[AuthContext] onAuthStateChanged: user is not logged in`);
          return;
        }

        // Session Firebase existante, on récupère un token frais
        const accessToken = await firebaseUser.getIdToken();

        // On re-fetch le user firestore via l'API Astroshare
        const response = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
          }
        });

        const data = await response.json();
        setAuthUser(data.user);

        // TODO : Login et init revenuecat
      } catch (error) {
        console.error(`[AuthContext] onAuthStateChanged: error fetching user data`, error);
        setAuthUser(null);
      } finally {
        console.log(`[AuthContext] onAuthStateChanged: Finished fetching user data. Auth user: `, authUser);
      }
    });

    return () => unSub();
  }, []);

  const registerUser = async (email: string, password: string) => {
    console.log(`[AuthContext] Registering new user with email: ${email}`);

    try {
      setAuthLoading(true);
      const userToRegister = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await userToRegister.json();
      console.log(`[AuthContext] User registered successfully: `, data);

      // We try to login the user directly after registration
      await loginUser(email, password);
    } catch (error) {
      console.error(`[AuthContext] Error registering user: `, error);
    } finally {
      setAuthLoading(false);
    }
  }

  const loginUser = async (email: string, password: string) => {
    console.log(`[AuthContext] Logging in user with email: ${email}`);

    try {
      setAuthLoading(true);

      // Login firebase
      const credentials = await signInWithEmailAndPassword(auth, email, password);
      // ID Token Firebase
      const accessToken = await credentials.user.getIdToken();
      // Verif token coté API Astroshare
      const userToLogin = await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        }
      });

      const data = await userToLogin.json();
      setAuthUser(data.user);
      console.log(`[AuthContext] User logged in successfully: `, data);
    } catch (error) {
      console.error(`[AuthContext] Error logging in user: `, error);
    } finally {
      setAuthLoading(false);
    }
    
  }

  const logoutUser = async () => {
    try {
      setAuthLoading(true);
      await auth.signOut();
      setAuthUser(null);
      // TODO : Logout revenuecat
    } catch (error) {
      console.error(`[AuthContext] Error logging out user: `, error);
    } finally {
      setAuthLoading(false);
    }
  }

  const value = {
    authUser,
    authLoading,
    registerUser,
    loginUser,
    logoutUser,
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}