import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ContentProvider } from "./components/context/content.context.jsx";
import { UserProvider } from "./components/context/user.context.jsx";
import "./index.scss";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <UserProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </UserProvider>
  </BrowserRouter>
);
