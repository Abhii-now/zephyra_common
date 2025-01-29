import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import AuthWrapper from "./AuthWrapper";
import { store } from "app/store";
import { Provider } from "react-redux";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <Router>
    <Provider store={store}>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH0_DOMAIN}
        clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: "http://127.0.0.1:8000/",
          scope:
            "edit:details view:details read:users read:current_user update:current_user_metadata",
          // prompt: "select_account",
        }}
      >
        <AuthWrapper />
      </Auth0Provider>
    </Provider>
  </Router>
  // </React.StrictMode>
);

reportWebVitals();
