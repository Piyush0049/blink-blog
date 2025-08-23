// pages/writeblog.js
"use client";
import React, { useState, useRef } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Header from "@/components/header";
import Head from "next/head";
import {
  Wand2, Save, Image as ImageIcon, Video, Type, Settings,
  Loader2, UploadCloud
} from "lucide-react";

function stripMarkdownToParagraphs(md) {
  if (!md) return '';
  let t = md;
  t = t.replace(/```[\s\S]*?```/g, '');
  t = t.replace(/^#{1,6}\s+/gm, '')
    .replace(/^>\s?/gm, '')
    .replace(/^(-{3,}|_{3,}|\*{3,})$/gm, '');
  t = t.replace(/^\s{0,3}[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '');
  t = t.replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/_{1,2}(.*?)_{1,2}/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
  t = t.replace(/\n{3,}/g, '\n\n').trim();
  return t.split(/\n{2,}/).map(s => s.trim()).filter(Boolean).join('\n\n');
}

export default function WriteBlog() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [blogText, setBlogText] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("image");
  const [aiPrompt, setAiPrompt] = useState("");
  const [tone, setTone] = useState("professional");
  const [words, setWords] = useState(700);
  const [loadingAI, setLoadingAI] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  const generateWithAI = async () => {
    if (!title && !aiPrompt) {
      toast.error("Add a title or prompt for AI.");
      return;
    }
    setLoadingAI(true);
    try {
      const { data } = await axios.post("/api/ai/generate-blog", {
        prompt: aiPrompt,
        title,
        tone,
        words,
      });
      const clean = stripMarkdownToParagraphs(data.text);
      setBlogText((prev) => (prev?.trim() ? prev + "\n\n" + clean : clean));
      toast.success("AI draft added");
    } catch (e) {
      toast.error(e?.response?.data?.message || "AI generation failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const savePost = async (e) => {
    e.preventDefault();
    if (!title || !blogText) {
      toast.error("Title and content are required");
      return;
    }
    setSaving(true);
    try {
      const res = await axios.post("/api/writeblogroute", {
        title,
        blogText,
        url: mediaUrl || undefined,
        type: mediaUrl ? mediaType : undefined,
      });
      if (res.status === 201) {
        toast.success("Blog published");
        setTimeout(() => router.push(`/${res.data._id}`), 600);
      } else {
        toast.error("Failed to publish");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error saving blog");
    } finally {
      setSaving(false);
    }
  };

  const handlePickFile = () => fileInputRef.current?.click();

  const uploadToCloudinary = async (file) => {
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
        setMediaUrl(data.secure_url);
        setMediaType(isVideo ? "video" : "image");
        toast.success("Media uploaded");
      } else {
        console.error(data);
        toast.error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Upload error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-teal-50 to-cyan-50 text-gray-800 relative font-[Poppins]">
      <Toaster position="top-right" />
      <Head>
        <title>Blink & Blog</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* background accents */}
      <div className="pointer-events-none fixed -top-24 -left-16 w-96 h-96 rounded-full bg-gradient-to-br from-teal-200 to-cyan-300 opacity-20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-24 -right-16 w-[32rem] h-[32rem] rounded-full bg-gradient-to-br from-sky-300 to-indigo-300 opacity-20 blur-3xl" />

      {/* Header */}
      <Header/>

      {/* Editor Layout */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: AI Composer */}
        <section className="lg:col-span-1 bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-md p-5 will-change-transform transition-all">
          <div className="flex items-center gap-2 mb-4">
            <Wand2 className="text-teal-600" />
            <h2 className="text-base md:text-lg font-semibold text-teal-700">Write with AI</h2>
          </div>

          <label className="block text-sm text-gray-600 mb-1">Prompt / Topic</label>
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe what you want to write..."
            className="w-full border border-gray-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-100 rounded-xl p-3 outline-none text-sm min-h-[90px]"
          />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="col-span-2 flex items-center gap-2 text-sm text-gray-600">
              <Settings className="w-4 h-4" />
              <span>Style</span>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-300"
              >
                <option value="professional">Professional</option>
                <option value="neutral">Neutral</option>
                <option value="casual">Casual</option>
                <option value="enthusiastic">Enthusiastic</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Target Words</label>
              <input
                type="number"
                min={300}
                max={2000}
                step={50}
                value={words}
                onChange={(e) => setWords(parseInt(e.target.value || 700))}
                className="w-full border border-gray-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-300"
              />
            </div>
          </div>

          <button
            onClick={generateWithAI}
            disabled={loadingAI}
            className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium px-4 py-2 rounded-xl shadow transition disabled:opacity-60"
          >
            {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
            {loadingAI ? "Generating..." : "Generate Draft"}
          </button>
        </section>

        {/* Middle: Editor */}
        <section className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-md p-5">
            <label className="block text-sm text-gray-600 mb-1">Title</label>
            <div className="flex items-center gap-2">
              <Type className="text-teal-600" />
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="An engaging headline..."
                className="flex-1 border-b border-gray-200 focus:border-teal-400 outline-none py-2 bg-transparent text-lg"
              />
            </div>
          </div>

          {/* Media */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-md p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm text-gray-600">Cover Media (optional)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePickFile}
                  className="inline-flex items-center gap-2 text-xs md:text-sm px-3 py-2 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition"
                >
                  <UploadCloud className="w-4 h-4" />
                  Upload
                </button>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value)}
                  className="border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-300"
                >
                  <option value="image">Image</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={(e) => uploadToCloudinary(e.target.files?.[0])}
              className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-gray-500">
                {mediaType === "image" ? <ImageIcon /> : <Video />}
                <span className="text-xs">Type hint</span>
              </div>
              <input
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder={mediaType === 'image' ? "https://...jpg" : "https://...mp4"}
                className="md:col-span-2 border border-gray-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-300"
              />
            </div>

            {/* Media Preview */}
            {mediaUrl ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-gray-100 shadow-sm">
                {mediaType === "image" ? (
                  <img src={mediaUrl} alt="cover" className="w-full max-h-64 object-cover hover:scale-[1.02] transition-transform duration-500" />
                ) : (
                  <video controls className="w-full max-h-64 object-cover">
                    <source src={mediaUrl} type="video/mp4" />
                  </video>
                )}
              </div>
            ) : null}

            {uploading && (
              <div className="mt-3 text-xs text-gray-500 inline-flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading to Cloudinary…
              </div>
            )}
          </div>

          {/* Content */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/60 shadow-md p-5">
            <label className="block text-sm text-gray-600 mb-2">Content</label>
            <textarea
              value={blogText}
              onChange={(e) => setBlogText(e.target.value)}
              placeholder="Start writing your story..."
              className="w-full min-h-[320px] border border-gray-200 focus:border-teal-300 focus:ring-2 focus:ring-teal-100 rounded-xl p-3 outline-none text-sm leading-7"
            />
            <div className="mt-2 text-xs text-gray-500">{blogText.length} characters</div>
          </div>

          {/* Live Card Preview */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 hover:shadow-xl transition">
            <div className="overflow-hidden">
              {mediaUrl ? (
                mediaType === "image" ? (
                  <img src={mediaUrl} alt="preview" className="h-56 w-full object-cover hover:scale-105 transition-transform duration-500" />
                ) : (
                  <video className="h-56 w-full object-cover" controls>
                    <source src={mediaUrl} type="video/mp4" />
                  </video>
                )
              ) : (
                <div className="h-56 w-full bg-gradient-to-br from-gray-100 to-gray-50" />
              )}
            </div>
            <div className="p-5">
              <h3 className="text-lg md:text-xl font-semibold line-clamp-2">{title || "Your blog title appears here"}</h3>
              <div className="text-gray-600 text-sm mt-2 space-y-2">
                {(stripMarkdownToParagraphs(blogText) || "Your blog content preview will appear here as you write.")
                  .split(/\n{2,}/)
                  .slice(0, 2)
                  .map((para, i) => (
                    <p key={i} className="leading-7">{para}</p>
                  ))}
              </div>
            </div>
          </div>

          {/* Publish Button (Bottom) */}
          <div className="flex justify-end">
            <button
              onClick={savePost}
              disabled={saving}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-5 py-3 rounded-full shadow-md disabled:opacity-60 transition"
            >
              {saving ? <Loader2 className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saving ? "Publishing..." : "Publish Blog"}
            </button>
          </div>
        </section>
      </main>

      {/* Page Animations */}
      <style jsx global>{`
        .animate-in { animation: fadeInUp .6s ease both; }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
