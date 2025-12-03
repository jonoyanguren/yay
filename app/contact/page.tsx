import Button from "@/components/ui/Button";

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
        {/* Email Section */}
        <div className="bg-white p-8 rounded-2xl border border-gray/20 flex flex-col justify-between hover:border-black/20 transition-colors">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center mb-4 text-xl">
              ✉️
            </div>
            <h2 className="text-2xl font-bold">Email</h2>
            <p className="text-gray text-sm leading-relaxed">
              Para consultas generales, prensa o colaboraciones. Respondemos en
              24-48h.
            </p>
          </div>
          <div className="pt-8">
            <a
              href="mailto:hola@yayretreats.com"
              className="text-lg font-medium border-b border-black pb-0.5 hover:text-gray hover:border-gray transition-colors"
            >
              hola@yayretreats.com
            </a>
          </div>
        </div>

        {/* Community Section */}
        <div className="bg-white p-8 rounded-2xl border border-transparent flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center mb-4 text-xl">
              💬
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

      {/* Social Links */}
      <div className="mt-16 text-center pt-16 border-t border-gray/10">
        <h3 className="font-bold mb-6">Síguenos en redes</h3>
        <div className="flex justify-center gap-8">
          <a
            href="https://www.instagram.com/yay.experiences"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray hover:text-black transition-colors"
          >
            Instagram &nearr;
          </a>
          <a href="#" className="text-gray hover:text-black transition-colors">
            LinkedIn &nearr;
          </a>
        </div>
      </div>
    </div>
  );
}
