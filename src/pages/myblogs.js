"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PenTool } from "lucide-react";
import Header from "@/components/header";
import Image from "next/image";

export default function MyBlogs() {
    const router = useRouter();
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyBlogs();
    }, []);

    const fetchMyBlogs = async () => {
        try {
            const res = await axios.get("/api/myblogsroute");
            if (res.status === 200) {
                setBlogs(res.data);
                console.log(res.data);
            }
        } catch (error) {
            console.error("Error fetching my blogs:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-white font-sans text-gray-800 relative overflow-hidden">

            {/* Background blobs */}
            <div className="fixed top-20 left-10 w-56 h-56 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-float-slow pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full opacity-20 blur-3xl animate-float-slower pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
                <Header />

                <main className="mt-12">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : blogs.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-600 text-lg mb-4">
                                You haven&apos;t published any blogs yet.
                            </p>
                            <button
                                onClick={() => router.push("/writeblog")}
                                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-full font-medium text-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2 mx-auto"
                            >
                                <PenTool size={18} /> Write Your First Blog
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                            {blogs.map((blog, index) => (
                                <motion.article
                                    whileHover={{ scale: 1.04, y: -5 }}
                                    whileTap={{ scale: 0.97 }}
                                    key={blog._id || index}
                                    className="bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 group relative flex flex-col"
                                >
                                    {/* Blog Image */}
                                    <div
                                        className="overflow-hidden relative cursor-pointer h-[200px]"
                                        onClick={() => router.push(`/blog/${blog._id}`)}
                                    >
                                        <Image
                                            src={
                                                blog.media?.url ||
                                                "https://via.placeholder.com/400x200?text=No+Image"
                                            }
                                            alt={blog.title}
                                            fill
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"></div>
                                    </div>

                                    {/* Blog Content */}
                                    <div className="p-5 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3
                                                onClick={() => router.push(`/blog/${blog._id}`)}
                                                className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-teal-600 transition-colors duration-300 cursor-pointer"
                                            >
                                                {blog.title}
                                            </h3>
                                            <p className="text-gray-500 text-xs mt-2">
                                                Published on{" "}
                                                {new Date(blog.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {/* Edit Button */}
                                        <div className="mt-4 flex justify-end">
                                            <button
                                                onClick={() => router.push(`/edit/${blog._id}`)}
                                                className="flex items-center gap-2 text-teal-600 border border-teal-500 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-teal-500 hover:text-white transition-colors"
                                            >
                                                <PenTool size={16} />
                                                Edit
                                            </button>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </div>
                    )}
                </main>
            </div>

            {/* Floating animation keyframes */}
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
