"use client";

import { useEffect, useState } from "react";

export type AlertType = "success" | "error" | "info" | "warning";

interface AlertProps {
  type: AlertType;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  duration?: number;
}

const Alert = ({
  type,
  message,
  onClose,
  autoClose = true,
  duration = 5000
}: AlertProps) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Wait for exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onClose?.(), 300);
  };

  const getAlertConfig = () => {
    switch (type) {
      case "success":
        return {
          gradient: "from-emerald-500/10 via-green-500/10 to-teal-500/10",
          border: "border-emerald-500/30",
          iconBg: "bg-gradient-to-br from-emerald-500 to-green-600",
          textColor: "text-emerald-900 dark:text-emerald-100",
          progressBar: "bg-gradient-to-r from-emerald-500 to-green-500",
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ),
        };
      case "error":
        return {
          gradient: "from-red-500/10 via-rose-500/10 to-pink-500/10",
          border: "border-red-500/30",
          iconBg: "bg-gradient-to-br from-red-500 to-rose-600",
          textColor: "text-red-900 dark:text-red-100",
          progressBar: "bg-gradient-to-r from-red-500 to-rose-500",
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
        };
      case "warning":
        return {
          gradient: "from-amber-500/10 via-yellow-500/10 to-orange-500/10",
          border: "border-amber-500/30",
          iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
          textColor: "text-amber-900 dark:text-amber-100",
          progressBar: "bg-gradient-to-r from-amber-500 to-orange-500",
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ),
        };
      case "info":
      default:
        return {
          gradient: "from-blue-500/10 via-cyan-500/10 to-sky-500/10",
          border: "border-blue-500/30",
          iconBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
          textColor: "text-blue-900 dark:text-blue-100",
          progressBar: "bg-gradient-to-r from-blue-500 to-cyan-500",
          icon: (
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const config = getAlertConfig();

  return (
    <div
      className={`
        ${isExiting ? 'animate-slide-out-right' : 'animate-slide-in-right'}
        relative overflow-hidden rounded-2xl border backdrop-blur-xl
        ${config.border} bg-gradient-to-br ${config.gradient}
        shadow-2xl shadow-black/10 dark:shadow-black/30
        transition-all duration-300 ease-out
        hover:shadow-2xl hover:scale-[1.02]
        min-w-[320px] max-w-md
      `}
      role="alert"
    >
      {/* Animated background shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />

      <div className="relative p-4">
        <div className="flex items-start gap-3">
          {/* Icon with gradient background */}
          <div className={`
            flex-shrink-0 rounded-xl p-2 shadow-lg
            ${config.iconBg}
            animate-bounce-subtle
          `}>
            {config.icon}
          </div>

          {/* Message */}
          <div className="flex-1 pt-0.5">
            <p className={`text-sm font-semibold leading-relaxed ${config.textColor}`}>
              {message}
            </p>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={handleClose}
              className={`
                flex-shrink-0 rounded-lg p-1.5 transition-all duration-200
                ${config.textColor} opacity-60 hover:opacity-100
                hover:bg-black/10 dark:hover:bg-white/10
                hover:scale-110 active:scale-95
              `}
              aria-label="Close alert"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Progress bar */}
        {autoClose && (
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
            <div
              className={`h-full ${config.progressBar} animate-progress shadow-lg`}
              style={{ animationDuration: `${duration}ms` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
