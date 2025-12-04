import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full py-6 px-4 md:px-12 flex justify-between items-center text-black sticky top-0 z-50 backdrop-blur-sm bg-sand/90">
      <Link href="/" className="text-2xl font-bold tracking-tighter">
        YaY Experiences
      </Link>
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
        <Link href="/about" className="hover:text-gray-dark transition-colors">
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
      {/* Mobile Menu Button Placeholder */}
      <button className="md:hidden p-2">
        <span className="block w-6 h-0.5 bg-black mb-1"></span>
        <span className="block w-6 h-0.5 bg-black mb-1"></span>
        <span className="block w-6 h-0.5 bg-black"></span>
      </button>
    </nav>
  );
}
