import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-2xl font-bold mb-4">YaY Retreats</h3>
          <p className="text-gray max-w-sm">
            Retiros modernos de desconexión. Sin misticismo, solo bienestar
            práctico, experiencias reales y buen diseño.
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray">
            Explora
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-gray transition-colors">
                Retiros
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-gray transition-colors">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-gray transition-colors"
              >
                Contacto
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray">
            Legal
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="#" className="hover:text-gray transition-colors">
                Privacidad
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:text-gray transition-colors">
                Términos
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray/20 text-xs text-gray flex flex-col md:flex-row justify-between items-center">
        <p>
          &copy; {new Date().getFullYear()} YaY Retreats. All rights reserved.
        </p>
        <p>Designed with clarity.</p>
      </div>
    </footer>
  );
}
