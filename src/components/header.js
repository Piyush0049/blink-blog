"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { Menu, X, BookOpen, LogOut, Compass, PenTool } from "lucide-react";
import axios from "axios";

// -------------------- Desktop Navbar --------------------
const DesktopNavbar = ({ router, handleLogout }) => (
  <header className="sticky top-0 z-20 backdrop-blur-xl bg-white/70 border border-white/40 rounded-b-2xl shadow-md px-6 py-3 flex justify-between items-center">
    {/* Logo */}
    <img
      src="https://res.cloudinary.com/da2imhgtf/image/upload/v1745956931/deawc3nxyaebfwnl1he8.png"
      alt="logo"
      onClick={() => router.push("/Home")}
      className="h-10 md:h-12 hover:cursor-pointer"
    />
    <nav className="flex space-x-8 text-teal-700 font-medium text-sm md:text-base items-center">
      {/* <button
        onClick={() =>
          document
            .getElementById("exploreSection")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="hover:text-teal-500 transition"
      >
        Explore
      </button> */}

      <button
        onClick={() => router.push("/myblogs")}
        className="hover:text-teal-500 transition"
      >
        My Blogs
      </button>

      <button onClick={handleLogout} className="hover:text-teal-500 transition">
        Log Out
      </button>

      {router.pathname !== "/writeblog" && (
        <button
          onClick={() => router.push("/writeblog")}
          className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium px-5 py-2 rounded-full shadow-md text-sm md:text-base transition-transform hover:scale-105"
        >
          ✍ Start Writing
        </button>
      )}
    </nav>
  </header>
);

// -------------------- Mobile Sidebar --------------------
const MobileSidebar = ({ router, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const NavItem = ({ icon: Icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-teal-100/70 transition"
    >
      <Icon size={20} className="text-teal-600" />
      <span className="text-teal-700 font-medium">{label}</span>
    </button>
  );

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-teal-700 focus:outline-none mt-4 bg-teal-100 p-2 rounded-3xl shadow-2xl sticky top-4 z-1000"

      >
        <Menu size={28} />
      </button>

      {/* Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Panel */}
          <div
            className={`relative w-72 h-full bg-gradient-to-b from-white to-teal-50 shadow-2xl p-6 flex flex-col transition-transform duration-300 transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-teal-600 transition"
            >
              <X size={26} />
            </button>

            {/* Logo */}
            <div className="flex items-center justify-center mt-10 mb-10">
              <img
                src="https://res.cloudinary.com/da2imhgtf/image/upload/v1745956931/deawc3nxyaebfwnl1he8.png"
                alt="logo"
                onClick={() => {
                  router.push("/Home");
                  setIsOpen(false);
                }}
                className="h-[75px] cursor-pointer hover:scale-105 transition-transform"
              />
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-2">
              {/* <NavItem
                icon={Compass}
                label="Explore"
                onClick={() => {
                  document
                    .getElementById("exploreSection")
                    ?.scrollIntoView({ behavior: "smooth" });
                  setIsOpen(false);
                }}
              /> */}
              <NavItem
                icon={BookOpen}
                label="My Blogs"
                onClick={() => {
                  router.push("/myblogs");
                  setIsOpen(false);
                }}
              />
              <NavItem
                icon={LogOut}
                label="Log Out"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              />

              {router.pathname !== "/writeblog" && (
                <button
                  onClick={() => {
                    router.push("/writeblog");
                    setIsOpen(false);
                  }}
                  className="mt-6 flex items-center justify-center space-x-2 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-medium px-5 py-3 rounded-xl shadow-md text-base transition-transform hover:scale-105"
                >
                  <PenTool size={18} /> <span>Start Writing</span>
                </button>
              )}
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-8 text-xs text-gray-500 border-t border-gray-200">
              © {new Date().getFullYear()} Blink & Blog. All rights reserved.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// -------------------- Header Wrapper --------------------
const Header = () => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  // detect screen size
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await axios.post("/api/logoutroute", {}, { withCredentials: true });
      if (res.status === 200) {
        toast.success("Logged out successfully! 🎉");
        router.push("/login");
      } else {
        toast.error("Logout failed, please try again.");
      }
    } catch (err) {
      console.error("Logout failed:", err);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <>
      {isMobile ? (
        <MobileSidebar router={router} handleLogout={handleLogout} />
      ) : (
        <DesktopNavbar router={router} handleLogout={handleLogout} />
      )}
    </>
  );
};

export default Header;
