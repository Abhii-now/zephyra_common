import "./App.css";
import FileUpload from "./components/FileUpload/FileUpload";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import FileDownload from "components/FileDownload/FileDownload";
import AlertNotification from "AlertNotification";
import { useAuth0 } from "@auth0/auth0-react";
import { setAccessToken, setUserToken } from "features/auth/authSlice";
import { useDispatch } from "react-redux";
import FileView from "components/FileView/FileView";
import FileGrid from "FileGrid/FileGrid";
import { fetchMetaData, fetchUserToken } from "utils/authUtil";
import { Button } from "react-bootstrap";

function App() {
  const {
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
    user,
    isAuthenticated,
  } = useAuth0();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [permissions, setPermissions] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const getUserMetadata = async () => {
      try {
        const data = await fetchUserToken();
        const userToken = data.access_token;
        dispatch(setUserToken(userToken));
        const token = await getAccessTokenSilently();
        const metadata = await fetchMetaData(userToken, user.sub);
        setUserData(metadata);
        setPermissions(metadata.app_metadata.roles);
        dispatch(setAccessToken(token));
        if (userToken) setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUserMetadata();
  }, [getAccessTokenSilently, dispatch, isAuthenticated, user]);
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <div className="App">
        <AlertNotification />

        <Routes>
          <Route
            path="/:token"
            element={<FileView fileData={undefined} userData={userData} />}
          />
          <Route
            path="/"
            element={
              <>
                {permissions.includes("Regular User") && <FileDownload />}
                {permissions.includes("Regular User") && <FileUpload />}
                {permissions.includes("Regular User") && <FileGrid />}
              </>
            }
          />
        </Routes>
        <div className="login-logout">
          {!isAuthenticated ? (
            <Button onClick={() => loginWithRedirect()}>Login</Button>
          ) : (
            <Button onClick={() => logout()}>Logout</Button>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
