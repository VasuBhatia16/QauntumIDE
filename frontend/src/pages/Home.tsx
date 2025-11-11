import "../styles/Home.css";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div className="home-page">
      <Navbar />

      <section className="home-hero">
        <h1 className="home-title">Code at Lightspeed</h1>
        <p className="home-subtitle">
          QuantumIDE — A Modern, AI-powered Online Code Editor
        </p>

        <div className="home-actions">
          <SignedOut>
            <Link to="/sign-up" className="home-btn-primary">Get Started</Link>
            <Link to="/sign-in" className="home-btn-secondary">Sign In</Link>
          </SignedOut>

          <SignedIn>
            <Link to="/app" className="home-btn-primary">Open Workspace</Link>
          </SignedIn>
        </div>
      </section>
    </div>
  );
}
