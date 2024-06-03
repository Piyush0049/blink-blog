"use client"
import React, { useState, useEffect } from "react";
import axios from "axios";
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CommentSection from "@/components/header/commentsection"; // Ensure the path is correct

export default function BlogPage() {
  const router = useRouter();
  const [id, setid] = useState("");
  const [blog, setBlog] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const {id} = router.query;
    setid(id);
  }, [id]);
  useEffect(() => {
    if (id) {
      fetchBlog(id);
    }
  }, [id]);

  const fetchBlog = async (id) => {
    try {
      const res = await axios.get(`/api/${id}`);
      if (res.status === 200) {
        console.log('API response:', res);
        setBlog(res.data.blogdet);
        setUser(res.data.userdet);
      } else {
        console.log("Error fetching blog, status:", res.status);
      }
    } catch (error) {
      console.log("Error fetching blog:", error);
    }
  };

  return (
    <div style={{ maxWidth: '100%', background: "#f8f9fa", minHeight: "100vh", padding: "20px", background: "linear-gradient(135deg, #99FCED 0%, #DBFF7B 100%)", }}>
      <div style={{ fontFamily: 'Poppins, sans-serif', maxWidth: '1300px', margin: '0 auto', padding: "30px", borderRadius: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", background: "#f8f9fa" }}>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <title>Blink & Blog - Blog</title>
        </Head>
        <header style={headerStyle}>
          <div style={logoStyle}>
            <Link href="/Home" passHref>
              <img alt="logo" src="https://res.cloudinary.com/da2imhgtf/image/upload/v1717414763/svdurdbamvz2qri1ychm.png" style={{ height: '50px' }} />
            </Link>
          </div>
          <nav style={navStyle}>
            <Link href="/Home" style={linkStyle}><b>Explore More</b></Link>
            <Link href="/Home" style={linkStyle}><b>About</b></Link>
          </nav>
        </header>
        <main style={mainStyle}>
          {blog ? (
            <div style={blogContainerStyle}>
              <h1 style={blogTitleStyle}>{blog.title}</h1>
              <p style={blognameStyle}> - {user.name}</p>
              {blog.media.type === "image" ? (
                <img src={blog.media.url} alt={blog.title} style={blogImageStyle} />
              ) : (
                <video controls style={blogvideoStyle}>
                  <source src={blog.media.url} type="video/mp4" />
                </video>
              )}
              <p style={blogTextStyle}>{blog.blogText}</p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </main>
        <CommentSection />
      </div>
    </div>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 10px',
  background: '#fff',
  borderBottom: '1px solid #ddd'
};

const logoStyle = {};

const navStyle = {
  display: 'flex',
  gap: '40px'
};

const linkStyle = {
  fontSize: '16px',
  textDecoration: 'none',
  cursor: 'pointer',
  color: "#03BDA1",
  fontFamily: 'Poppins, sans-serif'
};

const mainStyle = {
  paddingTop: '20px',
  display: 'flex',
  justifyContent: 'center',
};

const blogContainerStyle = {
  maxWidth: '800px',
  padding: '20px',
};

const blogTitleStyle = {
  fontSize: '30px',
  fontWeight: 'bold',
  marginBottom: '20px',
  fontFamily: 'Poppins, sans-serif',
  color: "#009781",
};

const blognameStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '20px',
  fontFamily: 'Poppins, sans-serif',
  color: "#02705F",
  position: "relative",
  left: "83%"
};

const blogImageStyle = {
  width: '100%',
  borderRadius: '10px',
  marginBottom: '20px',
};

const blogvideoStyle = {
  width: '100%',
  maxWidth: '400px', // Adjusted max width to make the video smaller
  height: 'auto',
  borderRadius: '10px',
  objectFit: 'cover',
  transition: 'transform 0.3s',
};

const blogTextStyle = {
  fontSize: '18px',
  lineHeight: '1.5',
  color: "#3A4E4B"
};
