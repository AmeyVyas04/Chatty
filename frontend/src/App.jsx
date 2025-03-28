import Home from "../Home/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Setting from "./components/Setting";
import Profile from "./components/Profile";
import { Routes, Route, Navigate } from "react-router-dom";
import { useauthstore } from "./store/authStore";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useThemeStore } from "./store/useThemeStore";


export default function App() {
  const { authuser, checkAuth, ischeckingauth,online } = useauthstore();
  const { theme } = useThemeStore(); // ✅ Fix Zustand parentheses

  console.log(online)
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authuser });

  // ✅ Fix: Show loader while checking authentication
  if (ischeckingauth && !authuser) {
    return <LoaderCircle className="size-10 animate-spin mx-auto my-10" />;
  }

  return (
    <>
      <div data-theme={theme}> {/* ✅ Fix typo: data-theam → data-theme */}
        <Routes>
          <Route path="/" element={authuser ? <Home /> : <Navigate to={"/login"} />} />
          <Route path="/signup" element={!authuser ? <Signup /> : <Navigate to={"/"} />} />
          <Route path="/login" element={!authuser ? <Login /> : <Navigate to={"/"} />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/profile" element={authuser ? <Profile /> : <Navigate to={"/login"} />} />
        </Routes>

        <Toaster />
      </div>
    </>
  );
}
