import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/sign-in", element: <SignInPage /> },
  { path: "/sign-in/*", element: <SignInPage /> },
  { path: "/sign-up", element: <SignUpPage /> },
  { path: "/sign-up/*", element: <SignUpPage /> },
  { path: "/app", element: <Dashboard /> },
]);
