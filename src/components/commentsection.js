"use client";
import React, { useState, useEffect } from "react";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import { useRouter } from "next/router";

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

        // ✅ Fetch user details for each comment’s author
        const enriched = await Promise.all(
          comments.map(async (c) => {
            try {
              const userRes = await axios.get(`/api/user/${c.userId}`);
              return {
                ...c,
                authorDetails: userRes.data.user, // attach user info
              };
            } catch {
              return c; // fallback if user not found
            }
          })
        );

        setAllComments(enriched);
        console.log(enriched);
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
      fetchBlog(id); // Refresh comments
    } catch (error) {
      console.log("Error sending comment:", error);
    }
  };

  // ✅ Avatar renderer with clickable profile
  const renderAvatar = (authorDetails) => {
    if (authorDetails?.image) {
      return (
        <img
          src={authorDetails.image}
          alt={authorDetails.name}
          className="w-11 h-11 rounded-full object-cover border border-gray-300 hover:scale-105 transition cursor-pointer"
          onClick={() => router.push(`/user/${authorDetails._id}`)}
        />
      );
    }
    const fallbackLetter =
      authorDetails?.name?.charAt(0)?.toUpperCase() || "?";
    return (
      <div
        onClick={() => router.push(`/user/${authorDetails._id}`)}
        className="w-11 h-11 flex items-center justify-center rounded-full bg-teal-500 text-white font-bold cursor-pointer hover:bg-teal-600 transition"
      >
        {fallbackLetter}
      </div>
    );
  };

  return (
    <section className="sm:p-6 max-w-3xl mx-auto">
      <h2
        className={`text-2xl font-semibold text-teal-700 mb-5 text-center ${
          windowWidth <= 490 ? "text-lg" : ""
        }`}
      >
        Comments
      </h2>

      {/* Comments List */}
      <div className="space-y-4 max-h-72 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200">
        {allComments.length === 0 ? (
          <p className="text-center text-gray-500 italic text-sm">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          allComments.map((commentItem, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {/* Avatar */}
              {renderAvatar(commentItem.authorDetails)}

              {/* Comment Content */}
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <p
                    className="font-medium text-gray-700 hover:text-teal-600 cursor-pointer transition"
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
                <p className="text-gray-600 mt-1 text-sm whitespace-pre-wrap">
                  {commentItem.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSendClick}
        className="mt-6 flex items-start gap-3"
        aria-label="Add a comment form"
      >
        <textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={handleCommentChange}
          className="flex-1 resize-none border border-gray-300 rounded-lg p-3 bg-gray-50 text-gray-900 font-poppins placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition min-h-[80px] max-h-32 shadow-sm"
          aria-label="Comment input"
          rows={3}
        />

        <button
          type="submit"
          disabled={!comment.trim()}
          className={`flex items-center justify-center p-3 rounded-lg transition-all duration-300 shadow-md ${
            comment.trim()
              ? "bg-teal-500 hover:bg-teal-600 text-white hover:scale-105"
              : "bg-gray-300 text-gray-400 cursor-not-allowed"
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
