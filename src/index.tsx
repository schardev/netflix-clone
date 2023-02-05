import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/global.scss";
import App from "./_app";

ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
