"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from "axios";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [windowWidth, setWindowWidth] = useState("");
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

    const login = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/loginroute', {
                email: user.email,
                password: user.password,
            });
            if (res.status===200) {
                console.log(res)
                localStorage.setItem("token", res.data.user.token);
                router.push("/Home")
            } else {
                console.log("error has occured while logging in")
            }
        } catch (error) {
            console.log("Error:", error);
            setError("Please try again.");
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #4E90FC 0%, #8DB8FE 100%)",
        }}>
            <h1 style={{
                fontSize: windowWidth > 611 ? "48px" : 23,
                color: "white",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                animation: "fadeIn 2s"
            }}><b>Welcome To Blink & Blog...</b></h1>
            <h3 style={{
                padding: "20px",
                fontSize: windowWidth > 611 ? "30px" : 21 ,
                color: "white",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                animation: "fadeIn 3s"
            }}><b>Login Now!</b></h3>
            <div style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "25px",
                border: "2px solid white",
                padding: "30px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                animation: "slideIn 1s ease-out",
                opacity: "0.9",
                width: windowWidth > 460 ? "420px" : 330 ,
            }}>
                <TextField
                    label="Email"
                    variant="outlined"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    style={{
                        marginBottom: "15px",
                        width: "100%",
                        backgroundColor : "white"
                    }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    style={{
                        marginBottom: "30px",
                        width: "100%",
                        backgroundColor : "white"
                    }}
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
                        )
                    }}
                />
                <button
                    style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        fontSize: "20px",
                        padding: "10px",
                        borderRadius: "5px",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.3s",
                        animation: "pulse 2s infinite"
                    }}
                    onClick={login}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#75AAF6"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
                >
                    Login
                </button>
                {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
            </div>

            <h1 style={{
                marginTop: "20px",
                color: "white",
                animation: "fadeIn 4s",
                fontSize: windowWidth > 611 ? "19px" : 15 ,
            }}>
                Do not have an account?<Link href="/signup" style={{
                    color: "yellow",
                    textDecoration: "underline",
                    marginLeft: "5px"
                }}>Signup Now!</Link>
            </h1>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); }
                }
            `}</style>
        </div>
    );
}
