import React, { useState } from "react";
import googleIcon from "../../../assets/googleIcon.svg";

import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
  doSignOut,
} from "../../../firebase/auth";

import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";

const Login = () => {
  const { userLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [dodgePosition, setDodgePosition] = useState({ x: 0, y: 0 });
  const [isDodging, setIsDodging] = useState(false);

  /* ==========================
        HANDLE LOGIN SUBMIT
  ============================ */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSigningIn) return;

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
  };

  /* ==========================
        GOOGLE SIGN IN
  ============================ */
  const handleGoogleLogin = (e) => {
    e.preventDefault();
    if (isSigningIn) return;

    setIsSigningIn(true);

    doSignInWithGoogle().catch((err) => {
      setErrorMessage(err.message);
      setIsSigningIn(false);
    });
  };

  /* ==========================
        PREMIUM DODGE LOGIC
  ============================ */
  const handlePremiumDodge = (e) => {
    // Stop dodging if user already filled normally
    if (email.trim() !== "" && password.trim() !== "") {
      setIsDodging(false);
      return;
    }

    const parent = e.target.closest(".dodge-container");
    if (!parent) return;

    const parentWidth = parent.offsetWidth;
    const parentHeight = parent.offsetHeight;

    // Get actual button size dynamically
    const btnRect = e.target.getBoundingClientRect();
    const btnWidth = btnRect.width;
    const btnHeight = btnRect.height;

    const maxX = parentWidth - btnWidth;
    const maxY = parentHeight - btnHeight;

    const newX = Math.floor(Math.random() * maxX);
    const newY = Math.floor(Math.random() * maxY);

    setDodgePosition({ x: newX, y: newY });
    setIsDodging(true);
  };

  /* ==========================
         REDIRECT IF LOGGED IN
  ============================ */
  if (userLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <section className="section text-white h-screen w-full flex items-center py-10">
      <div className="container mx-auto">
        <div className="flex items-center justify-center md:justify-between w-full">

          {/* LEFT IMAGE */}
          <div className="bg-Image w-[50%] md:h-screen hidden md:block animate-slideLeft"></div>

          {/* RIGHT CONTENT */}
          <div className="w-[80%] md:w-[50%] flex items-center justify-center animate-fadeUp relative">
            <div className="w-[450px] flex flex-col gap-12 animate-fadeIn">

              {/* HEADER */}
              <h1 className="text-[40px] leading-tight">
                Have an account? <br />
                <span className="textGradient">Log in</span>
              </h1>

              {/* FORM */}
              <form
                onSubmit={onSubmit}
                className="flex flex-col gap-7 dodge-container relative overflow-hidden"
              >

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

                {/* ERROR MESSAGE */}
                {errorMessage && (
                  <span className="text-red-600 font-bold text-sm animate-fadeIn">
                    {errorMessage}
                  </span>
                )}

                {/* SIGN IN BUTTON — PREMIUM DODGE */}
                <button
                  disabled={isSigningIn}
                  onMouseEnter={handlePremiumDodge}
                  style={{
                    position: isDodging ? "absolute" : "relative",
                    left: isDodging ? dodgePosition.x : 0,
                    top: isDodging ? dodgePosition.y : 0,
                    transform: isDodging ? "scale(0.75)" : "scale(1)",
                    transition: "all 0.25s ease",
                  }}
                  className={`w-full p-3 rounded-full cursor-pointer text-[16px] anim-btn 
                    ${isSigningIn ? "bg-gray-300 cursor-not-allowed" : "btnGradient"}
                  `}
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

                {/* GOOGLE SIGN-IN */}
                <button
                  disabled={isSigningIn}
                  className={`w-full p-3 rounded-full outline flex items-center justify-center gap-2 text-[16px] anim-btn transition-all ${
                    isSigningIn
                      ? "cursor-not-allowed"
                      : "hover:bg-gray-100 active:scale-[0.97]"
                  }`}
                  onClick={handleGoogleLogin}
                >
                  <img src={googleIcon} alt="Google" className="w-6 h-6 mr-3" />
                  {isSigningIn ? "Signing In..." : "Continue with Google"}
                </button>

              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Login;
