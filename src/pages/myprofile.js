"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Save, User, Upload } from "lucide-react";
import Header from "@/components/header";
import toast from "react-hot-toast";
import interestsList from "@/utils/interests"; // ✅ import list

export default function MyProfile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    bio: "",
    image: "",
    interests: [], // ✅ new field
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/api/me", { withCredentials: true });
      if (res.status === 200) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleInterestChange = (interest) => {
    setUser((prev) => {
      const selected = prev.interests || [];
      if (selected.includes(interest)) {
        return { ...prev, interests: selected.filter((i) => i !== interest) };
      } else {
        return { ...prev, interests: [...selected, interest] };
      }
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

    try {
      setUploading(true);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );

      if (res.status === 200) {
        setUser({ ...user, image: res.data.secure_url });
        toast.success("Avatar uploaded successfully! 🎉");
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      console.log("Saving user:", user);
      setSaving(true);
      const res = await axios.put("/api/me", user, { withCredentials: true });
      if (res.status === 200) {
        toast.success("Profile updated successfully! 🎉");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-white font-sans text-gray-800 relative">
      <div className="fixed top-20 left-10 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-float-slow pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full opacity-20 blur-3xl animate-float-slower pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10">
        <Header />

        <main className="mt-12 flex justify-center">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 md:p-12 relative"
            >
              {/* Avatar */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt="Avatar"
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center shadow-md">
                      <User size={48} className="text-white" />
                    </div>
                  )}
                  <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer">
                    <Upload className="text-white" size={28} />
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {uploading && <p className="text-xs text-gray-500 mt-2">Uploading...</p>}
                <h2 className="mt-4 text-2xl font-semibold text-gray-800">My Profile</h2>
                <p className="text-gray-500 text-sm">Manage your personal information</p>
              </div>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={user.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/70"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleChange}
                    disabled
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={user.bio}
                    onChange={handleChange}
                    placeholder="Write something about yourself..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white/70"
                  />
                </div>

                {/* ✅ Interests */}
                <div>
                  <label className="block text-gray-700 font-medium mb-3">Interests</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto p-2 border-2 border-gray-200 rounded-lg bg-gray-50/60">
                    {interestsList.map((interest) => (
                      <label key={interest} className="flex items-center space-x-2 text-sm">
                        <input
                          type="checkbox"
                          checked={user.interests?.includes(interest)}
                          onChange={() => handleInterestChange(interest)}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span>{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium px-6 py-3 rounded-full shadow-md text-sm md:text-base transition-transform hover:scale-105 disabled:opacity-50"
                  >
                    <Save size={18} /> {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
