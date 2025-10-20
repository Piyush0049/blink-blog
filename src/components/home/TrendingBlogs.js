"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function TrendingBlogs({ blogs, currentPage, setCurrentPage, router }) {
  return (
    <div className="relative mb-12 sm:mb-20">
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
                  <div className="overflow-hidden relative h-[180px] sm:h-[200px]">
                    <Image
                      src={blog.media.url}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
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
