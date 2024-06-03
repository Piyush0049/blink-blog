import Link from 'next/link';
import { useRouter } from 'next/router';

const Header = () => {
  const router = useRouter();  // Adjust the path according to your setup

  return (
    <header style={headerStyle}>
      <div style={logoStyle}>
        <img alt="logo" />
      </div>
      <nav style={navStyle}>
        <Link href="/"><a style={linkStyle}><b>Writing</b></a></Link>
        <Link href="/"><a style={linkStyle}><b>Product</b></a></Link>
        <Link href="/"><a style={linkStyle}><b>Company</b></a></Link>
      </nav>
      <button style={buttonStyle} onClick={() => router.push('/writeblog')}>
        Start Writing
      </button>
    </header>
  );
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px',
  background: '#D9FEF9',
  boxShadow: '0 1px 10px rgba(0, 0, 0, 0.1)',
};

const logoStyle = {};

const navStyle = {
  display: 'flex',
  gap: '60px',
};

const linkStyle = {
  color: '#00bfa5',
  fontSize: '20px',
  transition: 'transform 0.3s',
};

const buttonStyle = {
  background: '#00bfa5',
  color: '#fff',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background 0.3s, transform 0.3s',
};

export default Header;
