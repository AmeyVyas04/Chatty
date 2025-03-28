import React, { useState } from "react";
import { toast } from "react-hot-toast";
import Footer from "./Footer";
import { useauthstore } from "../store/authStore";
import { Eye, EyeOff, Loader2, Mail, MessageSquare, User, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Link } from "react-router-dom";
function Signup() {
  const [showpassword, setshowpassword] = useState(false);
  const [formdata, setformdata] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { signup, issignup } = useauthstore();
  const navigate = useNavigate(); // ✅ Initialize navigate

  // Validation function
  const validateform = () => {
    if (!formdata.name.trim()) {
      toast.error("Name is required.");
      return false;
    }
    if (!formdata.email.trim()) {
      toast.error("Email is required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formdata.email)) {
      toast.error("Invalid email format.");
      return false;
    }
    if (!formdata.password) {
      toast.error("Password is required.");
      return false;
    }
    if (formdata.password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return false;
    }
    return true;
  };

  const handleFunction = async (e) => {
    e.preventDefault();

    if (!validateform()) return;

    try {
      await signup(formdata); // ✅ Ensure signup is awaited
      toast.success("Signup successful! Redirecting..."); // ✅ Show success message
      setTimeout(() => {
        console.log("Navigating to /"); // ✅ Debugging
        navigate("/"); // Ensure navigation happens
      }, 1000);
    } catch (error) {
      console.error("Signup failed:", error);
    toast.error("Signup failed! Please try again.");
    }
  };

  return (
    <>
      {/* Navbar Start */}
      <div className="navbar bg-base-100 shadow-2xl h-14">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" href="/">Chatting App</a>
        </div>
        <div className="flex gap-2">
  <Link to="/signup">
    <button className="btn btn-soft btn-primary border-none bg-white hover:bg-purple-900 mr-10">
      Signup
    </button>
  </Link>
</div>
      </div>
      {/* Navbar End */}

      <div className="min-h-screen lg:grid-cols-2">
        <div className="flex flex-col justify-center items-center p-6 sm:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* LOGO */}
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-2 group">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center 
                  group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="size-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold mt-2">Create Account</h1>
                <p className="text-base-content/60">Get started with your free account</p>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleFunction} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Full Name</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="text"
                    className="input input-bordered w-full pl-10"
                    placeholder="John Doe"
                    value={formdata.name}
                    onChange={(e) => setformdata({ ...formdata, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type="email"
                    className="input input-bordered w-full pl-10"
                    placeholder="you@example.com"
                    value={formdata.email}
                    onChange={(e) => setformdata({ ...formdata, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="size-5 text-base-content/40" />
                  </div>
                  <input
                    type={showpassword ? "text" : "password"}
                    className="input input-bordered w-full pl-10"
                    placeholder="••••••••"
                    value={formdata.password}
                    autoComplete="current-password"  
                    onChange={(e) => setformdata({ ...formdata, password: e.target.value })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setshowpassword(!showpassword)}
                  >
                    {showpassword ? (
                      <EyeOff className="size-5 text-base-content/40" />
                    ) : (
                      <Eye className="size-5 text-base-content/40" />
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={issignup}>
                {issignup ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="text-center">
              <p className="text-base-content/60">
                Already have an account?{" "}
                <Link to="/login" className="link link-primary">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Signup;
