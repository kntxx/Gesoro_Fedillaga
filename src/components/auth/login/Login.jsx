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

  return (
    <>
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}

      <section className="section text-white h-screen w-full flex items-center py-10">
        <div className="container mx-auto">
          <div className="flex items-center justify-center md:justify-between w-full">

            {/* LEFT SIDE IMAGE — SLIDE IN */}
            <div className="bg-Image w-[50%] md:h-screen hidden md:block animate-slideLeft"></div>

            {/* RIGHT SIDE — FORM WRAPPER (FADE UP) */}
            <div className="w-[80%] md:w-[50%] flex items-center justify-center animate-fadeUp">
              <div className="w-[450px] flex flex-col gap-12 animate-fadeIn">

                {/* HEADER */}
                <div>
                  <h1 className="text-[40px] leading-tight">
                    Have an account? <br />
                    <span className="textGradient">Log in</span>
                  </h1>
                </div>

                {/* FORM */}
                <form onSubmit={onSubmit}>
                  <div className="flex flex-col gap-7">

                    {/* EMAIL */}
                    <input
                      className="py-2 text-[16px] font-bold w-full bg-transparent border-0 
                      border-b-2 border-white/50 text-white placeholder:text-white 
                      outline-none placeholder:font-light focus:border-b-white 
                      transition-colors"
                      placeholder="Email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* PASSWORD */}
                    <input
                      className="py-2 text-[16px] font-bold w-full bg-transparent border-0 
                      border-b-2 border-white/50 text-white placeholder:text-white 
                      outline-none placeholder:font-light focus:border-b-white 
                      transition-colors"
                      placeholder="Password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* ERROR */}
                    {errorMessage && (
                      <span className="text-red-600 font-bold text-sm animate-fadeIn">
                        {errorMessage}
                      </span>
                    )}

                    {/* SIGN IN BUTTON — ANIMATED */}
                    <button
                      disabled={isSigningIn}
                      className={`w-full p-3 rounded-full cursor-pointer text-[16px] anim-btn transition-all duration-300 ${
                        isSigningIn
                          ? "bg-gray-300 cursor-not-allowed"
                          : "btnGradient"
                      }`}
                      type="submit"
                    >
                      {isSigningIn ? "Signing In..." : "Sign In"}
                    </button>

                    {/* SIGN UP LINK */}
                    <div className="text-center">
                      Don't have an account?{" "}
                      <span className="font-bold underline">
                        <Link to={"/register"}>Sign Up</Link>
                      </span>
                    </div>

                    {/* DIVIDER */}
                    <div className="w-full flex items-center">
                      <div className="flex-1 h-px bg-white/30"></div>
                      <span className="text-white/50 text-sm mx-4">or</span>
                      <div className="flex-1 h-px bg-white/30"></div>
                    </div>

                    {/* GOOGLE SIGN IN — ANIMATED */}
                    <button
                      disabled={isSigningIn}
                      className={`w-full p-3 rounded-full outline flex items-center justify-center gap-2 text-[16px] anim-btn transition-all ${
                        isSigningIn
                          ? "cursor-not-allowed"
                          : "hover:bg-gray-100 active:scale-[0.97]"
                      }`}
                      onClick={kentGesoro}
                    >
                      <img src={googleIcon} alt="Google icon" className="w-6 h-6 mr-3" />
                      {isSigningIn ? "Signing In..." : "Continue with Google"}
                    </button>

                  </div>
                </form>

              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
