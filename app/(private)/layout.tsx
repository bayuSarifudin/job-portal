"use client"
import React, { ReactNode, useEffect} from 'react'
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth'

const PrivatePagesLayout = ({ children }: { children: ReactNode}) => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.loading && !auth?.userLogin) {
      router.push('/')
    }
  }, [auth?.loading, auth?.userLogin, router]);

  if (auth?.loading || !auth?.userLogin) return null

  return (
    <React.Fragment>
      {children}
    </React.Fragment>
  )
}

export default PrivatePagesLayout