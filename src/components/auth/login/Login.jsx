import React, { useState } from "react";
import googleIcon from "../../../assets/googleIcon.svg";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignOut,
} from "../../../firebase/auth";

import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext/index";

const Login = () => {
  const { userLoggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      setErrorMessage("");
      try {
        const userCredential = await doSignInWithEmailAndPassword(
          email,
          password
        );

        if (!userCredential.user.emailVerified) {
          setErrorMessage(
            "Email not verified. Please check your inbox and verify your account."
          );
          setIsSigningIn(false);
          doSignOut();
          return;
        }
      } catch (error) {
        setIsSigningIn(false);

        if (error.code === "auth/invalid-credential") {
          setErrorMessage("Invalid email or password. Please try again.");
        } else {
          setErrorMessage(error.message);
        }
      }
    }
  };

  const kentGesoro = (e) => {
    e.preventDefault();

    if (!isSigningIn) {
      setIsSigningIn(true);

      doSignInWithGoogle().catch((err) => {
        setErrorMessage(err.message);
        setIsSigningIn(false);
      });
    }
  };

  return <section>Login</section>;
};

export default Login;
