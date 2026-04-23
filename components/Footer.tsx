import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-16 px-4 md:px-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12">
        <div className="col-span-1 md:col-span-2">
          <Link
            href="/"
            className="inline-flex items-center mb-4"
          >
            <Image
              src="/assets/logowhite.svg"
              alt="YaY Experiences"
              width={170}
              height={52}
              className="h-8 md:h-9 w-auto"
            />
          </Link>
          <p className="text-gray max-w-sm">
            Retiros modernos de desconexión. Sin misticismo, solo bienestar
            práctico, experiencias reales y buen diseño.
          </p>
          <div className="flex flex-col items-center gap-2 mt-6 md:flex-row md:items-center md:gap-3">
            <Image
              src="/assets/RYT200.png"
              alt="Certificación RYT 200 - Registered Yoga Teacher"
              width={80}
              height={80}
              className="brightness-0 invert opacity-70 w-20 h-20 md:w-12 md:h-12 shrink-0"
            />
            <p className="text-xs text-gray leading-snug text-center md:text-left w-full">
              Profesora certificada <strong className="text-white/80">RYT 200</strong> por Yoga Alliance
            </p>
          </div>
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
                href="/partners"
                className="hover:text-gray transition-colors"
              >
                Partners
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
              <Link
                href="/privacidad"
                className="hover:text-gray transition-colors"
              >
                Privacidad
              </Link>
            </li>
            <li>
              <Link href="/terminos" className="hover:text-gray transition-colors">
                Términos
              </Link>
            </li>
            <li>
              <Link
                href="/politica-cookies"
                className="hover:text-gray transition-colors"
              >
                Cookies
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-gray">
            Social
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://www.instagram.com/yay.experiences"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://chat.whatsapp.com/B70aKrnocWsIaka1TVc22e"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gray transition-colors"
              >
                Comunidad WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray/20 text-xs text-gray flex flex-col md:flex-row justify-between items-center">
        <p>
          &copy; {new Date().getFullYear()} YaY Experiences. All rights reserved.
        </p>
        <p>Designed with clarity.</p>
      </div>
    </footer>
  );
}
