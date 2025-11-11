import "../styles/Navbar.css";
import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

export default function Navbar() {
  return (
    <nav className="navbar-container">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">QuantumIDE</Link>
      </div>

      <div className="navbar-right">
        <SignedOut>
          <Link to="/sign-in" className="nav-link">Sign In</Link>
          <Link to="/sign-up" className="nav-btn">Get Started</Link>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
