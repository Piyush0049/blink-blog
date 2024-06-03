"use client";
import Link from 'next/link';
import React, { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const styleSheet = document.styleSheets[0];
    styleSheet.insertRule(`
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(-20px); }
        100% { opacity: 1; transform: translateY(0); }
      }
    `, styleSheet.cssRules.length);
    styleSheet.insertRule(`
      @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
      }
    `, styleSheet.cssRules.length);

    const cards = document.querySelectorAll('[data-card]');
    cards.forEach(card => {
      card.addEventListener('mouseover', () => {
        card.style.transform = 'scale(1.05)';
      });
      card.addEventListener('mouseout', () => {
        card.style.transform = 'scale(1)';
      });
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mouseover', () => {
          card.style.transform = 'scale(1.05)';
        });
        card.removeEventListener('mouseout', () => {
          card.style.transform = 'scale(1)';
        });
      });
    };
  }, []);

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <h1 style={styles.title}>Welcome To Blink & Blog</h1>
        <p style={styles.subtitle}>Express yourself through writing</p>
        <div style={styles.cardContainer}>
          <div style={styles.card} data-card>
            <h2 style={styles.cardTitle}>Write Blog Posts</h2>
            <p style={styles.cardDescription}>Share your thoughts&apos; stories&apos; and experiences</p>
          </div>
          <div style={styles.card} data-card>
            <h2 style={styles.cardTitle}>Engage with Readers</h2>
            <p style={styles.cardDescription}>Interact with your audience through comments and discussions</p>
          </div>
          <div style={styles.card} data-card>
            <h2 style={styles.cardTitle}>Customize Your Blog</h2>
            <p style={styles.cardDescription}>Personalize your blog with themes&apos; layouts&apos; and widgets</p>
          </div>
          <Link href="/signup">
            <p style={{
              color: "black",
              marginTop: "30px",
              fontSize: "25px",
              fontFamily: "monospace",
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer',
              animation: 'fadeIn 1s ease-in-out, pulse 2s infinite',
              textDecoration: 'none', 
              display: 'inline-block', 
            }}>
              Start Your Blogging Journey Now
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}

const styles = {
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
    overflow: 'hidden',
    backgroundImage: 'url(https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/advisor/wp-content/uploads/2022/06/How_To_Start_A_Blog_-_article_image.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  container: {
    textAlign: 'center',
    maxWidth: '800px',
    padding: '40px 20px',
    borderRadius: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
    backdropFilter: 'blur(10px)',
    opacity : "0.76"
  },
  title: {
    fontSize: '3em',
    color: '#333',
    marginBottom: '0.5em',
    animation: 'fadeIn 1s ease-in-out',
  },
  subtitle: {
    fontSize: '1.5em',
    color: '#666',
    marginBottom: '2em',
    animation: 'fadeIn 1.5s ease-in-out',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  card: {
    flex: '1',
    minWidth: '200px',
    margin: '10px',
    padding: '20px',
    borderRadius: '15px',
    backgroundColor: '#e8f0fe',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    animation: 'fadeIn 1s ease-in-out, pulse 2s infinite',
  },
  cardTitle: {
    fontSize: '1.7em',
    color: '#333',
    marginBottom: '0.5em',
  },
  cardDescription: {
    fontSize: '1em',
    color: '#666',
  },
};
