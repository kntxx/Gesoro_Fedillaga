import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import { doSignOut } from "../../firebase/auth";

const Home = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { userLoggedIn } = useAuth();
  return <section>Home</section>;
};

export default Home;
