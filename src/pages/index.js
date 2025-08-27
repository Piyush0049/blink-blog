"use client";
import Link from "next/link";
import React from "react";
import { PenTool } from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "600", "700"] });

export default function Home() {
  return (
    <main
      className={`min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden ${inter.className} px-2 sm:px-0`}
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80 z-0 backdrop-blur-[1.5px]" />

      <div className="absolute top-20 left-4 sm:left-10 w-36 h-36 sm:w-56 sm:h-56 bg-teal-400/30 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute bottom-20 right-4 sm:right-10 w-56 h-56 sm:w-80 sm:h-80 bg-sky-500/25 rounded-full blur-3xl animate-float-slower" />

      <div className="relative z-10 w-full max-w-3xl px-6 sm:px-10 py-12 sm:py-16 text-center space-y-8 sm:space-y-10 rounded-3xl border border-white/20 backdrop-blur-sm shadow-xl animate-fadeIn">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-cyan-100 to-sky-400 tracking-tight leading-tight animate-float-up drop-shadow">
          Blink &amp; Blog
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-100 max-w-xl mx-auto leading-relaxed font-medium animate-float-delay drop-shadow">
          Share your thoughts, inspire others, and create your own beautiful blogging journey.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-sky-100 text-sm sm:text-base animate-float-slower">
          <PenTool className="w-5 h-5 sm:w-6 sm:h-6 text-teal-300" strokeWidth={2.2} />
          <span>Start writing your first blog today</span>
        </div>

        <Link href="/signup" passHref>
          <button className="group mt-6 sm:mt-8 px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-semibold text-base sm:text-lg bg-gradient-to-r from-teal-500 to-sky-600 text-white shadow-lg border border-white/10 transition-all hover:scale-105 hover:shadow-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-teal-300 relative overflow-hidden">
            <span className="relative z-10">Get Started ✨</span>
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-teal-400/40 via-sky-400/20 to-teal-300/40 blur-xl opacity-0 group-hover:opacity-60 transition-all" />
          </button>
        </Link>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1.1s cubic-bezier(.39,.58,.57,1) both;
        }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-up {
          animation: floatUp 4s ease-in-out infinite;
        }

        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-14px) translateX(8px); }
        }
        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }

        @keyframes floatSlower {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-11px) translateX(-9px); }
        }
        .animate-float-slower {
          animation: floatSlower 13s ease-in-out infinite;
        }

        .animate-float-delay {
          animation: floatUp 4.8s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
