import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";

import App from "./App";
import { SkyOpsProvider } from "./context/SkyOpsContext";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <SkyOpsProvider>
        <App />
      </SkyOpsProvider>
    </HashRouter>
  </React.StrictMode>
);