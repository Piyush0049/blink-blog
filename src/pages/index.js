"use client";
import Link from "next/link";
import React from "react";
import { PenTool } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function Home() {
  return (
    <main
      className={`min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden ${inter.className}`}
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/90 z-0" />

      <div className="absolute top-24 left-10 w-48 h-48 bg-teal-400/30 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-24 right-10 w-72 h-72 bg-sky-500/30 rounded-full blur-3xl animate-float-slower" />

      <div className="relative z-10 max-w-3xl px-8 py-14 text-center space-y-8 animate-fadeIn  rounded-3xl ">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-50 to-sky-300 tracking-tight leading-tight animate-float-up">
          Blink &amp; Blog
        </h1>

        <p className="text-lg md:text-xl text-gray-200 max-w-xl mx-auto leading-relaxed animate-float-delay">
          Share your thoughts, inspire others, and create your own blogging journey.
        </p>

        <div className="flex items-center justify-center gap-3 text-gray-100 text-base md:text-lg animate-float-slower">
          <PenTool className="w-6 h-6 text-teal-400" />
          <span>Start writing your first blog today</span>
        </div>

        <Link href="/signup" passHref>
          <button className="mt-6 px-4 py-2 rounded-2xl font-semibold text-lg bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-300 animate-float-up">
            Get Started ✨
          </button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease forwards;
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-float-up {
          animation: floatUp 4s ease-in-out infinite;
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }
        @keyframes floatSlower {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-8px) translateX(-6px); }
        }
        .animate-float-slower {
          animation: floatSlower 12s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: floatUp 5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </main>
  );
}
