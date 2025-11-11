import "../styles/Auth.css";
import Navbar from "../components/Navbar";
import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-box">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Sign in to continue</p>

        <div className="auth-container">
          <SignIn
            routing="path"
            path="/sign-in"
            redirectUrl="/app"
            appearance={{
  elements: {
    formButtonPrimary: "auth-btn-primary",
    socialButtonsBlockButton: "auth-btn-social",
    card: "auth-card",
    input: "auth-input", // new
  },
  variables: {
    colorPrimary: "#6366f1",
    colorText: "#ffffff",
    colorInputText: "#ffffff",
    colorBackground: "#0f172a",
    colorInputBackground: "#141a2b",
    borderRadius: "8px"
  },
}}

          />
        </div>
      </div>
    </div>
  );
}
