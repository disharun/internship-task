import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App";

// Support both React 18+ (react-dom/client) and older react-dom versions (v17)
// Try to use the new createRoot API; fall back to ReactDOM.render when
// 'react-dom/client' is not available (e.g., older installs on some CI/envs).
try {
  // Dynamically require to avoid build-time resolution errors when the
  // module doesn't exist on the environment.
  // eslint-disable-next-line global-require
  const { createRoot } = require("react-dom/client");
  const root = createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
} catch (e) {
  // Fallback for environments with react-dom v17 where 'react-dom/client'
  // does not exist.
  // eslint-disable-next-line global-require
  const ReactDOM = require("react-dom");
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
  );
}
