import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  return (
    <section className="bigBgImage section h-screen flex items-center justify-center bg-Image p-5">
      {" "}
      <div className="flex items-center justify-center flex-col gap-5 text-center">
        <div className="flex flex-col">
          <h1 className="text-[85px] text-white"> Welcomeee</h1>
          <h3 className="text-[60px] text-white">
            Hello{" "}
            <span className="textGradient text-[75]">
              {currentUser.displayName
                ? currentUser.displayName
                : currentUser.email}
            </span>
            , you are now logged in.
          </h3>
        </div>

        <div className="w-[50%]">
          {userLoggedIn ? (
            <>
              <button
                onClick={() => {
                  doSignOut().then(() => {
                    navigate("/login");
                  });
                }}
                className=" p-5 rounded-full cursor-pointer  text-[16px] active btnGradient w-[50%]"
                type="submit"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2">
              <Link
                className="w-full p-3 rounded-full cursor-pointer  text-[16px] active btnGradient"
                to={"/login"}
              >
                Login
              </Link>
              <Link
                className="w-full p-3 rounded-full cursor-pointer  text-[16px] active btnGradient"
                to={"/register"}
              >
                Register New Account
              </Link>
            </div>
          )}{" "}
        </div>
      </div>
    </section>
  );

};

export default Home;
