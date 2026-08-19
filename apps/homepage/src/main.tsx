import React from "react";
import ReactDOM from "react-dom/client";
import SiteRouter from "./SiteRouter";
import "./styles/globals.css";
import "./styles/app-shell.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SiteRouter />
  </React.StrictMode>,
);
