"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import client from "@/api/client";
import { User } from "@supabase/supabase-js";

const AuthContext = createContext<{ userLogin: User | null; loading: boolean} | null>(null)

interface AuthProviderProps {
  children: ReactNode;
}
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userLogin, setUserLogin] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    client?.auth?.getSession().then(({ data }) => {
      setUserLogin(data?.session?.user ?? null)
      setLoading(false)
    })

    const { data: listener } = client?.auth?.onAuthStateChange((e, session) => {
      setUserLogin(session?.user || null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, []);

  return (
    <AuthContext.Provider value={{  userLogin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export {
  AuthContext,
  AuthProvider
}