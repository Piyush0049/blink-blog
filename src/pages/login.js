"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/loginroute", user);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.user.token);
        router.push("/Home");
      } else {
        setError("Login failed, please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  // Centralized inline styles
  const styles = {
    container: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontFamily: "Poppins, sans-serif",
    },
    bgImage: {
      position: "absolute",
      top: 0, left: 0,
      width: "100%", height: "100%",
      backgroundImage: "url('https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg')",
      backgroundSize: "cover", backgroundPosition: "center",
      filter: "blur(8px)",
      opacity: 0.4,         
      zIndex: -1
    },
    header: {
        color: "#d0fdfa",
        textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
        marginBottom: "1rem",
        fontSize: windowWidth > 477 ? "2.5rem" : "1.8rem",
        marginBottom: windowWidth > 477 ? "2.5rem" : "0",
        textAlign: "center",
    },
    card: {
      position: "relative",
      backgroundColor: "none",
      borderRadius: "10px",
      width: windowWidth > 460 ? "400px" : "90%",
      maxWidth: "400px",
      zIndex: 1
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      marginBottom: "1rem",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "2px solid #A0F0E6",     
      backgroundColor: "transparent",   
      color: "#FFFFFF",
      outline: "none"
    },
    button: {
      width: "100%",
      padding: "0.75rem",
      fontSize: "1.2rem",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#4CAF50",
      color: "white",
      cursor: "pointer",
      transition: "background-color 0.3s",
      marginTop: "0.5rem"
    },
    error: {
      color: "#D32F2F",
      marginTop: "0.5rem",
      textAlign: "center"
    },
    footerText: {
      marginTop: "1rem",
      color: "#FFFFFF",
      fontSize: windowWidth > 611 ? "1rem" : "0.875rem"
    },
    link: {
      color: "#FFEB3B",
      textDecoration: "underline",
      marginLeft: "0.5rem"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgImage} />

      <h1 style={styles.header}>Login With Your Account</h1>

      <form onSubmit={login} style={styles.card}>
        <input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          style={styles.input}
          required
        />

        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            style={styles.input}
            required
          />
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: "8px", top: "38%", transform: "translateY(-50%)", color:"white" }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </div>

        <button type="submit" style={styles.button}>
          Login
        </button>
        {error && <p style={styles.error}>{error}</p>}
      </form>

      <p style={styles.footerText}>
        Don’t have an account?
        <Link href="/signup" style={styles.link}>Signup Now!</Link>
      </p>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideIn { from { transform: translateY(-20px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
        @keyframes pulse { 0% { transform: scale(1) } 50% { transform: scale(1.05) } 100% { transform: scale(1) } }
      `}</style>
    </div>
  );
}
