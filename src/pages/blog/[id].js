"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from "next/head";
import { useRouter } from "next/router";
import CommentSection from "@/components/commentsection";
import Header from "@/components/header";

export default function BlogPage() {
  const route = useRouter();
  const [id, setId] = useState("");
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); // logged-in user

  useEffect(() => {
    const { id } = route.query;
    if (id) setId(id);
  }, [route.query]);

  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  useEffect(() => {
    // Fetch current logged-in user
    const fetchCurrentUser = async () => {
      try {
        const res = await axios.get("/api/me");
        if (res.status === 200) {
          setCurrentUser(res.data.user);
        }
      } catch (error) {
        console.log("Error fetching current user:", error);
      }
    };
    fetchCurrentUser();
  }, []);

  const fetchBlog = async (id) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/${id}`);
      if (res.status === 200) {
        setBlog(res.data.blogdet);
        setUser(res.data.userdet);
      }
    } catch (error) {
      console.log("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthorClick = () => {
    if (!user) return;
    if (currentUser?.email && currentUser.email === user.email) {
      route.push("/myprofile");
    } else {
      route.push(`/user/${user._id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-white font-sans text-gray-800 relative overflow-hidden">
      {/* Floating Background Orbs */}
      <div className="fixed top-20 left-10 w-60 h-60 bg-gradient-to-br from-teal-300 to-cyan-400 rounded-full opacity-20 blur-3xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-72 h-72 bg-gradient-to-br from-sky-400 to-indigo-400 rounded-full opacity-20 blur-3xl animate-float-slower pointer-events-none" />

      <div className="max-w-6xl mx-auto sm:px-8 relative z-10">
        {/* Header */}
        <Header />

        {/* Blog Content */}
        <main className="flex justify-center pt-6 sm:pt-8">
          {loading ? (
            // ✨ Loader Section
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
              <div className="w-12 h-12 border-4 border-teal-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 animate-pulse">
                Loading blog, please wait...
              </p>
              {/* Skeleton preview */}
              <div className="w-full max-w-2xl space-y-4 mt-6">
                <div className="h-8 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-md w-1/3 animate-pulse" />
                <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-md w-5/6 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded-md w-3/4 animate-pulse" />
              </div>
            </div>
          ) : blog ? (
            <article className="max-w-3xl w-full bg-white/80 backdrop-blur-md rounded-xl p-6 sm:p-10 border border-gray-100">
              {/* Title */}
              <h1 className="text-[22px] sm:text-3xl font-extrabold text-gray-900 mb-4 leading-snug">
                {blog.title}
              </h1>

              {/* Author Card */}
              <div
                onClick={handleAuthorClick}
                className="flex items-center gap-4 mb-6 sm:mb-10 cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition"
              >
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-teal-400 shadow-md"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-teal-500 text-white font-bold text-lg">
                    {user?.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <p className="text-gray-700 font-semibold">{user?.name}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Media */}
              {blog.media?.type === "image" ? (
                <img
                  src={blog.media.url}
                  alt={blog.title}
                  className="w-full rounded-2xl shadow-md mb-8 object-cover max-h-[420px] transition hover:scale-[1.01]"
                  loading="lazy"
                  draggable={false}
                />
              ) : (
                <video
                  controls
                  className="w-full max-w-full rounded-2xl shadow-md mb-8 object-cover max-h-[420px]"
                >
                  <source src={blog.media.url} type="video/mp4" />
                </video>
              )}

              {/* Blog Text */}
              <div className="prose prose-lg prose-teal max-w-none text-gray-800 leading-relaxed text-justify">
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
              Blog not found.
            </p>
          )}
        </main>

        {/* Comments Section */}
        {!loading && blog && (
          <section className="mt-16 pt-10">
            <CommentSection />
          </section>
        )}
      </div>
    </div>
  );
}
