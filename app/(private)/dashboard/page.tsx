"use client";
import { Spinner } from '@/components/ui/spinner';
import { useUserRole } from '@/hooks/useUserRole';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const DashboardRoot = () => {
  const router = useRouter();
  const { role, loading } = useUserRole();
  useEffect(() => {
    if (role === 'admin') {
      router.push('/dashboard/admin');
    } else if (role === 'user') {
      router.push('/dashboard/user');
    }
  }, [role, loading, router]);
  if (loading) {
    return <Spinner />;
  }
  return (
    <div>Dashboard Route</div>
  )
};

export default DashboardRoot;