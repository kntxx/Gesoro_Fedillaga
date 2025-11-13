import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
const VerificationEmailMessage = () => {
  const { currentUser } = useAuth();

  return <section>VerificationEmailMessage</section>;
};

export default VerificationEmailMessage;
