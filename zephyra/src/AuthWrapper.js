import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import App from "./App";

const AuthWrapper = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      loginWithRedirect();
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);
  
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated && !isLoading ? <App /> : null;
};

export default AuthWrapper;
