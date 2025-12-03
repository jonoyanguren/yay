import Button from "@/components/ui/Button";

export default function ContactPage() {
  return (
    <div className="px-4 md:px-12 py-24 max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 md:gap-24">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tighter">
            Hablemos
          </h1>
          <p className="text-lg text-black/70 mb-12">
            ¿Tienes dudas sobre algún retiro? ¿Quieres organizar una experiencia
            privada para tu empresa? Escríbenos.
          </p>

          <div className="space-y-8">
            <div>
              <h3 className="font-bold mb-1">Email</h3>
              <a
                href="mailto:hola@yayretreats.com"
                className="text-lg hover:text-gray"
              >
                hola@yayretreats.com
              </a>
            </div>
            <div>
              <h3 className="font-bold mb-1">Social</h3>
              <div className="flex gap-4">
                <a href="#" className="hover:text-gray">
                  Instagram
                </a>
                <a href="#" className="hover:text-gray">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-gray/20">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nombre
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full bg-sand/30 border border-transparent focus:border-black px-4 py-3 rounded-lg outline-none transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full bg-sand/30 border border-transparent focus:border-black px-4 py-3 rounded-lg outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="interest" className="text-sm font-medium">
                Interés
              </label>
              <select
                id="interest"
                className="w-full bg-sand/30 border border-transparent focus:border-black px-4 py-3 rounded-lg outline-none transition-colors appearance-none"
              >
                <option>Información general</option>
                <option>Sahara Calm</option>
                <option>Nordic Bright</option>
                <option>Tropical Relax</option>
                <option>Retiros corporativos</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium">
                Mensaje
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full bg-sand/30 border border-transparent focus:border-black px-4 py-3 rounded-lg outline-none transition-colors"
              ></textarea>
            </div>

            <Button className="w-full">Enviar Mensaje</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
