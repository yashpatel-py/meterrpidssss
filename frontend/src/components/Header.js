import React, { useState, useEffect as useEffect2 } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import Logo from '../assets/images/header_logo.png';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect2(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { text: 'Home', to: 'home' },
    { text: 'About Us', to: 'about-us' },
    { text: 'Services', to: 'services' },
    { text: 'Contact', to: 'contact' },
  ];

  const scrollProps = { smooth: true, duration: 500, offset: -80 };

  return (
    <header
      className={`fixed left-0 right-0 z-40 transition-all duration-300 top-14 sm:top-9 ${
        isScrolled ? 'bg-white/95 shadow-lg backdrop-blur-sm' : 'bg-transparent'
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
            <Link
              key={link.text}
              to={link.to}
              {...scrollProps}
              className={`cursor-pointer text-lg transition-colors duration-300 ${
                isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-accent'
              }`}
            >
              {link.text}
            </Link>
          ))}
          <RouterLink
            to="/blog"
            className={`cursor-pointer text-lg transition-colors duration-300 ${
              isScrolled ? 'text-gray-600 hover:text-primary' : 'text-white hover:text-accent'
            }`}
          >
            Blog
          </RouterLink>
        </nav>

        {/* CTA */}
        <div className="hidden md:block">
          <div className="flex items-center gap-3">
            <RouterLink
              to="/blog"
              className="cursor-pointer rounded-full border border-white/40 px-6 py-2 font-semibold text-white transition hover:border-primary hover:text-primary"
            >
              Blog
            </RouterLink>
            <Link
              to="contact"
              {...scrollProps}
              className="cursor-pointer bg-primary text-white font-semibold px-6 py-2 rounded-full hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`${isScrolled ? 'text-gray-800' : 'text-white'}`}
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
