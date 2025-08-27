"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Star, Heart, Clock } from "lucide-react";

import Header from "@/components/header";
import HeroSection from "@/components/home/HeroSection";
import SectionHeader from "@/components/home/SectionHeader";
import BlogGrid from "@/components/home/BlogGrid";

export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [userInterests, setUserInterests] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      // ✅ Fetch user details (interests)
      const userRes = await axios.get("/api/me");
      const interests = userRes?.data?.interests || [];
      setUserInterests(interests);

      // ✅ Fetch blogs
      const blogRes = await axios.get("/api/allblogsroute");
      if (blogRes.status === 200) {
        const allBlogs = blogRes.data.blogs;

        // ✅ Sort: interest blogs first, then latest
        const sortedBlogs = allBlogs.sort((a, b) => {
          const aInterest = interests.includes(a.category) ? 1 : 0;
          const bInterest = interests.includes(b.category) ? 1 : 0;

          if (aInterest !== bInterest) return bInterest - aInterest;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setBlogs(sortedBlogs);
      }
    } catch (error) {
      console.error("Error fetching blogs:", error);
    }
  };

  // ✅ Filter blogs based on interests only
  const interestBlogs = blogs.filter((blog) =>
    userInterests.includes(blog.category)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-white font-sans text-gray-800 relative">
      {/* Floating Gradients */}
      <div className="fixed top-20 left-10 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full opacity-20 blur-3xl animate-float-slower pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <Header />

        {/* Hero */}
        <HeroSection router={router} />

        {/* Featured Blogs */}
        <SectionHeader
          icon={<Star className="text-teal-500" />}
          title="Featured Blogs"
          gradient="from-teal-500 to-teal-400"
        />
        <BlogGrid blogs={blogs.slice(0, 3)} router={router} tag="Featured" />

        {/* Recommended Blogs (User Interests) */}
        {interestBlogs.length > 0 && (
          <>
            <SectionHeader
              icon={<Heart className="text-rose-500" />}
              title="Recommended For You"
              gradient="from-rose-500 to-pink-400"
            />
            <BlogGrid
              blogs={interestBlogs.slice(0, 6)}
              router={router}
              tag="Recommended"
            />
          </>
        )}

        {/* Latest Blogs */}
        <SectionHeader
          icon={<Clock className="text-sky-500" />}
          title="Latest Blogs"
          gradient="from-sky-500 to-cyan-400"
        />
        <BlogGrid blogs={blogs.slice(0, 6)} router={router} tag="Latest" />
      </div>

      {/* Floating Animations */}
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
      `}</style>
    </div>
  );
}
