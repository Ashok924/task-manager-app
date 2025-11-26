"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface FormContextType {
  showLoginForm: boolean;
  showSignUpForm: boolean;
  setShowLoginForm: (show: boolean) => void;
  setShowSignUpForm: (show: boolean) => void;
  openLoginForm: () => void;
  openSignUpForm: () => void;
  closeForms: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const openLoginForm = () => {
    setShowLoginForm(true);
    setShowSignUpForm(false);
  };

  const openSignUpForm = () => {
    setShowSignUpForm(true);
    setShowLoginForm(false);
  };

  const closeForms = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
  };

  return (
    <FormContext.Provider
      value={{
        showLoginForm,
        showSignUpForm,
        setShowLoginForm,
        setShowSignUpForm,
        openLoginForm,
        openSignUpForm,
        closeForms,
      }}
    >
      {children}
    </FormContext.Provider>
  );
};

export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error("useForm must be used within a FormProvider");
  }
  return context;
};

