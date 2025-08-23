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
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
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
        setAllComments(res.data.blogdet.comments || []);
      }
    } catch (error) {
      console.log("Error fetching blog comments:", error);
    }
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleSendClick = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      await axios.post(`/api/comment/${id}`, {
        author: token,
        text: comment.trim(),
        blogid: id,
      });
      setComment("");
      fetchBlog(id); // Refresh comments
    } catch (error) {
      console.log("Error sending comment:", error);
    }
  };

  return (
    <section className=" sm:p-6 max-w-3xl mx-auto">
      <h2
        className={`text-xl font-bold text-teal-700 mb-3 text-center ${
          windowWidth <= 490 ? "text-lg" : ""
        }`}
      >
        Comments
      </h2>

      <div className="space-y-4 max-h-52 overflow-y-auto px-2 scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-gray-200">
        {allComments.length === 0 ? (
          <p
            className={`text-center text-gray-500 italic ${
              windowWidth <= 480 ? "text-sm" : "text-sm"
            }`}
          >
            No comments yet. Be the first to comment!
          </p>
        ) : (
          allComments.map((commentItem, idx) => (
            <div
              key={idx}
              className=" shadow-sm rounded-md p-4 border border-gray-200"
            >
              <p
                className={`font-semibold text-gray-600 mb-1 ${
                  windowWidth <= 480 ? "text-sm" : "text-sm"
                }`}
              >
                {commentItem.author || "Anonymous"}
              </p>
              <p
                className={`text-gray-400 mb-2 ${
                  windowWidth <= 480 ? "text-xs" : "text-xs"
                }`}
              >
                {new Date(commentItem.createdAt).toLocaleDateString()}
              </p>
              <p
                className={`text-gray-700 whitespace-pre-wrap ${
                  windowWidth <= 480 ? "text-sm" : "text-[15px]"
                }`}
              >
                {commentItem.text}
              </p>
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSendClick}
        className="mt-6 flex items-start gap-3"
        aria-label="Add a comment form"
      >
        <textarea
          placeholder="Write a comment..."
          value={comment}
          onChange={handleCommentChange}
          className="flex-1 resize-none border border-gray-300 rounded-md p-3 bg-gray-50 text-gray-900 font-poppins placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition min-h-[80px] max-h-32 shadow-sm"
          aria-label="Comment input"
          rows={3}
        />

        <button
          type="submit"
          disabled={!comment.trim()}
          className={`flex items-center justify-center p-3 rounded-md transition-colors duration-300 shadow-md ${
            comment.trim()
              ? "bg-teal-500 hover:bg-teal-600 cursor-pointer text-white"
              : "bg-gray-300 cursor-not-allowed text-gray-400"
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
