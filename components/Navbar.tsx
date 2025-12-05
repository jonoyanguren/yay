"use client";

import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <nav className="w-full py-6 px-4 md:px-12 flex justify-between items-center text-black sticky top-0 z-50 backdrop-blur-sm bg-sand/90">
        <Link
          href="/"
          className="text-2xl font-bold tracking-tighter"
          onClick={closeMenu}
        >
          YaY Experiences
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-gray-dark transition-colors">
            Home
          </Link>
          <Link
            href="/concept"
            className="hover:text-gray-dark transition-colors"
          >
            Concepto
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-dark transition-colors"
          >
            Nosotros
          </Link>
          <Link
            href="/contact"
            className="hover:text-gray-dark transition-colors"
          >
            Contacto
          </Link>
        </div>

        <Link
          href="/contact"
          className="hidden md:block px-5 py-2 bg-black text-white text-sm rounded-full hover:bg-gray-dark transition-colors"
        >
          Reservar
        </Link>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 z-50 relative"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-sand z-40 flex flex-col items-center justify-center space-y-8 md:hidden h-dvh">
          <Link
            href="/"
            className="text-2xl font-medium hover:text-gray-dark transition-colors"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            href="/concept"
            className="text-2xl font-medium hover:text-gray-dark transition-colors"
            onClick={closeMenu}
          >
            Concepto
          </Link>
          <Link
            href="/about"
            className="text-2xl font-medium hover:text-gray-dark transition-colors"
            onClick={closeMenu}
          >
            Nosotros
          </Link>
          <Link
            href="/contact"
            className="text-2xl font-medium hover:text-gray-dark transition-colors"
            onClick={closeMenu}
          >
            Contacto
          </Link>
          <Link
            href="/contact"
            className="px-8 py-3 bg-black text-white text-lg rounded-full hover:bg-gray-dark transition-colors mt-4"
            onClick={closeMenu}
          >
            Reservar
          </Link>
        </div>
      )}
    </>
  );
}
