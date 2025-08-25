"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Star,
  Flame,
  Clock,
  ArrowLeft,
  ArrowRight,
  PenTool,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/header";

export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [windowWidth, setWindowWidth] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/api/allblogsroute");
      if (res.status === 200) {
        setBlogs(res.data.blogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-white font-sans text-gray-800 relative">
      {/* Floating Gradients */}
      <div className="fixed top-20 left-10 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full opacity-20 blur-3xl animate-float-slower pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <Header />

        {/* Hero Section */}
        <main
          className={`${
            windowWidth > 1220 ? "flex gap-8" : ""
          } mb-16 mt-6 items-center`}
        >
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

          <aside className="flex-1 mt-6 md:mt-0 bg-white/70 backdrop-blur-xl rounded-2xl p-5 sm:p-8 shadow-lg border border-white/40 hover:shadow-2xl transition">
            <h2 className="text-xl sm:text-3xl font-semibold mb-3 sm:mb-4 bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent">
              About Us
            </h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-700">
              At{" "}
              <span className="font-semibold text-teal-600">Blink & Blog</span>,
              your words matter. Write stories, inspire others, and connect with
              a like-minded community. Creativity, Security, Connection — that’s
              our promise.
            </p>
          </aside>
        </main>

        {/* Sections */}
        <SectionHeader
          icon={<Star className="text-teal-500" />}
          title="Featured Blogs"
          gradient="from-teal-500 to-teal-400"
        />
        <BlogGrid
          blogs={blogs.slice(0, 3)}
          router={router}
          tag={<Star size={14} className="inline text-teal-500" />}
        />

        <SectionHeader
          icon={<Flame className="text-orange-500" />}
          title="Trending Blogs"
          gradient="from-orange-500 to-yellow-400"
        />
        <TrendingBlogs
          blogs={blogs}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          router={router}
        />

        <SectionHeader
          icon={<Clock className="text-sky-500" />}
          title="Latest Blogs"
          gradient="from-sky-500 to-cyan-400"
        />
        <BlogGrid
          blogs={blogs.slice(-6)}
          router={router}
          tag={<Clock size={14} className="inline text-sky-500" />}
        />
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes floatSlow {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-20px) translateX(15px);
          }
        }
        @keyframes floatSlower {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-15px) translateX(-15px);
          }
        }
        .animate-float-slow {
          animation: floatSlow 8s ease-in-out infinite;
        }
        .animate-float-slower {
          animation: floatSlower 12s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function SectionHeader({ icon, title, gradient = "from-teal-600 to-sky-600" }) {
  return (
    <div className="mb-6 sm:mb-10">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        {icon}
        <h2
          className={`text-xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
        >
          {title}
        </h2>
      </div>
      <div className="h-1 w-20 sm:w-28 bg-gradient-to-r from-teal-200 to-teal-100 rounded-full mb-4 sm:mb-6" />
    </div>
  );
}

function BlogGrid({ blogs, router, tag }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
      {blogs.map((blog, index) => (
        <motion.article
          whileHover={{ scale: 1.04, y: -5 }}
          whileTap={{ scale: 0.97 }}
          key={blog._id || index}
          onClick={() => router.push(`/blog/${blog._id}`)}
          className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer transition-all duration-500 group relative"
        >
          <div className="overflow-hidden relative">
            <img
              src={blog.media.url}
              alt={blog.title}
              className="h-[180px] sm:h-[200px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          <div className="p-4 sm:p-5">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300">
              {blog.title}
            </h3>
            {tag && (
              <p className="text-gray-500 text-xs sm:text-sm mt-2 flex items-center gap-1">
                {tag} Blog
              </p>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
}

function TrendingBlogs({ blogs, currentPage, setCurrentPage, router }) {
  return (
    <div className="relative mb-12 sm:mb-20">
      {/* Controls */}
      <div className="flex justify-between mb-4 sm:mb-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className="bg-white shadow-lg p-2 sm:p-3 rounded-full hover:bg-orange-500 hover:text-white transition disabled:opacity-40"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(blogs.length / 3) - 1 ? prev + 1 : prev
            )
          }
          disabled={currentPage >= Math.ceil(blogs.length / 3) - 1}
          className="bg-white shadow-lg p-2 sm:p-3 rounded-full hover:bg-orange-500 hover:text-white transition disabled:opacity-40"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Blog Cards */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {blogs
              .slice(currentPage * 3, currentPage * 3 + 3)
              .map((blog, index) => (
                <motion.article
                  whileHover={{ scale: 1.04, y: -5 }}
                  whileTap={{ scale: 0.97 }}
                  key={blog._id || index}
                  onClick={() => router.push(`/blog/${blog._id}`)}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-md hover:shadow-2xl cursor-pointer overflow-hidden transition-all duration-500 group relative"
                >
                  <div className="overflow-hidden relative">
                    <img
                      src={blog.media.url}
                      alt={blog.title}
                      className="h-[180px] sm:h-[200px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                  <h3 className="p-4 sm:p-5 text-gray-800 font-semibold text-sm sm:text-base line-clamp-2 group-hover:text-orange-500 transition-colors duration-300">
                    {blog.title}
                  </h3>
                </motion.article>
              ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
