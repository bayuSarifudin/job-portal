"use client";
import Auth from "@/components/auth/Auth";
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.loading && auth?.userLogin) {
      router.push("/dashboard");
    }
  }, [auth?.loading, auth?.userLogin, router]);

  return (
    <div className="w-full flex items-start justify-center font-sans">
      {auth?.loading && (
        <h1>Loading...</h1>
      )}
      {!auth?.loading && (
        <Auth />
      )}
    </div>
  );
}
