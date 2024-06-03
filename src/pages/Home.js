import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Opacity } from "@mui/icons-material";

export default function Home() {
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const articlesRef = useRef(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/api/allblogsroute');
      if (res.status === 200) {
        setBlogs(res.data.blogs);
      } else {
        console.log("Error fetching blogs");
      }
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  const scrollLeft = () => {
    articlesRef.current.scrollBy({
      left: -300,
      behavior: 'smooth'
    });
  };

  const scrollRight = () => {
    articlesRef.current.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  };

  const articleHoverStyle = {
    transform: 'scale(1.05)', // Scale up on hover
  };

  const articleImageHoverStyle = {
    transform: 'scale(1.1)', // Scale up on hover
  };

  return (
    <div style={{ maxWidth: '100%', background: "linear-gradient(135deg, #C3FCF5 0%, #8DFDF0 100%)", minHeight: "100vh", padding: "20px" }}>
      <div style={{ fontFamily: 'Poppins, sans-serif', maxWidth: '1300px', margin: '0 auto', background: "#f8f9fa", padding: "30px", borderRadius: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <title>Blink & Blog</title>
        </Head>
        <header style={headerStyle}>
          <div style={logoStyle}>
            <img alt="logo" src="https://res.cloudinary.com/da2imhgtf/image/upload/v1717414763/svdurdbamvz2qri1ychm.png" style={{ height: '50px' }} />
          </div>

          <nav style={navStyle}>
            <Link href="#exploreSection" passHref style={linkStyle}><b>Explore</b></Link>
            <Link href="/Home" style={linkStyle}><b>My Blogs</b></Link>
            <Link href="/Home" style={linkStyle}><b>About</b></Link>
          </nav>
          <button
            style={startWritingButtonStyle}
            onClick={() => { router.push("/writeblog") }}
          >
            Start Writing
          </button>
        </header>

        <main style={mainStyle} id="exploreSection">
          <div style={heroStyle}>
            <img
              src="https://res.cloudinary.com/da2imhgtf/image/upload/v1717421094/hbee6ankimbppxkoojl4.jpg"
              alt="Hero Image"
              style={heroImageStyle}
            />
            <h1 style={heroTitleStyle}>
              Blink & Blog is already nearing perfection, a boon in itself.
            </h1>
          </div>
          <div style={{ paddingLeft: "20px", minHeight: "500px" }}>
            <aside style={asideStyle}>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', padding: "10px 0", fontFamily: 'Poppins, sans-serif' }}>About Us</h1>
              <hr />
              <div style={sidebarListStyle}>
                <p style={sidebarItemStyle}>At our blogging website, we pride ourselves on providing an immersive experience where users can explore a myriad of topics through captivating visuals and insightful written content. We understand the importance of security in today's digital landscape, which is why we prioritize safeguarding our users' data and privacy. With robust security measures in place, you can confidently engage with our platform, knowing that your information is protected.</p>
              </div>
            </aside>
          </div>
        </main>
        <h1 style={{ color: "#03BDA1", fontFamily: 'Poppins, sans-serif', padding: "30px 40px" }}>Explore Our Blogs:</h1>
        <div style={contentStyle}>
          <button onClick={scrollLeft} style={scrollButtonStyle}>◀</button>
          <div style={articlesContainerStyle} ref={articlesRef}>
            <div style={articlesStyle}>
              {blogs.map((blog, index) => (
                <div
                  key={index}
                  style={{ ...articleStyle, ...(isHovered === index && articleHoverStyle) }} // Apply hover style when hovered
                  id={index}
                  onMouseEnter={() => setIsHovered(index)} // Set hovered index on mouse enter
                  onMouseLeave={() => setIsHovered(null)} // Clear hovered index on mouse leave
                  onClick={() => router.push(`/${blog._id}`)}
                >
                  {blog.media.type === "image" ? (
                    <img
                      src={blog.media.url}
                      alt={index}
                      style={{ ...articleImageStyle, ...(isHovered === index && articleImageHoverStyle) }} // Apply hover style to image
                    />
                  ) : (
                    <video
                      controls
                      style={{ ...articlevideoStyle, ...(isHovered === index && articleImageHoverStyle) }}
                    >
                      <source src={blog.media.url} type="video/mp4" />
                    </video>
                  )}


                  <h2 style={{ marginTop: "20px", fontSize: "18px", color: "#606D6B", marginBottom: "10px" }}>{blog.title}</h2>
                </div>
              ))}
            </div>
          </div>
          <button onClick={scrollRight} style={scrollButtonStyle}>▶</button>
        </div>
      </div>
      <style>{customScrollbarStyle}</style>
    </div>
  );
}

const articleStyle = {
  flex: '0 0 auto', // Prevent flex-grow and flex-shrink
  minWidth: '250px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.3s',
  cursor: 'pointer',
  overflow: 'hidden', // Ensure content doesn't overflow
  borderRadius: '10px', // Add border radius
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Add shadow for depth effect
  position: 'relative', // Set position for overlay effect
  zIndex: 1, // Ensure overlay stays on top
};




const articlevideoStyle = {
  width: '100%', // Make video width 100% of its container
  maxWidth: '270px', // Ensure video does not exceed a maximum width
  height: '200px', // Set a fixed height for the video
  borderRadius: '10px', // Same border radius as images
  objectFit: 'cover', // Ensure video covers the area like an image
  transition: 'transform 0.3s', // Apply transition for hover effect
};


const articleImageStyle = {
  width: '100%',
  borderRadius: '10px',
  height: '200px',
  objectFit: 'cover',
  transition: 'transform 0.3s', // Apply transition to the image as well
};

// Add hover effect styles
const articleHoverStyle = {
  transform: 'scale(1.05)', // Scale up on hover
};

// Add hover effect for image
const articleImageHoverStyle = {
  transform: 'scale(1.1)', // Scale up on hover
};

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
  color: "#03BDA1"
};

const startWritingButtonStyle = {
  background: '#00bfa5',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.3s',
  fontSize: "16px",
  fontDecoration: "bold",
  fontFamily: 'Poppins, sans-serif'
};

const mainStyle = {
  display: 'flex',
  paddingTop: '20px',
  paddingLeft: "5px",
  paddingRight: "5px",
};

const heroStyle = {
  position: 'relative',
  flex: 2,
  marginBottom: '20px',
  overflow: 'hidden',
  borderRadius: '10px',
};

const heroImageStyle = {
  width: '100%',
  borderRadius: '10px'
};

const heroTitleStyle = {
  position: 'absolute',
  bottom: '18px',
  left: '10px',
  right: '10px',
  color: '#fff',
  background: 'rgba(0, 0, 0, 0.7)',
  padding: '10px 10px',
  borderRadius: '10px',
  fontSize: '20px',
  fontWeight: 'bold',
  opacity: "0.7"
};

const asideStyle = {
  flex: 1,
  padding: '30px 20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: "#CFFEF9",
  color: "black",
  borderRadius: "20px",
  fontFamily: "serif",
  textDecoration: "bold"
};

const sidebarListStyle = {
  listStyle: 'none',
  padding: '0',
  margin: '0',
  fontSize: '16px'
};

const sidebarItemStyle = {
  padding: '10px 0',
  fontSize: "16px",
  whiteSpace: "wrap",
  maxWidth: "350px",
  fontFamily: 'Poppins, sans-serif'
};

const contentStyle = {
  paddingTop: '20px',
  display: 'flex',
  alignItems: 'center', // Center the buttons vertically
  gap: '20px'
};

const articlesContainerStyle = {
  overflowX: 'scroll', // Enable horizontal scrolling
  overflowY: 'hidden', // Disable vertical scrolling
  display: 'flex',
  flex: 1, // Ensure this takes up the remaining space
  height: '300px', // Set a fixed height
  scrollbarWidth: 'thin', // For Firefox
  scrollbarColor: '#00bfa5 #fff', // For Firefox
};

// Custom scrollbar for WebKit browsers (Chrome, Safari)
const customScrollbarStyle = `
  ::-webkit-scrollbar {
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #fff;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #00bfa5;
    border-radius: 10px;
    border: 2px solid #fff;
  }
`;

const articlesStyle = {
  display: 'flex',
  flexWrap: 'nowrap', // Prevent wrapping to make horizontal scroll work
  gap: '20px',
  transition: 'transform 0.3s',
};

const scrollButtonStyle = {
  background: '#00bfa5',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.3s',
  fontSize: "16px",
};