import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";

const VerificationEmailMessage = () => {
  const { currentUser } = useAuth();

  return (
    <section className="section h-screen flex items-center justify-center bg-Image p-5">
      <div className="flex flex-col text-center items-center gap-20">

        {/* HEADER */}
        <h1 className="textGradient text-[40px] md:text-[130px] leading-none">
          Check Your Email
        </h1>

        {/* MESSAGE */}
        <p className="text-[30px] md:text-[60px] text-white w-[90%] md:w-[90%] leading-tight">
          We've sent a verification link to your email{" "}
          <span className="font-bold">
            {currentUser?.displayName
              ? currentUser.displayName
              : currentUser?.email}
          </span>
        </p>

        {/* BUTTON */}
        <button className="btnGradient w-[300px] md:w-[500px] md:p-5 cursor-pointer text-[20px] rounded-full">
          <Link to={"/login"}>Continue Log In</Link>
        </button>

        <div className="bg-white h-[1px] w-[90%] opacity-40"></div>
      </div>
    </section>
  );
};

export default VerificationEmailMessage;
