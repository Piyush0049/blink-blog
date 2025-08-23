"use client";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Flame, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/header";


export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isHovered, setIsHovered] = useState(null);
  const articlesRef = useRef(null);
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


  const scroll = (direction, ref) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -320 : 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-white font-sans text-gray-800 relative ">
      <Head>
        <title>Blink & Blog</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Floating gradient blobs */}
      <div className="fixed top-20 left-10 w-60 h-60 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full opacity-20 blur-3xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-sky-400 to-indigo-400 rounded-full opacity-20 blur-3xl animate-float-slower pointer-events-none" />

      <div className="max-w-7xl mx-auto p-4 sm:px-8">
        {/* Header */}
        <Header />

        {/* Hero Section */}
        <main className={`${windowWidth > 1220 ? "flex gap-8" : ""} mb-16`}>
          <div className="flex-1 rounded-2xl overflow-hidden shadow-xl relative group pt-2">
            <img
              src="https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg"
              alt="Hero"
              className="w-full h-[400px] object-cover rounded-2xl transform group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
              <h1 className="text-3xl md:text-3xl font-semibold text-white drop-shadow-lg">
                Blink & Blog — Every Story is a Voice
              </h1>
              <p className="text-gray-200 mt-2 text-base md:text-lg">
                Read, share, and create blogs that inspire.
              </p>
              <button
                onClick={() => router.push("/writeblog")}
                className="mt-5 w-max bg-teal-500 hover:bg-teal-600 text-white px-6 py-2.5 rounded-full font-medium text-base shadow-md transition-transform hover:scale-105"
              >
                Get Started →
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="flex-1  md:mt-0 bg-white/80 backdrop-blur-xl rounded-2xl p-6 flex flex-col justify-center text-gray-900 shadow-lg border border-white/40">
            <h2 className="text-2xl font-semibold mb-3 text-teal-700">About Us</h2>
            <p className="text-base leading-relaxed">
              At <span className="font-semibold text-teal-600">Blink & Blog</span>,
              we provide a simple, elegant platform where ideas thrive.
              Explore topics, enjoy visuals, and share your thoughts with the world.
              Privacy and security are always our top priority.
            </p>
          </aside>
        </main>

        {/* Featured Blogs */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <Star className="text-yellow-500" />
            <h2 className="text-teal-700 text-2xl font-semibold">Featured Blogs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.slice(0, 3).map((blog, index) => (
              <article
                key={blog._id || index}
                onClick={() => router.push(`/${blog._id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="overflow-hidden">
                  <img
                    src={blog.media.url}
                    alt={blog.title}
                    className="h-[200px] w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{blog.title}</h3>
                  <p className="text-gray-500 text-xs mt-2">🌟 Featured Story</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Trending Blogs */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <Flame className="text-red-500" />
            <h2 id="exploreSection" className="text-teal-700 text-2xl font-semibold">
              Trending Blogs
            </h2>
          </div>

          <div className="relative">
            {/* Navigation Buttons */}
            <div className="flex justify-between mb-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="bg-white shadow-md p-2 rounded-full hover:bg-teal-500 hover:text-white transition disabled:opacity-40"
              >
                <ArrowLeft />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < Math.ceil(blogs.length / 3) - 1 ? prev + 1 : prev
                  )
                }
                disabled={currentPage >= Math.ceil(blogs.length / 3) - 1}
                className="bg-white shadow-md p-2 rounded-full hover:bg-teal-500 hover:text-white transition disabled:opacity-40"
              >
                <ArrowRight />
              </button>
            </div>

            {/* Animated Grid of Blogs */}
            <div className="relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage} // important for re-render animation
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {blogs.slice(currentPage * 3, currentPage * 3 + 3).map((blog, index) => (
                    <article
                      key={blog._id || index}
                      onClick={() => router.push(`/${blog._id}`)}
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                    >
                      <div className="overflow-hidden rounded-t-2xl">
                        <img
                          src={blog.media.url}
                          alt={blog.title}
                          className="h-[180px] w-full object-cover transition-transform duration-500 hover:scale-110"
                        />
                      </div>
                      <h3 className="p-4 text-gray-800 font-medium text-base line-clamp-2">
                        {blog.title}
                      </h3>
                    </article>
                  ))}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>


        {/* Latest Blogs */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <Clock className="text-blue-500" />
            <h2 className="text-teal-700 text-2xl font-semibold">Latest Blogs</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.slice(-6).map((blog, index) => (
              <article
                key={blog._id || index}
                onClick={() => router.push(`/${blog._id}`)}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="overflow-hidden rounded-t-2xl">
                  <img
                    src={blog.media.url}
                    alt={blog.title}
                    className="h-[180px] w-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-gray-500 text-xs mt-2">🆕 Recently Added</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* Floating animation keyframes */}
      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(15px); }
        }
        @keyframes floatSlower {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-15px) translateX(-15px); }
        }
        .animate-float-slow { animation: floatSlow 8s ease-in-out infinite; }
        .animate-float-slower { animation: floatSlower 12s ease-in-out infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
