import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, BookOpen, ChevronRight, ArrowRight } from 'lucide-react';

interface NavbarProps {
  onOpenDemo: () => void;
  onOpenSignIn: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDemo, onOpenSignIn }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'হোম', path: '/' },
    { name: 'প্রোডাক্ট', path: '/products' },
    { name: 'মূল্যতালিকা', path: '/pricing' },
    { name: 'নির্দেশিকা', path: '/docs' },
    { name: 'যোগাযোগ', path: '/contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-[#FBFBFA]/95 backdrop-blur-md border-b border-[#0B192C]/10 shadow-[0_4px_20px_rgba(11,25,44,0.04)]'
          : 'bg-[#FBFBFA]/85 backdrop-blur-[6px] border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex h-[76px] w-full max-w-[1280px] items-center justify-between px-5 sm:px-8">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group py-1" aria-label="MetaPOS Home">
          <img
            src="/logo.png?v=2"
            alt="MetaPOS"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[14px] font-bold transition-colors ${
                  isActive ? 'text-[#00875A] border-b-2 border-[#00D492] pb-1' : 'text-[#0B192C]/80 hover:text-[#00875A]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenSignIn}
            className="text-[14px] font-bold text-[#0B192C] hover:text-[#00875A] px-3 py-2 transition-colors cursor-pointer"
          >
            লগইন
          </button>
          <button
            onClick={onOpenDemo}
            className="group relative inline-flex items-center gap-2 rounded-full bg-[#00D492] px-5 py-2.5 text-[14px] font-extrabold text-[#0B192C] shadow-md shadow-[#00D492]/25 transition-all hover:bg-[#00B87D] hover:shadow-lg active:scale-95 border border-[#00D492] cursor-pointer"
          >
            <span>ফ্রি ডেমো স্টোর</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 text-[#0B192C]" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex md:hidden p-2 text-[#0B192C] hover:text-[#064E3B] rounded-lg hover:bg-slate-100"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#0B192C]/10 bg-[#FBFBFA]/98 backdrop-blur-md px-6 py-5 shadow-xl transition-all">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between text-base font-bold text-[#0B192C] py-1 border-b border-slate-100 hover:text-[#064E3B]"
              >
                <span>{link.name}</span>
                <ChevronRight className="h-4 w-4 text-[#831843]" />
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSignIn();
                }}
                className="w-full text-center py-2.5 text-sm font-bold text-[#0B192C] rounded-lg border border-slate-300"
              >
                লগইন
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDemo();
                }}
                className="w-full text-center py-2.5 text-sm font-extrabold text-[#0B192C] bg-[#00D492] hover:bg-[#00B87D] rounded-xl shadow-xs cursor-pointer"
              >
                ফ্রি ডেমো স্টোর
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
