import Button from "@/components/ui/Button";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="px-4 md:px-12 py-24 max-w-4xl mx-auto">
      <div className="text-center space-y-8 mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
          Hablemos
        </h1>
        <p className="text-lg text-black/70 max-w-2xl mx-auto leading-relaxed">
          ¿Tienes dudas sobre algún retiro? ¿Quieres organizar una experiencia
          privada? Estamos aquí para ayudarte.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* Instagram Section */}
        <div className="bg-white p-8 rounded-2xl border border-gray/20 flex flex-col justify-between hover:border-black/20 transition-colors">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-linear-to-tr from-[#f09433] via-[#bc1888] to-[#cc2366] text-white rounded-full flex items-center justify-center mb-4 text-xl">
              <FaInstagram />
            </div>
            <h2 className="text-2xl font-bold">Instagram</h2>
            <p className="text-gray text-sm leading-relaxed">
              Descubre nuestros retiros desde dentro. Fotos, vídeos y el
              ambiente real que se respira en cada experiencia.
            </p>
          </div>
          <div className="pt-8">
            <Button
              href="https://www.instagram.com/yay.experiences"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-linear-to-tr from-[#f09433] via-[#bc1888] to-[#cc2366] border-none text-white hover:opacity-90 hover:text-white"
            >
              Ver perfil
            </Button>
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-white p-8 rounded-2xl border border-transparent flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center mb-4 text-xl">
              <FaWhatsapp />
            </div>
            <h2 className="text-2xl font-bold">Comunidad</h2>
            <p className="text-black/70 text-sm leading-relaxed">
              Únete a nuestro grupo de WhatsApp para enterarte antes que nadie
              de los nuevos retiros y recibir tips de bienestar real.
            </p>
          </div>
          <div className="pt-8">
            <Button
              href="https://chat.whatsapp.com/B70aKrnocWsIaka1TVc22e"
              className="w-full bg-[#25D366] border-[#25D366] text-white hover:bg-[#128C7E] hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              Unirme al grupo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
