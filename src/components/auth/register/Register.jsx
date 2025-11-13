import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/authContext";
import {
  doCreateUserWithEmailAndPassword,
  doSendVerificationEmail,
} from "../../../firebase/auth";

const Register = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { userLoggedIn } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        const userCredential = await doCreateUserWithEmailAndPassword(
          email,
          password
        );
        const user = userCredential.user;

        await doSendVerificationEmail(user);

        setIsRegistering(false);

        navigate("/verify-email");
      } catch (error) {
        setErrorMessage(error.message);
        setIsRegistering(false);
      }
    }
  };

  return (
    <>
      {" "}
      {userLoggedIn && <Navigate to={"/home"} replace={true} />}s
      <section className="section text-white h-screen w-full flex items-center py-10  ">
        <div className="container mx-auto ">
          <div className="flex  items-center justify-center md:justify-between w-full ">
            {/* RIGHT */}
            <div className="w-[80%] md:w-[65%] flex items-center justify-center  ">
              <div className="w-[550px] h-100%   flex flex-col justify-between gap-15   ">
                {/* HEADER */}
                <div>
                  <h1 className="text-[50px] ">
                    Create an <span className="textGradient">Account</span>
                  </h1>
                </div>
                {/* FORM */}
                <div className="">
                  <form onSubmit={onSubmit}>
                    <div>
                      {/* email and password */}
                      <div className="flex flex-col gap-7 ">
                        <input
                          className="py-2
                            text-[16px]
                            font-bold
                            w-full
                            bg-transparent
                            border-0
                            border-b-2 border-white/50
                            text-white
                            placeholder:text-white
                            outline-none
                            placeholder:font-light
                            focus:border-b-white
                            transition-colors"
                          placeholder="Email"
                          type="email"
                          autoComplete="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                        <input
                          className="py-2
                            text-[16px]
                            font-bold
                            w-full
                            bg-transparent
                            border-0
                            border-b-2 border-white/50
                            text-white
                            placeholder:text-white
                            outline-none
                            placeholder:font-light
                            focus:border-b-white
                            transition-colors"
                          placeholder="Password"
                          disabled={isRegistering}
                          type="password"
                          autoComplete="new-password"
                          required
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                        <input
                          className="py-2
                            text-[16px]
                            font-bold
                            w-full
                            bg-transparent
                            border-0
                            border-b-2 border-white/50
                            text-white
                            placeholder:text-white
                            outline-none
                            placeholder:font-light
                            focus:border-b-white
                            transition-colors"
                          placeholder="Confirm Password"
                          disabled={isRegistering}
                          type="password"
                          autoComplete="off"
                          required
                          value={confirmPassword}
                          onChange={(e) => {
                            setconfirmPassword(e.target.value);
                          }}
                        />
                        {errorMessage && (
                          <span className={`font-bold text-sm text-red-600`}>
                            {errorMessage}
                          </span>
                        )}
                        <button
                          className={`w-full p-3 rounded-full cursor-pointer  text-[16px] active"
                          type="submit ${
                            isRegistering
                              ? "bg-gray-300 cursor-not-allowed"
                              : "btnGradient hover:shadow-xl transition duration-3Lg"
                          }`}
                          disabled={isRegistering}
                        >
                          {" "}
                          {isRegistering
                            ? " Create Account...."
                            : " Create An Account"}
                        </button>

                        <div className="text-center">
                          Have an account?{" "}
                          <span className="font-bold underline">
                            <Link to={"/login"}> Log In</Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            {/* LEFT */}
            <div className="bg-Image2 w-[35%] md:h-screen hidden md:block">
              {" "}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
