// src/components/Header.tsx
import './Header.css';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Header = () => {
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY && currentY > 64) {
        setShow(false); // hide on scroll down
      } else {
        setShow(true); // show on scroll up
      }
      setLastScrollY(currentY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);
  
  return (
    <header className={`header pixel-border ${show ? '' : 'hidden'}`}>


    <h2 className="title-container">
      <Link to="/" className="title">Qijian Ma</Link>
    </h2>
      <nav className="nav-buttons">
        <a href="https://game.qjasonma.com"
           target="_blank"
           className="pixel-button">
            Retro Games
        </a>
        <a href="https://game.qjasonma.com"
           target="_blank"
           className="pixel-button">
            Retro Games
        </a>
        <Link to="/contact" className="pixel-button">Contact</Link>
      </nav>
    </header>
  );
};

export default Header;
