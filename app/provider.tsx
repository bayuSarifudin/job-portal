"use client";
import { ReactNode } from 'react';
import { AuthProvider } from "@/components/context/AuthProvider";
import { ThemeProvider } from 'next-themes';


const Providers = ({ children }: { children: ReactNode; }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Providers;