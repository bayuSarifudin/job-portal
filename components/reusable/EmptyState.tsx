"use client"
import { useUserRole } from '@/hooks/useUserRole';
import Image from 'next/image';
import React, { ReactNode } from 'react';

interface Props {
  title?: string;
  description?: string;
  children?: ReactNode;
  src?: string;
}

const EmptyState = ({ title, description, src, children }: Props) => {
  const { role } = useUserRole()

  const defaultDesc = role === 'admin' ? "Create a job opening now and start the candidate process" : "Create a job opening now and start the candidate process."

  return (
    <div className='w-full h-[80dvh] flex flex-col items-center justify-center gap-4'>
      <Image
        className='w-full max-w-[283px] h-auto'
        unoptimized
        width={100}
        height={100}
        src={src ?? "/empty_state.png"}
        alt='empty'
      />

      <div className='flex flex-col items-center justify-start gap-2'>
        <h2 className='text-heading-s font-bold'>{title ?? 'No job openings available'}</h2>
        <p className='text-l font-normal'>{description ?? defaultDesc}</p>
      </div>

      {children}
    </div>
  );
};

export default EmptyState;