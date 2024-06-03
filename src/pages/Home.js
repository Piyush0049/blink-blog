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
    transform: 'scale(1.05)', 
  };

  const articleImageHoverStyle = {
    transform: 'scale(1.1)',
  };

  return (
    <div style={{ maxWidth: '100%', background: "linear-gradient(135deg, #C3FCF5 0%, #8DFDF0 100%)", minHeight: "100vh", padding: "20px" }}>
      <div style={{ fontFamily: 'Poppins, sans-serif', maxWidth: '1300px', margin: '0 auto', background: "#f8f9fa", padding: "30px", borderRadius: "20px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}>
        <Head>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
          <title>Blink &amp; Blog</title>
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
              Blink &amp; Blog is already nearing perfection&apos; a boon in itself.
            </h1>
          </div>
          <div style={{ paddingLeft: "20px", minHeight: "500px" }}>
            <aside style={asideStyle}>
              <h1 style={{ fontSize: '30px', fontWeight: 'bold', padding: "10px 0", fontFamily: 'Poppins, sans-serif' }}>About Us</h1>
              <hr />
              <div style={sidebarListStyle}>
                <p style={sidebarItemStyle}>At our blogging website&lsquo; we pride ourselves on providing an immersive experience where users can explore a myriad of topics through captivating visuals and insightful written content&rsquo; We understand the importance of security in today&apos;s digital landscape&apos; which is why we prioritize safeguarding our users&apos; data and privacy&rsquo; With robust security measures in place&apos; you can confidently engage with our platform&apos; knowing that your information is protected&rsquo;</p>
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
                  style={{ ...articleStyle, ...(isHovered === index && articleHoverStyle) }} 
                  id={index}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)} 
                  onClick={() => router.push(`/${blog._id}`)}
                >
                  {blog.media.type === "image" ? (
                    <img
                      src={blog.media.url}
                      alt={index}
                      style={{ ...articleImageStyle, ...(isHovered === index && articleImageHoverStyle) }} 
                    />
                  ) : (
                    <video
                      controls
                      style={{ ...articleVideoStyle, ...(isHovered === index && articleImageHoverStyle) }}
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
  flex: '0 0 auto', 
  minWidth: '250px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  transition: 'transform 0.3s',
  cursor: 'pointer',
  overflow: 'hidden',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', 
  position: 'relative', 
  zIndex: 1, 
};

const articleVideoStyle = {
  width: '100%',
  maxWidth: '270px',
  height: '200px',
  borderRadius: '10px',
  objectFit: 'cover',
  transition: 'transform 0.3s', 
};

const articleImageStyle = {
  width: '100%',
  borderRadius: '10px',
  height: '200px',
  objectFit: 'cover',
  transition: 'transform 0.3s',
};


const articleHoverStyle = {
  transform: 'scale(1.05)', 
};

const articleImageHoverStyle = {
  transform: 'scale(1.1)', 
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
  overflowX: 'scroll', 
  overflowY: 'hidden', 
  display: 'flex',
  flex: 1, 
  height: '300px', 
  scrollbarWidth: 'thin', 
  scrollbarColor: '#00bfa5 #fff', 
};

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
  flexWrap: 'nowrap', 
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
