import React from "react";

export default function AboutPage() {
  return (
    <div className="px-4 md:px-12 py-24 max-w-4xl mx-auto">
      <h1 className="text-4xl md:text-6xl font-bold mb-12 tracking-tighter">
        Sobre Nosotros
      </h1>

      <div className="space-y-8 text-lg md:text-xl leading-relaxed text-black/80">
        <p>
          YaY Retreats nació de una necesidad personal: desconectar del estrés
          digital sin tener que "conectar" con energías místicas.
        </p>
        <p>
          Nos gustan los retiros, pero no nos sentimos identificados con la
          estética tradicional del yoga o la meditación esotérica. Queríamos
          crear espacios donde el bienestar se entienda desde un punto de vista
          práctico: mover el cuerpo, comer bien, dormir mejor y disfrutar de
          experiencias reales.
        </p>

        <h2 className="text-2xl font-bold pt-8 text-black">
          Nuestra Filosofía
        </h2>
        <ul className="space-y-4">
          <li className="flex gap-4">
            <span className="font-bold text-black">Minimalismo:</span>
            <span className="text-black/70">
              Menos es más. Eliminamos el ruido visual y mental.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-black">Calidad:</span>
            <span className="text-black/70">
              En la comida, en los alojamientos y en las actividades.
            </span>
          </li>
          <li className="flex gap-4">
            <span className="font-bold text-black">Humanidad:</span>
            <span className="text-black/70">
              Grupos pequeños, trato cercano y desconexión digital real.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
}
