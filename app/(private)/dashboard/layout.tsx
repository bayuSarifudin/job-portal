"use client";
import { User } from 'lucide-react';
import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import client from '@/api/client';
import Link from 'next/link';

const DashboardLayout = ({ children }: { children: React.ReactNode; }) => {

  return (
    <div className='w-full h-full relative overflow-x-hidden'>
      <header className='w-full h-[52px] shadow-modal bg-neutral-10 px-4 min-[1440px]:px-[120px] py-3 sticky top-0 left-0'>
        <div className='flex items-center justify-between'>
          <Link href={'/'}>
            <h1 className='text-xl font-bold'>Job List</h1>
          </Link>

          <div className='pl-4 lg:pl-6 border-neutral-40 border-l-2'>
            <Popover>
              <PopoverTrigger>
                <span className='bg-neutral-10 border border-neutral-40 w-7 aspect-square rounded-full flex items-center justify-center'>
                  <User />
                </span>
              </PopoverTrigger>
              <PopoverContent align='end' className='w-fit'>
                <Button variant="destructive" onClick={() => client.auth.signOut()}>Logout</Button>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </header>
      <div className='flex items-start justify-center max-h-[calc(100vh-55px)] overflow-auto'>
        <div className='w-full max-w-[1440px] m-0 px-4 min-[1440px]:px-[120px] min-h-max'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;