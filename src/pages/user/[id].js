"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { User } from "lucide-react";
import Header from "@/components/header";
import toast from "react-hot-toast";

export default function UserProfile() {
    const route = useRouter();
    const [id, setId] = useState("");
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const { id } = route.query;
        if (id) setId(id);
    }, [route.query]);

    useEffect(() => {
        if (id) fetchProfile();
    }, [id]);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`/api/user/${id}`);
            if (res.status === 200) {
                setUser(res.data.user);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            toast.error("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-white font-sans text-gray-800 relative">
            {/* Floating Gradients */}
            <div className="fixed top-20 left-10 w-40 h-40 sm:w-56 sm:h-56 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-float-slow pointer-events-none" />
            <div className="fixed bottom-20 right-10 w-56 h-56 sm:w-80 sm:h-80 bg-gradient-to-br from-indigo-500 to-sky-400 rounded-full opacity-20 blur-3xl animate-float-slower pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-8 relative z-10">
                <Header />

                <main className="mt-12 flex justify-center">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    ) : user ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="w-full bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 md:p-12 relative"
                        >
                            {/* Profile Header */}
                            <div className="flex flex-col items-center mb-10">
                                {user.image ? (
                                    <img
                                        src={user.image}
                                        alt={user.name}
                                        className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
                                    />
                                ) : (
                                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-teal-400 to-emerald-400 flex items-center justify-center shadow-lg">
                                        <User size={48} className="text-white" />
                                    </div>
                                )}

                                <h1 className="mt-5 text-3xl font-bold text-gray-800">
                                    {user.name}
                                </h1>
                                <p className="text-gray-500 text-sm">{user.email}</p>
                            </div>

                            {/* About Section */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700">About</h2>
                                {user.bio ? (
                                    <p className="text-gray-600 leading-relaxed text-justify bg-gray-50 p-5 rounded-lg shadow-sm">
                                        {user.bio}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 italic">
                                        This user hasn’t written a bio yet.
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <p className="text-red-500 text-center py-20">
                            User profile not found.
                        </p>
                    )}
                </main>
            </div>

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
