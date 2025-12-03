export interface Retreat {
  id: string;
  slug: string;
  title: string;
  location: string;
  description: string;
  fullDescription: string;
  activities: string[];
  program: string[];
  image: string; // Placeholder for now
  date: string;
  price: string;
}

export const retreats: Retreat[] = [
  {
    id: "1",
    slug: "sahara-calm",
    title: "Sahara Calm",
    location: "Desierto del Sahara, Marruecos",
    description: "Retiro en el desierto para desconectar del ruido.",
    fullDescription: "Vive la experiencia del silencio absoluto en las dunas del Sahara. Este retiro está diseñado para vaciar la mente y reconectar con lo esencial a través de la inmensidad del paisaje.",
    activities: [
      "Caminata meditativa en dunas",
      "Noches de astronomía",
      "Yoga al amanecer",
      "Cena tradicional bereber"
    ],
    program: [
      "Día 1: Llegada y bienvenida",
      "Día 2: Inmersión en el desierto",
      "Día 3: Silencio y estrellas",
      "Día 4: Regreso"
    ],
    image: "/assets/sahara.jpg",
    date: "Octubre 2025",
    price: "1200€"
  },
  {
    id: "2",
    slug: "nordic-bright",
    title: "Nordic Bright",
    location: "Islandia",
    description: "Retiro bajo auroras boreales.",
    fullDescription: "Un viaje a la tierra del hielo y el fuego. Disfruta de baños termales, paisajes volcánicos y la magia de las auroras boreales en un entorno de diseño nórdico.",
    activities: [
      "Baños termales",
      "Ruta de cascadas",
      "Fotografía nocturna",
      "Movilidad y estiramientos"
    ],
    program: [
      "Día 1: Reykjavik",
      "Día 2: Círculo Dorado",
      "Día 3: Costa Sur",
      "Día 4: Blue Lagoon"
    ],
    image: "/assets/noruega.jpg",
    date: "Noviembre 2025",
    price: "1800€"
  },
  {
    id: "3",
    slug: "tropical-relax",
    title: "Tropical Relax",
    location: "Islas Canarias, España",
    description: "Retiro volcánico y tropical.",
    fullDescription: "Sol, mar y tierra volcánica. Un retiro enfocado en la vitalidad, la buena comida y el movimiento consciente en un clima privilegiado.",
    activities: [
      "Surf para principiantes",
      "Senderismo volcánico",
      "Cata de vinos locales",
      "Taller de cocina canaria"
    ],
    program: [
      "Día 1: Bienvenida tropical",
      "Día 2: Mar y arena",
      "Día 3: Volcán y tierra",
      "Día 4: Despedida"
    ],
    image: "/assets/caribe.jpg",
    date: "Septiembre 2025",
    price: "950€"
  }
];

