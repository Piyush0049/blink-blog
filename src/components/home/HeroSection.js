"use client";
import { motion } from "framer-motion";
import { PenTool, Users, Shield, Sparkles } from "lucide-react";
import Image from "next/image";

export default function HeroSection({ router }) {
  return (
    <main className="flex flex-col lg:flex-row gap-8 mb-16 mt-6 items-center">
      <div className="w-full lg:flex-1 relative rounded-2xl overflow-hidden group shadow-xl h-[250px] sm:h-[420px]">
        <Image
          src="https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg"
          alt="Hero"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transform group-hover:scale-110 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col justify-end p-4 sm:p-8 z-10">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            className="text-xl sm:text-3xl md:text-3xl font-bold text-white mb-2 sm:mb-4 drop-shadow-xl"
          >
            Blink & Blog —{" "}
            <span className="bg-gradient-to-r from-teal-400 to-sky-400 bg-clip-text text-transparent">
              Every Story is a Voice
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.2 }}
            className="text-gray-200 text-sm sm:text-base mb-4 sm:mb-6 max-w-xl"
          >
            Read, share, and create blogs that shape the world. Join a vibrant
            community where your voice matters.
          </motion.p>

          <button
            onClick={() => router.push("/writeblog")}
            className="bg-black/10 backdrop-blur-sm hover:bg-black/30 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2 border border-white/30 w-fit"
          >
            <PenTool size={16} /> Start Writing
          </button>
        </div>
      </div>

      <aside className="w-full lg:flex-1 bg-white/80 backdrop-blur-xl rounded-2xl p-5 sm:p-8 shadow-xs hover:shadow-xs transition transform hover:-translate-y-1">
        <h2 className="text-xl sm:text-3xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
          About Us
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-gray-700 mb-4">
          At <span className="font-semibold text-teal-600">Blink & Blog</span>,
          your words matter. Write stories, inspire others, and connect with a
          like-minded community.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <Sparkles className="text-teal-500 w-4 h-4 sm:w-5 sm:h-5" />
            <span>Creativity</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Shield className="text-sky-500 w-4 h-4 sm:w-5 sm:h-5" />
            <span>Security</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Users className="text-rose-500 w-4 h-4 sm:w-5 sm:h-5" />
            <span>Connection</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
