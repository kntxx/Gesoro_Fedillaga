import "./App.css";
import Login from "./components/auth/login/Login";
import Register from "./components/auth/register/Register";
import Home from "./components/home/Home";
import VerificationEmailMessage from "./components/verificationEmailMessage/verificationEmailMessage";
import { useRoutes, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/authContext";
import { useAuth } from "./contexts/authContext";

const ProtectedRoute = ({ children }) => {
  const { userLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  return userLoggedIn ? children : <Navigate to="/login" replace />;
};

function App() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/verify-email",
      element: <VerificationEmailMessage />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
    },
  ];
  let routesElement = useRoutes(routesArray);
  return (
    <AuthProvider>
      <div className="bg-[#111111]">{routesElement}</div>
    </AuthProvider>
  );
}

export default App;
