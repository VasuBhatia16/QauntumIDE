import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ClerkProvider } from "@clerk/clerk-react";
import "./index.css";

const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!pk) throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={pk}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
