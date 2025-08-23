"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import CommentSection from "@/components/commentsection";
import { useRouter } from "next/router";
import Header from "@/components/header";

export default function BlogPage() {
  const route = useRouter();
  const [id, setId] = useState("");
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const { id } = route.query;
    if (id) setId(id);
  }, [route.query]);

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  const fetchBlog = async (id) => {
    try {
      const res = await axios.get(`/api/${id}`);
      if (res.status === 200) {
        setBlog(res.data.blogdet);
        setUser(res.data.userdet);
      }
    } catch (error) {
      console.log("Error fetching blog:", error);
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

      <div className="fixed top-20 left-10 w-60 h-60 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full opacity-20 blur-3xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-sky-400 to-indigo-400 rounded-full opacity-20 blur-3xl animate-float-slower pointer-events-none" />

      <div className="max-w-6xl mx-auto  p-4 sm:px-8">
        {/* Header */}
        <Header />

        {/* Blog Content */}
        <main className="flex justify-center pt-6 sm:pt-8">
          {blog ? (
            <article className="max-w-3xl w-full">
              {/* Title */}
              <h1 className="text-[20px] sm:text-2xl font-extrabold text-[#009781] mb-3 leading-snug">
                {blog.title}
              </h1>

              {/* Author */}
              <p className="text-[#02705F] font-semibold mb-3 sm:mb-8 text-right text-sm sm:text-base italic">
                – {user?.name || "Author"}
              </p>

              {/* Media */}
              {blog.media?.type === "image" ? (
                <img
                  src={blog.media.url}
                  alt={blog.title}
                  className="w-full rounded-2xl shadow-lg mb-8 object-cover max-h-[420px]"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <video
                  controls
                  className="w-full max-w-full rounded-2xl shadow-lg mb-8 object-cover max-h-[420px]"
                >
                  <source src={blog.media.url} type="video/mp4" />
                </video>
              )}

              {/* Blog Text (split into paragraphs) */}
              <div className="prose prose-lg prose-teal max-w-none text-gray-800 leading-relaxed">
                {blog.blogText
                  .split(/\n\s*\n/) // split by double line breaks
                  .map((para, idx) => (
                    <p key={idx} className="mb-5">
                      {para.trim()}
                    </p>
                  ))}
              </div>
            </article>
          ) : (
            <p className="text-teal-600 text-center text-xl select-none">
              Loading blog...
            </p>
          )}
        </main>

        {/* Comments Section */}
        <section className="mt-16 pt-10">
          <CommentSection />
        </section>
      </div>
    </div>
  );
}
