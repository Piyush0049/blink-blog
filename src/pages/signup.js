"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast"; // 👈 import toast

export default function Signuppage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowcPassword] = useState(false);

  // ✅ Normal signup with email/password
  const signup = async (e) => {
    e.preventDefault();
    if (user.password !== user.cpassword) {
      toast.error("Passwords do not match ❌");
      return;
    }
    try {
      const res = await axios.post("/api/signuproute", {
        name: user.name,
        email: user.email,
        password: user.password,
      });
      if (res.status === 201) {
        toast.success("Account created successfully 🎉");
        window.location.reload();
        router.push("/home");
      } else {
        toast.error(res.data.message || "Signup failed");
      }
    } catch (err) {
      toast.error("An error occurred during signup ⚠️");
    }
  };

  // ✅ Google signup
  const handleGoogleSignup = () => {
    toast.loading("Redirecting to Google... ⏳");
    signIn("google", { callbackUrl: "/home" });
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen font-[Poppins] bg-black/70">
      {/* Background blurred image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-50 blur-sm -z-10"
        style={{
          backgroundImage:
            "url('https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg')",
        }}
      />

      {/* Header */}
      <h1 className="text-center text-[#d0fdfa] text-3xl sm:text-4xl font-extrabold drop-shadow-xl mb-6 animate-fadeIn">
        Create Your Account
      </h1>

      {/* Signup Form */}
      <form
        onSubmit={signup}
        className="bg-white/10 backdrop-blur-xl shadow-2xl rounded-2xl w-[90%] max-w-md p-8 flex flex-col gap-5 animate-slideIn"
      >
        {/* Name */}
        <input
          placeholder="Username"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          required
          className="w-full text-white placeholder-gray-300 bg-transparent border border-teal-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-300 rounded-lg px-4 py-3 outline-none transition-all"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
          className="w-full text-white placeholder-gray-300 bg-transparent border border-teal-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-300 rounded-lg px-4 py-3 outline-none transition-all"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            required
            className="w-full text-white placeholder-gray-300 bg-transparent border border-teal-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-300 rounded-lg px-4 py-3 outline-none transition-all"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-200 hover:text-white"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showcPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={user.cpassword}
            onChange={(e) => setUser({ ...user, cpassword: e.target.value })}
            required
            className="w-full text-white placeholder-gray-300 bg-transparent border border-teal-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-300 rounded-lg px-4 py-3 outline-none transition-all"
          />
          <span
            onClick={() => setShowcPassword(!showcPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-200 hover:text-white"
          >
            {showcPassword ? <VisibilityOff /> : <Visibility />}
          </span>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white text-lg font-semibold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Signup
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-grow h-px bg-gray-500/50"></div>
          <span className="text-gray-300 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-500/50"></div>
        </div>

        {/* Google Signup */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="flex items-center justify-center gap-3 w-full border border-gray-400 text-gray-100 font-medium py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-transform transform hover:scale-105"
        >
          <GoogleIcon className="text-red-500" />
          <span>Sign up with Google</span>
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-gray-200 text-sm sm:text-base">
        Already have an account?
        <Link href="/login" className="ml-1 text-sky-400 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
