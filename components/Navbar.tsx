"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isRetreatDetail = /^\/retreats\/[^/]+$/.test(pathname);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  if (isRetreatDetail) {
    return null;
  }

  return (
    <>
      <nav className="w-full py-6 px-4 md:px-12 flex justify-between items-center text-black sticky top-0 z-50 backdrop-blur-sm bg-sand/90">
        <Link
          href="/"
          className="inline-flex items-center"
          onClick={closeMenu}
        >
          <Image
            src="/assets/logo.svg"
            alt="YaY Experiences"
            width={160}
            height={48}
            className="h-8 md:h-10 w-auto"
            priority
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8 text-sm font-medium">
          <Link href="/" className="hover:text-gray-dark transition-colors">
            Home
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
        </div>
      )}
    </>
  );
}
