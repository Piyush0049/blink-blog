"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { toast } from "react-hot-toast";
import Head from "next/head";
import Header from "@/components/header";
import {
  Loader2,
  Type,
  FileText,
  Save,
  X,
  Image as ImageIcon,
  Wand2,
  Trash2,
} from "lucide-react";

export default function EditBlogPage() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);
  const [blog, setBlog] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blog/${id}`);
        setBlog(res.data);
        setTitle(res.data.title);
        setContent(res.data.blogText);
        setImage(res.data.media?.url || "");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch blog");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      await axios.put(`/api/blog/${id}`, {
        title,
        blogText: content,
        url: image,
        type: "image",
      });
      toast.success("Blog updated successfully!");
      setTimeout(() => router.push(`/blog/${id}`), 600);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update blog");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this blog?")) return;
    setDeleting(true);
    try {
      await axios.delete(`/api/blog/${id}`);
      toast.success("Blog deleted successfully!");
      setTimeout(() => router.push("/myblogs"), 600);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloud || !preset) {
      toast.error("Cloudinary env vars missing");
      return;
    }
    try {
      setUploading(true);
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", preset);
      const isVideo = file.type?.startsWith("video");
      const endpoint = isVideo
        ? `https://api.cloudinary.com/v1_1/${cloud}/video/upload`
        : `https://api.cloudinary.com/v1_1/${cloud}/image/upload`;
      const resp = await fetch(endpoint, { method: "POST", body: form });
      const data = await resp.json();
      if (data.secure_url) {
        setImage(data.secure_url);
        toast.success("Media uploaded");
      } else {
        toast.error("Upload failed");
      }
    } catch (err) {
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  const handleAiEdit = async () => {
    try {
      toast.loading("AI is improving your text...");
      const aiResponse = await axios.post("/api/ai/generate-blog", {
        prompt: "Improve and polish this blog content",
        title,
        tone: "professional",
        words: content.split(" ").length,
        text: content,
      });
      setContent(aiResponse.data.text);
      toast.dismiss();
      toast.success("AI improved your text!");
    } catch (err) {
      toast.dismiss();
      toast.error(err.response?.data?.message || "AI edit failed");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-cyan-50 to-teal-100">
        <Loader2 className="w-10 h-10 animate-spin text-teal-600" />
      </div>
    );
  }

  if (!blog) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-cyan-50 text-gray-800 font-[Poppins] relative">
      <Head>
        <title>Edit Blog | Blink & Blog</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Background gradients */}
      <div className="pointer-events-none fixed -top-24 -left-16 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-teal-200 to-cyan-300 opacity-20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-16 w-[20rem] h-[20rem] md:w-[32rem] md:h-[32rem] rounded-full bg-gradient-to-br from-sky-300 to-indigo-300 opacity-20 blur-3xl" />

      <Header />

      <main className="max-w-4xl mx-auto px-4 md:px-8 py-12 space-y-8">
        <h1 className="text-2xl md:text-4xl font-bold text-center bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-transparent drop-shadow-sm">
          ✏️ Edit Your Blog
        </h1>

        <form
          onSubmit={handleUpdate}
          className="space-y-6 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/50 shadow-lg p-6 md:p-8"
        >
          {/* Title */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Title</label>
            <div className="flex items-center gap-2 border-b border-gray-200 focus-within:border-teal-500 pb-2">
              <Type className="text-teal-600" size={20} />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Edit blog title"
                className="flex-1 bg-transparent outline-none text-base md:text-lg"
              />
            </div>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Content</label>
            <div className="flex items-start gap-2">
              <FileText className="text-teal-600 mt-2" size={20} />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
                required
                className="flex-1 w-full border border-gray-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 rounded-xl p-3 outline-none text-sm md:text-base leading-6 resize-none"
                placeholder="Edit blog content here..."
              />
            </div>
            <div className="mt-2 text-xs text-gray-500">
              {content?.length} characters
            </div>
            <button
              type="button"
              onClick={handleAiEdit}
              className="mt-3 flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs md:text-sm font-medium transition"
            >
              <Wand2 size={16} /> <span className="hidden sm:inline">AI Improve Text</span>
            </button>
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm text-gray-600 mb-2">Cover Image</label>
            {image && (
              <img
                src={image}
                alt="Blog"
                className="w-full h-40 md:h-48 object-cover rounded-xl mb-3"
              />
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <ImageIcon className="text-teal-600" size={20} />
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="text-sm text-gray-600"
              />
              {uploading && (
                <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center pt-4">
            <button
              type="button"
              onClick={() => router.push("/blogs")}
              className="inline-flex items-center gap-2 rounded-full px-4 md:px-5 py-2 bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition"
            >
              <X size={16} />
              <span className="hidden sm:inline">Cancel</span>
            </button>
            <div className="flex gap-3">
              {/* Delete Button */}
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md transition disabled:opacity-60"
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {deleting ? "Deleting..." : "Delete"}
                </span>
              </button>
              {/* Update Button */}
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-4 md:px-6 py-2 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow-md transition disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                  {saving ? "Updating..." : "Update Blog"}
                </span>
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
