"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "./components/LoginForm";
import { useAuth } from "./contexts/AuthContext";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/task-manager");
    }
  }, [isLoading, isAuthenticated, router]);

  // While auth initializes, show a small centered spinner to avoid blank flicker
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If authenticated, don't render the login UI (effect will redirect)
  if (isAuthenticated) return null;

  return <LoginForm />;
};

export default Home;
