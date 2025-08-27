"use client";
import { motion } from "framer-motion";
import { PenTool } from "lucide-react";

export default function HeroSection({ router }) {
  return (
    <main className="flex flex-col lg:flex-row gap-8 mb-16 mt-6 items-center">
      <div className="flex-1 relative rounded-2xl overflow-hidden group shadow-xl">
        <img
          src="https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg"
          alt="Hero"
          className="w-full h-[250px] sm:h-[420px] object-cover transform group-hover:scale-110 transition duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-4 sm:p-8">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-4 drop-shadow-xl"
          >
            Blink & Blog — Every Story is a Voice
          </motion.h1>
          <p className="text-gray-200 text-sm sm:text-lg mb-4 sm:mb-6 max-w-xl">
            Read, share, and create blogs that shape the world.
          </p>
          <button
            onClick={() => router.push("/writeblog")}
            className="bg-black/40 backdrop-blur-sm hover:bg-black/60 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-sm sm:text-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2 border border-white/30"
          >
            <PenTool size={16} /> Start Writing
          </button>
        </div>
      </div>

      <aside className="flex-1 bg-white/70 backdrop-blur-xl rounded-2xl p-5 sm:p-8 shadow-lg border border-white/40 hover:shadow-2xl transition">
        <h2 className="text-xl sm:text-3xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
          About Us
        </h2>
        <p className="text-sm sm:text-base leading-relaxed text-gray-700">
          At <span className="font-semibold text-teal-600">Blink & Blog</span>,
          your words matter. Write stories, inspire others, and connect with
          a like-minded community. Creativity, Security, Connection — that’s
          our promise.
        </p>
      </aside>
    </main>
  );
}
