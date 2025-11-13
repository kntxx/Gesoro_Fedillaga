import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
const VerificationEmailMessage = () => {
  const { currentUser } = useAuth();

  return (
    <section className="section h-screen flex items-center justify-center bg-Image p-5">
      <div>
        <div className="flex flex-col text-center  items-center gap-20">
          <h1 className="textGradient text-[40px] md:text-[130px]">
            Check Your Email
          </h1>
          <p className="text-[30px] md:text-[60px] text-white w-[90%] md:w-[90%] ">
            We've sent a verification link to you're email{" "}
            {currentUser.displayName
              ? currentUser.displayName
              : currentUser.email}
          </p>
          <button className="btnGradient w-[300px] md:w-[500px] md:p-5 cursor-pointer">
            <Link to={"/login"}> Continue Log In</Link>
          </button>
          <div className="bg-white  h-[1px] w-[90%]"></div>
        </div>
      </div>
    </section>
  );
};

export default VerificationEmailMessage;
