"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';

export default function Signuppage() {
    const router = useRouter();
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: ""
    });

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

    const [showPassword, setShowPassword] = useState(false);
    const [showcPassword, setShowcPassword] = useState(false);

    const signup = async (e) => {
        e.preventDefault();
        console.log(user)
        if (user.password !== user.cpassword) {
            window.alert("Please fill your passwords correctly");
            return;
        }

        try {
            const response = await axios.post('/api/signuproute', {
                name: user.name,
                email: user.email,
                password: user.password,
            });

            if (response.status === 201) {
                console.log('Signup successful:', response.data);
                router.push("/login")
            } else {
                console.error('Signup error:', response.data);
                window.alert(response.data.message);
            }
        } catch (error) {
            console.error('Error during signup:', error);
            window.alert('An error occurred during signup.');
        }
    };

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #f5af19 0%, #FA8275 100%)",
            animation: "backgroundFade 10s infinite"
        }}>
            <h1 style={{
                fontSize: windowWidth > 477 ?"48px" : "28px",
                color: "white",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                animation: "fadeIn 2s"
            }}><b>Just One Step Away...</b></h1>
            <h1 style={{
                padding: "20px",
                fontSize: windowWidth > 611 ? "26px" : 18 ,
                color: "white",
                textShadow: "2px 2px 8px rgba(0, 0, 0, 0.3)",
                animation: "fadeIn 3s"
            }}><b>SignUp For FREE</b></h1>
            <form onSubmit={signup} style={{
                display: "flex",
                flexDirection: "column",
                fontSize: "25px",
                border: "2px solid white",
                padding: "30px",
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.8)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                animation: "slideIn 1s ease-out",
                width: windowWidth > 465 ? "450px" : "350px"
            }}>
                <TextField
                    label="name"
                    variant="outlined"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    style={{ marginBottom: "15px" }}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    style={{ marginBottom: "15px" }}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    style={{ marginBottom: "15px" }}
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
                <TextField
                    label="Confirm Password"
                    variant="outlined"
                    type={showcPassword ? "text" : "password"}
                    value={user.cpassword}
                    onChange={(e) => setUser({ ...user, cpassword: e.target.value })}
                    style={{ marginBottom: "30px" }}
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
                        )
                    }}
                />
                <button type="submit" style={{
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
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#45a049"}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#4CAF50"}
                >Signup</button>
            </form>
            <h3 style={{
                marginTop: "20px",
                color: "white",
                animation: "fadeIn 4s",
                fontSize: windowWidth > 611 ? "19px" : 15 ,
            }}>
                Already have an account?<Link href="/login" style={{
                    color: "#FFFC69",
                    textDecoration: "underline",
                    marginLeft: "5px"
                }}>Login Now!</Link>
            </h3>

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
