"use client";
import React from "react";
import { motion } from "framer-motion";

export default function BlogGrid({ blogs, router, tag }) {
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
