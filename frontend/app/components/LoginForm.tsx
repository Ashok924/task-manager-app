"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import { useForm } from "../contexts/FormContext";
import { usePageTransition } from "./PageTransition";
import Alert, { AlertType } from "./Alert";
import AlertContainer from "./AlertContainer";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successRedirecting, setSuccessRedirecting] = useState(false);
  const { login } = useAuth();
  const { closeForms, openSignUpForm } = useForm();
  const router = useRouter();
  const { start } = usePageTransition();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
      // clear any pending redirect timer
      try {
        const cleanup = (window as any).__loginRedirectCleanup;
        if (typeof cleanup === "function") cleanup();
      } catch (e) {
        // ignore
      }
    };
  }, []);


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlert(null);
    setIsLoading(true);

    try {
      const success = await login(email, password);
      setIsLoading(false);

      if (success) {
        // Show success alert
        setAlert({ type: "success", message: "Login successful! Redirecting to dashboard..." });
        setSuccessRedirecting(true);
        const t = window.setTimeout(async () => {
          try {
            // start page transition (fade overlay)
            await start(600);
          } finally {
            setSuccessRedirecting(false);
            closeForms();
            router.push("/task-manager");
          }
        }, 3000); // Reduced to 3 seconds to match alert duration
        // store cleanup on window in case component unmounts
        (window as any).__loginRedirectCleanup = () => window.clearTimeout(t);
      } else {
        // Show error alert for invalid credentials
        setAlert({ type: "error", message: "Invalid email or password. Please try again." });
      }
    } catch (err) {
      setIsLoading(false);
      setAlert({ type: "error", message: "An error occurred. Please check your connection and try again." });
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 overflow-y-auto"
        onClick={closeForms}
      >
        <div
          className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Login
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="login-email"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus:ring-zinc-600"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-zinc-600 dark:text-zinc-400">
            <span>Don't have an account? </span>
            <button
              onClick={openSignUpForm}
              className="font-medium text-zinc-900 transition-colors hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>

      {alert && (
        <AlertContainer>
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            autoClose={alert.type === "success"}
            duration={3000}
          />
        </AlertContainer>
      )}
    </>
  );
};

export default LoginForm;

