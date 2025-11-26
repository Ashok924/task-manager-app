"use client";

import { useForm } from "../contexts/FormContext";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";

const FormModals = () => {
  const { showLoginForm, showSignUpForm } = useForm();

  return (
    <>
      {showLoginForm && <LoginForm />}
      {showSignUpForm && <SignUpForm />}
    </>
  );
};

export default FormModals;

