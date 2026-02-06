import type { Retreat } from "@/lib/types";

export type { Retreat };

/** Used only by scripts/seed.ts to populate the DB. App reads retreats from DB via API routes. */
export const retreats: Retreat[] = [
  {
    id: "1",
    slug: "sahara-calm",
    title: "Sahara Calm",
    location: "Desierto del Sahara, Marruecos",
    description:
      "10 días para bajar revoluciones en Merzouga: yoga funcional, brunch sin prisas, actividades reales cada tarde y noches de descanso en el desierto.",
    fullDescription:
      "Sahara Calm no es un retiro espiritual; es un reset práctico. Llegamos a Errachidia, descansamos y nos movemos al desierto con calma. Cada día combina amaneceres en silencio con té, yoga y meditación, brunch largo, tardes con experiencias locales (quad, camello, música bereber, cocina marroquí, aromaterapia, fotografía en las dunas, productividad) y Yin Yoga para cerrar. Sin pantallas, sin prisa, solo espacio para volver mejor de lo que llegaste.",
    activities: [
      "Meditación y yoga cada mañana",
      "Yin Yoga diario al atardecer",
      "Ruta en quad por las dunas",
      "Paseo en camello al atardecer",
      "Música bereber en directo",
      "Taller de cocina marroquí",
      "Taller de aromaterapia",
      "Fotografía en las dunas",
      "Taller energía y productividad"
    ],
    program: [
      "Día 1: Llegada nocturna a Errachidia y descanso",
      "Día 2: Traslado a Merzouga, bienvenida y Yin Yoga",
      "Días 3-8: Yoga + brunch + actividad de tarde + Yin Yoga",
      "Día 9: Cierre e integración, vuelta a Errachidia",
      "Día 10: Vuelo temprano de regreso"
    ],
    image: "/assets/sahara.jpg",
    date: "28 diciembre 2025 – 6 enero 2026",
    price: "Consultar plaza",
    arrivalIntro:
      "Llega como prefieras: te ayudamos a coordinar vuelos, coche o transfer para que encaje con tus horarios y con el grupo.",
    arrivalOptions: [
      {
        title: "Opción Yay (propuesta)",
        detail:
          "Te proponemos vuelo combinado a Errachidia y transfer grupal desde el aeropuerto. Última noche en Errachidia para salir temprano sin prisas.",
      },
      {
        title: "Opción híbrida",
        detail:
          "Vuelas a Marruecos y alquilas coche allí (recomendamos híbrida). Ruta hasta Merzouga con parking en el alojamiento. Te compartimos puntos de interés en el camino.",
      },
      {
        title: "Opción aventurera",
        detail:
          "Vienes con tu propio coche hasta Merzouga. Ruta libre y flexible. Coordinamos horario de llegada al alojamiento para que entres con el grupo.",
      },
    ],
    dayByDay: [
      {
        day: "Día 1",
        items: [
          "23:49 llegada a Errachidia",
          "00:15 transfer al hotel",
          "Check-in y descanso total",
        ],
      },
      {
        day: "Día 2",
        items: [
          "10:00-11:00 desayuno",
          "11:30 transfer a Merzouga",
          "15:00-16:30 descanso",
          "17:00 actividad suave bienvenida",
          "18:30-19:30 Yin Yoga",
          "20:30 cena",
        ],
      },
      {
        day: "Días 3-8",
        items: [
          "08:00 amanecer en silencio con té",
          "08:30-09:45 meditación y yoga",
          "10:00-11:30 brunch",
          "11:30-16:30 tiempo libre",
          "16:30-18:30 actividad de la tarde (quad, camello, cocina marroquí, música bereber, aromaterapia, foto en dunas, productividad)",
          "19:00-20:00 Yin Yoga",
          "20:30 cena · 21:30-22:30 tiempo social · 23:00 descanso",
        ],
      },
      {
        day: "Día 9",
        items: [
          "Yoga + brunch",
          "12:00-13:00 cierre práctico",
          "13:30 transfer a Errachidia",
          "17:30-18:00 llegada al hotel",
          "20:00 cena temprana · 21:30 dormir",
        ],
      },
      {
        day: "Día 10",
        items: ["04:00 despertar", "04:30 transfer aeropuerto", "07:00 vuelo"],
      },
    ],
    includes: [
      "6 noches en alojamiento en el desierto",
      "Todas las comidas (desayuno/brunch, cena)",
      "Clases diarias de meditación y yoga",
      "Actividades y talleres de tarde incluidos en programa",
      "Regalo de bienvenida",
    ],
    notIncludes: [
      "Vuelos y traslados (te ayudamos a organizarlos)",
      "Seguro de viaje recomendado (enviamos descuento Iati)",
    ],
    extraIdeas: [
      "Taller de vision board",
      "Ceremonia del té marroquí",
      "Charla sobre la vida en el desierto",
      "Observación del cielo nocturno",
      "Taller de pan tradicional",
      "Encuentro con familia nómada bereber",
      "Cuentacuentos tradicional alrededor del fuego",
    ]
  },
  {
    id: "4",
    slug: "indian-ocean-reset",
    title: "Indian Ocean Reset – Zanzíbar",
    location: "Zanzíbar",
    description:
      "7 días/6 noches junto al Índico para bajar ritmo: yoga funcional, Yin Yoga, talleres para desconectar y mucho tiempo libre de playa.",
    fullDescription:
      "Indian Ocean Reset es un retiro de 7 días en Zanzíbar para quienes necesitan un cambio de escenario real: sol, mar y un ritmo lento que ayude a soltar tensión. Combinamos movimiento consciente, descanso profundo y experiencias para desconectar, con mucho tiempo libre para playa y exploración. El objetivo no es hacer más, sino sentirte mejor durante el día y dormir mejor por la noche.",
    activities: [
      "Yoga funcional por la mañana",
      "Yin Yoga al atardecer",
      "Talleres y actividades para desconectar",
      "Tiempo libre de playa y descanso",
      "Respiración y movilidad accesible",
      "Buena comida y espacios sin presión"
    ],
    program: [
      "Día 1: Llegada, bienvenida y yoga suave",
      "Días 2-6: Yoga mañana, brunch, tarde libre/actividad, Yin Yoga, cena",
      "Día 7: Yoga de cierre, brunch y despedida"
    ],
    image: "/assets/caribe.jpg",
    date: "Fechas por anunciar",
    price: "Consultar plaza",
    dayByDay: [
      {
        day: "Día 1 – Llegada & aterrizaje",
        items: [
          "Check-in desde las 15:00",
          "17:30 bienvenida al retiro",
          "18:30 yoga suave para soltar el viaje",
          "20:00 cena"
        ]
      },
      {
        day: "Días 2-6 – Ritmo completo",
        items: [
          "08:00 desayuno",
          "09:00-10:15 yoga (movilidad y activación)",
          "Tiempo libre: playa / descanso / lectura",
          "13:00 brunch",
          "Tarde libre o actividad/taller especial",
          "18:00-19:00 Yin Yoga",
          "20:30 cena · tiempo libre"
        ]
      },
      {
        day: "Día 7 – Cierre & despedida",
        items: [
          "08:00 desayuno",
          "09:00 yoga suave de cierre",
          "10:30 espacio final",
          "12:00 brunch",
          "Salida libre"
        ]
      }
    ],
    includes: [
      "Alojamiento",
      "Sesiones de yoga (vinyasa/funcional/yin)",
      "Actividades y talleres programados",
      "Comidas indicadas en el programa"
    ],
    notIncludes: [
      "Vuelos y transporte hasta el destino",
      "Seguro de viaje o médico",
      "Gastos personales",
      "Actividades opcionales no incluidas"
    ]
  },

  {
    id: "3",
    slug: "tropical-relax",
    title: "Tropical Relax",
    location: "Lanzarote",
    description:
      "4 días/3 noches en Lanzarote para bajar ritmo: yoga funcional, Yin Yoga, actividades para desconectar y tiempo libre de playa.",
    fullDescription:
      "Tropical Relax es una pausa consciente en Lanzarote para soltar tensión, descansar y reconectar con tu ritmo. Cuatro días en un entorno volcánico y oceánico para moverte, respirar mejor y compartir sin prisa. Yoga accesible, Yin Yoga al atardecer, talleres y mucho tiempo libre. No se trata de exigir más, sino de sentirte bien durante unos días y llevarte esa calma a casa.",
    activities: [
      "Yoga funcional por la mañana",
      "Yin Yoga por la tarde",
      "Talleres y actividades para desconectar",
      "Tiempo libre para playa y paseos",
      "Respiración y movilidad accesible"
    ],
    program: [
      "Jueves: Llegada, bienvenida e Yin Yoga",
      "Viernes: Yoga, brunch, actividad + Yin Yoga",
      "Sábado: Yoga, brunch, actividad + Yin Yoga",
      "Domingo: Yoga de cierre y despedida"
    ],
    image: "/assets/caribe.jpg",
    date: "Fechas por anunciar",
    price: "Consultar plaza",
    dayByDay: [
      {
        day: "Jueves – Llegada & bienvenida",
        items: [
          "16:00 check-in",
          "17:00 bienvenida al retiro",
          "18:00 Yin Yoga",
          "19:00 ice breaker",
          "20:30 cena de bienvenida"
        ]
      },
      {
        day: "Viernes – Cuerpo, grupo y descanso",
        items: [
          "09:00-10:30 meditación + yoga vinyasa",
          "11:30 brunch",
          "14:30 tiempo libre (paseo, playa, descanso)",
          "18:00 actividad",
          "19:00 Yin Yoga",
          "20:30 cena"
        ]
      },
      {
        day: "Sábado – Profundizar sin forzar",
        items: [
          "09:00-10:30 meditación + yoga vinyasa",
          "11:30 brunch",
          "14:30 tiempo libre (paseo, playa, descanso)",
          "18:00 actividad",
          "19:00 Yin Yoga",
          "20:30 cena"
        ]
      },
      {
        day: "Domingo – Cierre y despedida",
        items: [
          "09:00-10:30 meditación + yoga vinyasa",
          "11:00 brunch",
          "12:00 actividad de cierre",
          "Salida flexible"
        ]
      }
    ],
    includes: [
      "Alojamiento",
      "Sesiones de yoga (vinyasa/funcional/yin yoga)",
      "Actividades y talleres programados",
      "Comidas indicadas en el programa"
    ],
    notIncludes: [
      "Vuelos y transporte hasta el destino",
      "Seguro de viaje o médico",
      "Gastos personales",
      "Actividades opcionales no incluidas"
    ]
  },
  {
    id: "5",
    slug: "atlantic-reset",
    title: "Atlantic Reset – Cantabria",
    location: "Cantabria",
    description:
      "4 días/3 noches junto al mar para combinar surf, yoga y descanso en un ritmo equilibrado.",
    fullDescription:
      "Atlantic Reset es una pausa activa en la costa de Cantabria para mover el cuerpo y cambiar de ritmo a través del mar, el yoga y el descanso. Cuatro días para surfear sin prisas, practicar yoga funcional por la mañana y Yin Yoga al atardecer, con tiempo libre para naturaleza y calma. El foco está en disfrutar del océano, no en rendir perfecto.",
    activities: [
      "Sesiones de surf adaptadas a nivel",
      "Yoga funcional por la mañana",
      "Yin Yoga por la tarde para soltar",
      "Actividades para desconectar",
      "Tiempo libre de playa y paseos"
    ],
    program: [
      "Jueves: Llegada, bienvenida y yoga suave",
      "Viernes: Yoga, surf, brunch, tarde libre, Yin Yoga",
      "Sábado: Yoga, surf, brunch, tarde libre, Yin Yoga",
      "Domingo: Yoga de cierre, brunch y despedida"
    ],
    image: "/assets/noruega.jpg",
    date: "Fechas por anunciar",
    price: "Consultar plaza",
    dayByDay: [
      {
        day: "Jueves – Llegada & activación suave",
        items: [
          "16:00 check-in",
          "17:00 bienvenida al retiro",
          "18:00 yoga suave de activación",
          "19:30 tiempo libre / paseo",
          "20:30 cena de bienvenida"
        ]
      },
      {
        day: "Viernes – Mar, movimiento y descanso",
        items: [
          "08:30 desayuno",
          "09:30 yoga (movilidad y preparación surf)",
          "11:30 sesión de surf",
          "14:00 brunch",
          "16:00 tiempo libre (paseo, descanso, playa)",
          "18:30 Yin Yoga",
          "20:00 cena"
        ]
      },
      {
        day: "Sábado – Surf & desconexión",
        items: [
          "08:30 desayuno",
          "09:30 yoga",
          "11:30 sesión de surf",
          "14:00 brunch",
          "16:00 tiempo libre (naturaleza, descanso, actividad de desconexión)",
          "18:30 Yin Yoga",
          "20:00 cena"
        ]
      },
      {
        day: "Domingo – Cierre & despedida",
        items: [
          "08:30 desayuno",
          "09:30 yoga suave de cierre",
          "11:00 espacio final / despedida",
          "12:30 brunch",
          "Salida libre"
        ]
      }
    ],
    includes: [
      "Alojamiento",
      "Sesiones de yoga (vinyasa/funcional/yin yoga)",
      "Actividades y talleres programados",
      "Comidas indicadas en el programa"
    ],
    notIncludes: [
      "Vuelos y transporte hasta el destino",
      "Seguro de viaje o médico",
      "Gastos personales",
      "Actividades opcionales no incluidas"
    ]
  }
];

