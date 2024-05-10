import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "remixicon/fonts/remixicon.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext";
import {disableReactDevTools} from '@fvilers/disable-react-devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Modal from 'react-modal';
if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}
Modal.setAppElement('#root');
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
    <BrowserRouter>
  <GoogleOAuthProvider clientId="720893402951-pvu4j8eoqsrlb8620ihm36llmu81up31.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
    </BrowserRouter>
    </AuthContextProvider>
  </React.StrictMode>
);
