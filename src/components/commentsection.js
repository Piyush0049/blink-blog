"use client";
import React, { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";

const CommentSection = () => {
  const router = useRouter();
  const [windowWidth, setWindowWidth] = useState(0);
  const [token, setToken] = useState("");
  const [id, setId] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
  }, []);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const { id } = router.query;
    if (id) setId(id);
  }, [router.query]);

  useEffect(() => {
    if (id) fetchBlog(id);
  }, [id]);

  const fetchBlog = async (blogId) => {
    try {
      const res = await axios.get(`/api/${blogId}`);
      if (res.status === 200) {
        const comments = res.data.blogdet.comments || [];
        const enriched = await Promise.all(
          comments.map(async (c) => {
            try {
              const userRes = await axios.get(`/api/user/${c.userId}`);
              return { ...c, authorDetails: userRes.data.user };
            } catch {
              return c;
            }
          })
        );
        setAllComments(enriched);
      }
    } catch (error) {
      console.log("Error fetching blog comments:", error);
    }
  };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleSendClick = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(`/api/comment/${id}`, {
        text: comment.trim(),
        blogid: id,
      });
      setComment("");
      fetchBlog(id);
    } catch (error) {
      console.log("Error sending comment:", error);
    }
  };

  const renderAvatar = (authorDetails) => {
    if (authorDetails?.image) {
      return (
        <Image
          src={authorDetails.image}
          alt={authorDetails.name}
          width={48}
          height={48}
          className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm hover:scale-105 transition cursor-pointer"
          onClick={() => router.push(`/user/${authorDetails._id}`)}
        />
      );
    }
    const fallbackLetter = authorDetails?.name?.charAt(0)?.toUpperCase() || "?";
    return (
      <div
        onClick={() => router.push(`/user/${authorDetails._id}`)}
        className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold cursor-pointer shadow-sm hover:opacity-90 transition"
      >
        {fallbackLetter}
      </div>
    );
  };

  return (
    <section className="sm:p-6 max-w-3xl mx-auto">
      <h2
        className={`text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center relative`}
      >
        Comments
        <span className="block w-16 h-1 bg-gradient-to-r from-teal-500 to-cyan-400 mx-auto mt-2 rounded-full" />
      </h2>

      <div className="space-y-5 max-h-80 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-teal-400 scrollbar-track-gray-100 hover:scrollbar-thumb-teal-500">
        {allComments.length === 0 ? (
          <p className="text-center text-gray-500 italic text-sm">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          allComments.map((commentItem, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-gray-100 shadow hover:shadow-md hover:border-teal-200 transition"
            >
              {renderAvatar(commentItem.authorDetails)}

              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <p
                    className="font-semibold text-gray-800 hover:text-teal-600 cursor-pointer transition"
                    onClick={() =>
                      router.push(`/user/${commentItem.authorDetails?._id}`)
                    }
                  >
                    {commentItem?.authorDetails?.name || "Anonymous"}
                  </p>
                  <span className="text-gray-400 text-xs">
                    {new Date(commentItem.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {commentItem.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSendClick}
        className="mt-8 flex items-end gap-3 bg-white/70 backdrop-blur-lg border border-gray-200 rounded-xl p-4 shadow-sm"
        aria-label="Add a comment form"
      >
        <textarea
          placeholder="Write a thoughtful comment..."
          value={comment}
          onChange={handleCommentChange}
          className="flex-1 resize-none border-none bg-transparent text-gray-800 font-poppins placeholder-gray-400 focus:outline-none focus:ring-0 min-h-[70px] max-h-32"
          aria-label="Comment input"
          rows={3}
        />
        <button
          type="submit"
          disabled={!comment.trim()}
          className={`flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300 shadow-md ${
            comment.trim()
              ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:scale-110"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          aria-label="Send comment"
        >
          <SendIcon fontSize="small" />
        </button>
      </form>
    </section>
  );
};

export default CommentSection;
