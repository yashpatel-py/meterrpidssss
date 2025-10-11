import React, { useState, useEffect as useEffect2 } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-scroll';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import Logo from '../assets/images/header_logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isBlog = location.pathname.startsWith('/blog');

  useEffect2(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { text: 'Home', target: '/' },
    { text: 'About Us', target: '#about-us' },
    { text: 'Services', target: '#services' },
    { text: 'Contact', target: '#contact' },
  ];

  const scrollProps = { smooth: true, duration: 500, offset: -80 };

  const transparent = !isScrolled && !isBlog;

  return (
    <header
      className={`fixed left-0 right-0 z-40 transition-all duration-300 top-14 sm:top-9 ${
        transparent ? 'bg-transparent' : 'bg-white/95 shadow-lg backdrop-blur-sm'
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center space-x-2" style={{ marginTop: '4px' }}>
          <img src={Logo} alt="Meteoroid Services Logo" className="h-10 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            isBlog ? (
              <RouterLink
                key={link.text}
                to={link.target}
                className={`cursor-pointer text-lg transition-colors duration-300 ${
                  transparent ? 'text-white hover:text-accent' : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.text}
              </RouterLink>
            ) : (
              <Link
                key={link.text}
                to={link.target.replace('#', '')}
                {...scrollProps}
                className={`cursor-pointer text-lg transition-colors duration-300 ${
                  transparent ? 'text-white hover:text-accent' : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.text}
              </Link>
            )
          ))}
          <RouterLink
            to="/blog"
            className={`cursor-pointer text-lg transition-colors duration-300 ${
              transparent ? 'text-white hover:text-accent' : 'text-gray-600 hover:text-primary'
            }`}
          >
            Blog
          </RouterLink>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <Link
            to="contact"
            {...scrollProps}
            className={`cursor-pointer font-semibold px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105 ${
              transparent
                ? 'bg-primary text-white hover:bg-primary-dark'
                : 'bg-primary text-white hover:bg-primary-dark'
            }`}
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${transparent ? 'text-white' : 'text-gray-800'}`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-sm">
          <nav className="flex flex-col items-center space-y-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.text}
                to={link.to}
                {...scrollProps}
                onClick={() => setIsOpen(false)}
                className="cursor-pointer text-lg text-gray-700 hover:text-primary transition-colors duration-300"
              >
                {link.text}
              </Link>
            ))}
            <RouterLink
              to="/blog"
              onClick={() => setIsOpen(false)}
              className="cursor-pointer text-lg text-gray-700 hover:text-primary transition-colors duration-300"
            >
              Blog
            </RouterLink>
            <Link
              to="contact"
              {...scrollProps}
              onClick={() => setIsOpen(false)}
              className="cursor-pointer bg-primary text-white font-semibold px-6 py-2 rounded-full hover:bg-primary-dark transition-all duration-300"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
