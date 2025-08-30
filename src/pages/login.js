"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import axios from "axios";
import { signIn } from "next-auth/react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/loginroute", user);
      console.log(res); 
      if (res.status === 200) {
        localStorage.setItem("token", res.data.user.token);
        toast.success("Login successful! 🎉");
        router.push("/Home");
      } else {
        toast.error("Login failed, please try again.");
      }
    } catch {
      toast.error("An error occurred. Please try again.");
    }
  };

  const handleGoogleLogin = () => {
    toast.loading("Redirecting to Google...");
    signIn("google", {
      callbackUrl: `${window.location.origin}/Home`,
      redirect: true,
    });
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
        Login to Your Account
      </h1>

      {/* Glass Card */}
      <form
        onSubmit={login}
        className="relative w-[90%] max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col gap-5 p-8 z-10 animate-slideIn"
      >
        {/* Email Input */}
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          required
          className="w-full text-white placeholder-gray-300 bg-transparent border border-teal-300 focus:border-teal-400 focus:ring-2 focus:ring-teal-300 rounded-lg px-4 py-3 outline-none transition-all"
        />

        {/* Password Input */}
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

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-teal-400 to-green-500 hover:from-teal-500 hover:to-green-600 text-white text-lg font-semibold py-3 rounded-lg shadow-lg transition-transform transform hover:scale-105"
        >
          Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-2">
          <div className="flex-grow h-px bg-gray-500/50"></div>
          <span className="text-gray-300 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-500/50"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-3 w-full border border-gray-400 text-gray-100 font-medium py-3 rounded-lg bg-white/5 hover:bg-white/10 transition-transform transform hover:scale-105"
        >
          <GoogleIcon className="text-red-500" />
          <span>Login with Google</span>
        </button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-gray-200 text-sm sm:text-base">
        Don’t have an account?
        <Link href="/signup" className="ml-1 text-sky-400 hover:underline">
          Sign up
        </Link>
      </p>

      {/* Small animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        .animate-slideIn {
          animation: slideIn 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}
