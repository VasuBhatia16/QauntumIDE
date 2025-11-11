import "../styles/Auth.css";
import Navbar from "../components/Navbar";
import { SignUp } from "@clerk/clerk-react";

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <Navbar />

      <div className="auth-box">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-subtitle">Sign up with Google, GitHub, or Email</p>

        <div className="auth-container">
          <SignUp
            routing="path"
            path="/sign-up"
            redirectUrl="/app"
            appearance={{
  elements: {
    formButtonPrimary: "auth-btn-primary",
    socialButtonsBlockButton: "auth-btn-social",
    card: "auth-card",
    input: "auth-input", 
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
