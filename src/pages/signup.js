"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import axios from "axios";

export default function Signuppage() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [windowWidth, setWindowWidth] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showcPassword, setShowcPassword] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const signup = async (e) => {
    e.preventDefault();
    if (user.password !== user.cpassword) {
      alert("Please fill your passwords correctly");
      return;
    }
    try {
      const res = await axios.post("/api/signuproute", {
        name: user.name,
        email: user.email,
        password: user.password,
      });
      if (res.status === 201) router.push("/login");
      else alert(res.data.message);
    } catch {
      alert("An error occurred during signup.");
    }
  };

  const styles = {
    container: {
      backgroundColor: "none",
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      overflow: "hidden",
      fontFamily: "Poppins, sans-serif",
    },
    bgImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage:
        "url('https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      filter: "blur(8px)",
      opacity: 0.4,
      zIndex: -1,
    },
    formWrapper: {
      paddingTop: "2rem",
      paddingLeft: "1rem",
      paddingRight: "1rem",
      paddingBottom: "0.5rem",
      borderRadius: "10px",
      width: windowWidth > 465 ? "450px" : "90%",
      maxWidth: "450px",
      zIndex: 1,
      display: "flex",
      flexDirection: "column",
    },
    header: {
      color: "#d0fdfa",
      textShadow: "2px 2px 8px rgba(0,0,0,0.3)",
      marginBottom: "0rem",
      fontSize: windowWidth > 477 ? "2.5rem" : "1.8rem",
      textAlign: "center",
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
      outline: "none",
    },
    button: {
      backgroundColor: "#1bb599",
      color: "#FFF",
      fontSize: "1.1rem",
      padding: "0.75rem",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s",
    },
    footerText: {
      marginTop: "1rem",
      color: "#FFFFFF",
      fontSize: windowWidth > 611 ? "1rem" : "0.875rem",
    },
    link: {
      color: "#7ed8ff",
      marginLeft: "0.3rem",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.bgImage} />

      <h1 style={styles.header}>Create Account</h1>
      <form onSubmit={signup} style={styles.formWrapper}>
        <input
          placeholder="Username"
          label="Name"
          variant="outlined"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
          style={styles.input}
          required
        />
        <input
          placeholder="Email"
          label="Email"
          variant="outlined"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          style={styles.input}
          required
        />
        <div style={{ position: "relative", width: "100%" }}>
          <input
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            style={{ ...styles.input, paddingRight: "2.5rem" }}
            required
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "39.5%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#ffffff",
            }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </div>
        </div>

        <div style={{ position: "relative", width: "100%" }}>
          <input
            placeholder="Confirm Password"
            type={showcPassword ? "text" : "password"}
            value={user.cpassword}
            onChange={(e) => setUser({ ...user, cpassword: e.target.value })}
            style={{ ...styles.input, paddingRight: "2.5rem" }}
            required
          />
          <div
            onClick={() => setShowcPassword(!showcPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "39.5%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#ffffff",
            }}
          >
            {showcPassword ? <VisibilityOff /> : <Visibility />}
          </div>
        </div>
        <button type="submit" style={styles.button}>
          Signup
        </button>
      </form>
      <p style={styles.footerText}>
        Already have an account?
        <Link href="/login" style={styles.link}>
          Log in
        </Link>
      </p>
    </div>
  );
}
