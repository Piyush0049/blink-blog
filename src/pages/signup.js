"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextField from "@mui/material/TextField";
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
      fontFamily: 'Poppins, sans-serif',
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
      padding: "2rem",
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
      marginBottom: "1.2rem",
      fontSize: windowWidth > 477 ? "2.5rem" : "1.8rem",
      textAlign: "center",
    },
    input: {
      marginBottom: "1rem",
      padding: "0.75rem",
      fontSize: "1rem",
      borderRadius: "5px",
      border: "2px solid #A0F0E6",
      backgroundColor: "transparent",
      color: "#FFFFFF",
      outline: "none",
    },
    button: {
      backgroundColor: "#4CAF50",
      color: "#FFF",
      fontSize: "1.1rem",
      padding: "0.75rem",
      borderRadius: "5px",
      border: "none",
      cursor: "pointer",
      transition: "background-color 0.3s",
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
        <input
          label="Password"
          placeholder="Password"
          variant="outlined"
          type={showPassword ? "text" : "password"}
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          style={styles.input}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />
        <input
          label="Confirm Password"
          placeholder="Confirm Password"
          type={showcPassword ? "text" : "password"}
          value={user.cpassword}
          onChange={(e) => setUser({ ...user, cpassword: e.target.value })}
          style={styles.input}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowcPassword(!showcPassword)}
                  edge="end"
                >
                  {showcPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          required
        />
        <button type="submit" style={styles.button}>
          Signup
        </button>
      </form>
      <h3 style={{ color: "#d0fdfa", marginTop: "1rem" }}>
        Already have an account?
        <Link href="/login" style={{ color: "#FFEB3B", marginLeft: "0.5rem" }}>
          Login Now!
        </Link>
      </h3>
    </div>
  );
}
