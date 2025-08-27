"use client";
import React from "react";
import { motion } from "framer-motion";

export default function BlogGrid({ blogs, router, tag, userInterests = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
      {blogs.map((blog, index) => {
        // ✅ Check if any blog tag matches user interests
        const isRecommended =
          blog.tags?.some((t) => userInterests.includes(t)) || false;

        return (
          <motion.article
            whileHover={{ scale: 1.04, y: -5 }}
            whileTap={{ scale: 0.97 }}
            key={blog._id || index}
            onClick={() => router.push(`/blog/${blog._id}`)}
            className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-2xl cursor-pointer transition-all duration-500 group relative"
          >
            {/* Thumbnail */}
            <div className="overflow-hidden relative">
              <img
                src={blog.media.url}
                alt={blog.title}
                className="h-[180px] sm:h-[200px] w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* ✅ Recommended Badge */}
              {isRecommended && (
                <span className="absolute top-3 right-3 bg-green-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md">
                  Recommended
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-4 sm:p-5">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300">
                {blog.title}
              </h3>

              {/* Show passed tag (if provided) */}
              {tag && (
                <p className="text-gray-500 text-xs sm:text-sm mt-2 flex items-center gap-1">
                  {tag} Blog
                </p>
              )}

              {/* Show blog tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {blog.tags.map((t, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-700 font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}
