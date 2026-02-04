import Image from "next/image";
import Button from "@/components/ui/Button";
import {
  FaWineGlass,
  FaRegSmile,
  FaUsers,
  FaMobileAlt,
  FaWalking,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { BiCoffee, BiMusic, BiCookie, BiTime } from "react-icons/bi";

export default function ConceptPage() {
  return (
    <main className="w-full overflow-hidden">
      {/* HERO SECTION */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-black">
        <div className="relative z-10 container mx-auto px-4 md:px-12 text-center text-white max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tighter">
            Nuestro concepto
          </h1>
          <p className="text-2xl md:text-3xl font-medium text-green mb-8">
            Si no es YAY, no es.
          </p>
          <p className="text-xl md:text-2xl font-medium mb-8 text-white/90">
            Desconectar haciendo cosas que te hacen feliz.
          </p>
          <p className="text-lg md:text-xl leading-relaxed mb-12 max-w-2xl mx-auto text-white/80">
            No somos un retiro de incienso y mantras eternos. Somos retiros para
            personas reales: algo de yoga, buena comida, una copa de vino,
            conversaciones honestas y tiempo sin pantallas para recargar de
            verdad.
          </p>

          {/* Hero Bullets / Chips */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Yoga fácil, para relajar cuerpo y mente",
              "Actividades que disfrutas",
              "Buena comida y vino",
              "Cero postureo",
            ].map((item, idx) => (
              <span
                key={idx}
                className="bg-white/20 backdrop-blur-md border border-white/30 px-6 py-2 rounded-full text-sm md:text-base font-medium hover:bg-white/30 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 1: Prácticos, no místicos */}
      <section className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Prácticos, no místicos
            </h2>
            <p className="text-lg md:text-xl text-black/70 leading-relaxed">
              Adaptamos el nivel a cada grupo, desde principiantes hasta
              expertos. Nuestro enfoque es funcional: trabajamos músculos,
              aliviamos dolores y mejoramos tu postura para el día a día. Cero
              mantras, 100% bienestar físico.
            </p>
            <div className="bg-sand-light border-l-4 border-green p-6 rounded-r-xl">
              <p className="text-xl font-medium italic text-black/80">
                &quot;Menos ‘ohmmm’, más ‘qué bien he dormido esta noche’.&quot;
              </p>
            </div>
          </div>
          <div className="relative aspect-square md:aspect-4/5 rounded-2xl overflow-hidden">
            {/* Using me.jpg as placeholder for relaxed person */}
            <Image
              src="/assets/me.jpg"
              alt="Yoga accesible"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* BLOCK 2: Desconectar para recargar */}
      <section className="py-20 md:py-32 bg-sand-light px-4 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            Desconectar para recargar baterías
          </h2>
          <p className="text-lg md:text-xl text-black/70 mb-12 max-w-2xl mx-auto">
            Vivimos pegados a pantallas, notificaciones y prisas. Nuestros
            retiros son una pausa para ti: dormir mejor, respirar mejor, comer
            con calma, reírte, moverte y volver a casa con energía, no con más
            tareas pendientes.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <FaMobileAlt className="w-8 h-8" />,
                text: "Momentos sin móvil y sin reuniones",
              },
              {
                icon: <FaWalking className="w-8 h-8" />,
                text: "Ritmo lento, pero sin aburrimiento",
              },
              {
                icon: <FaUsers className="w-8 h-8" />,
                text: "Espacios para conectar con gente real",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-4 p-6 bg-sand rounded-xl"
              >
                <span className="text-4xl text-black/80">{item.icon}</span>
                <span className="font-medium text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BLOCK 3: Mucho más que yoga */}
      <section className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Mucho más que yoga
          </h2>
          <p className="text-lg md:text-xl text-black/70">
            Creamos grupos para desconectar juntos. El yoga es solo el
            principio: diseñamos actividades para que conectes con otras
            personas, te diviertas y compartas experiencias reales.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: <BiCoffee className="w-6 h-6" />,
              title: "Cata de café",
              desc: "Con expertos baristas",
            },
            {
              icon: <FaWineGlass className="w-6 h-6" />,
              title: "Vinos naturales",
              desc: "En buena compañía",
            },
            {
              icon: <BiMusic className="w-6 h-6" />,
              title: "Concierto íntimo",
              desc: "Swing y rock en directo",
            },
            {
              icon: <BiCookie className="w-6 h-6" />,
              title: "Cocina con nosotros",
              desc: "Cocinamos y comemos juntos",
            },
            {
              icon: <BiTime className="w-6 h-6" />,
              title: "Charlas slow",
              desc: "Productividad para vivir tranquilo",
            },
            {
              icon: <FaRegSmile className="w-6 h-6" />,
              title: "Risas aseguradas",
              desc: "Sin guiones ni etiquetas",
            },
          ].map((activity, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 border border-black/5 rounded-xl hover:border-black/20 hover:bg-sand-light transition-colors group"
            >
              <div className="p-3 bg-sand-light rounded-full group-hover:bg-white transition-colors text-black">
                {activity.icon}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-1">{activity.title}</h3>
                <p className="text-black/60 text-sm">{activity.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BLOCK 4: Para personas reales */}
      <section className="py-20 bg-green text-white px-4 md:px-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 tracking-tight">
            Para personas reales, con vidas reales
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-12 leading-relaxed">
            Da igual si nunca has pisado una esterilla de yoga o si trabajas 10
            horas al día frente a un ordenador. Diseñamos retiros para gente
            normal que necesita parar, respirar y volver a casa con la sensación
            de &quot;por fin he descansado de verdad&quot;.
          </p>
          <div className="inline-block border-2 border-white/30 px-8 py-4 rounded-full text-xl font-bold tracking-wide bg-white/10 backdrop-blur-sm rotate-1 hover:rotate-0 transition-transform">
            Sin dogmas. Sin dramas. Sin disfraces espirituales.
          </div>
        </div>
      </section>

      {/* BLOCK 5: Nuestros escenarios */}
      <section className="py-20 md:py-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            El mismo concepto, en lugares muy distintos
          </h2>
          <p className="text-lg md:text-xl text-black/70 max-w-2xl mx-auto">
            El corazón del retiro es el mismo: desconexión práctica y
            disfrutable. Lo que cambia es el escenario:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Sahara Calm",
              desc: "Silencio, estrellas y arena en el desierto marroquí.",
              img: "/assets/sahara.jpg",
            },
            {
              title: "Nordic Bright",
              desc: "Auroras, frío fuera y calidez dentro.",
              img: "/assets/noruega.jpg",
            },
            {
              title: "Tropical Relax",
              desc: "Islas Canarias, brisa, mar y sol suave.",
              img: "/assets/caribe.jpg",
            },
          ].map((place, idx) => (
            <div
              key={idx}
              className="group relative h-80 rounded-2xl overflow-hidden cursor-default"
            >
              <Image
                src={place.img}
                alt={place.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{place.title}</h3>
                <p className="text-white/90 leading-snug">{place.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 md:py-32 bg-sand-light text-center px-4 md:px-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            ¿Te vienes a recargar?
          </h2>
          <p className="text-lg md:text-xl text-black/70">
            No prometemos cambiar tu vida. Pero sí darte unos días para
            respirar, aflojar el cuerpo y recordar cómo se siente estar bien sin
            mirar el móvil cada dos minutos.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Button
              href="https://www.instagram.com/yay.experiences"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-linear-to-tr from-[#f09433] via-[#bc1888] to-[#cc2366] text-white border-none hover:opacity-90 hover:text-white gap-2 bg-transparent!"
            >
              <FaInstagram className="text-xl" />
              Instagram
            </Button>
            <Button
              href="https://chat.whatsapp.com/B70aKrnocWsIaka1TVc22e"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366]! text-white border-none hover:bg-[#128C7E]! hover:text-white gap-2"
            >
              <FaWhatsapp className="text-xl" />
              Comunidad WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
