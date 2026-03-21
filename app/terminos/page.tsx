import type { Metadata } from "next";
import Link from "next/link";
import { CANCELLATION_POLICY } from "@/lib/cancellation-policy";

export const metadata: Metadata = {
  title: "Términos y condiciones de contratación",
  description:
    "Condiciones de contratación de los retiros YaY Experiences (Slow Project SL).",
  alternates: {
    canonical: "/terminos",
  },
};

export default function TerminosPage() {
  return (
    <article className="px-4 md:px-12 py-24 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
          Términos y condiciones de contratación
        </h1>
        <p className="text-lg text-black/70 font-medium">
          YaY Experiences (Slow Project SL)
        </p>
      </header>

      <div className="space-y-10 text-black/80 leading-relaxed text-[15px] md:text-base">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            1. Identificación del titular
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-black">Titular:</strong> Slow Project SL
            </li>
            <li>
              <strong className="text-black">CIF:</strong> B44743805
            </li>
            <li>
              <strong className="text-black">Dirección:</strong> La Sia 117,
              09566 Espinosa de los Monteros (Burgos), España
            </li>
            <li>
              <strong className="text-black">Email:</strong>{" "}
              <a
                href="mailto:info@yayexperiences.com"
                className="text-black underline underline-offset-2 hover:text-black/70"
              >
                info@yayexperiences.com
              </a>
            </li>
            <li>
              <strong className="text-black">Nombre comercial:</strong> YaY
              Experiences
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            2. Objeto
          </h2>
          <p>
            El presente documento regula las condiciones de contratación de los
            retiros organizados por YaY Experiences.
          </p>
          <p>
            YaY Experiences actúa como organizador directo de experiencias de
            retiro que pueden incluir:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Alojamiento</li>
            <li>Comidas</li>
            <li>
              Actividades (yoga, bienestar, excursiones u otras experiencias)
            </li>
          </ul>
          <p>
            El transporte hasta el destino del retiro no está incluido, salvo
            indicación expresa.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-black tracking-tight">
            3. Reserva y formas de pago
          </h2>
          <p>
            La reserva de un retiro se formaliza mediante el pago correspondiente
            a través de la plataforma segura Stripe.
          </p>
          <p>
            Dependiendo del retiro, podrán aplicarse dos modalidades de pago:
          </p>
          <div className="space-y-3 pl-0 md:pl-1">
            <div>
              <h3 className="font-bold text-black text-base mb-1">
                a) Pago completo
              </h3>
              <p>
                En retiros de importe reducido, el pago se realiza en su totalidad
                en el momento de la reserva.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-black text-base mb-1">
                b) Pago fraccionado
              </h3>
              <p>
                En retiros de mayor importe, la reserva se formaliza mediante:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-2">
                <li>Un depósito inicial</li>
                <li>
                  El pago del importe restante dentro del plazo indicado antes del
                  inicio del retiro
                </li>
              </ul>
            </div>
          </div>
          <p>
            La plaza se considera confirmada únicamente tras la recepción del pago
            (total o depósito, según corresponda).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-black tracking-tight">
            4. Política de cancelación
          </h2>
          <p>
            Si necesitas cancelar tu reserva, aplicará la siguiente escala según la
            antelación con la que comuniques la cancelación. {CANCELLATION_POLICY.intro}
          </p>
          <div className="overflow-x-auto rounded-lg border border-black/10">
            <table className="w-full min-w-[320px] text-left text-sm border-collapse">
              <thead>
                <tr className="bg-black/4 border-b border-black/10">
                  <th className="px-3 py-3 font-bold text-black align-top">
                    Antelación (días naturales hasta el inicio del retiro)
                  </th>
                  <th className="px-3 py-3 font-bold text-black align-top w-[min(40%,200px)]">
                    Devolución
                  </th>
                </tr>
              </thead>
              <tbody>
                {CANCELLATION_POLICY.rows.map((row) => (
                  <tr
                    key={row.antelacion}
                    className="border-b border-black/10 last:border-b-0"
                  >
                    <td className="px-3 py-3 align-top">{row.antelacion}</td>
                    <td className="px-3 py-3 align-top">{row.devolucion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>{CANCELLATION_POLICY.baseAmountNote}</p>
          <p>{CANCELLATION_POLICY.processingNote}</p>
          <p>
            Estas condiciones permiten organizar el retiro con tiempo y cuidar la
            experiencia del grupo.
          </p>
          <p>
            En caso de que YaY Experiences cancele el retiro, se devolverá el
            importe íntegro abonado por el participante.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            5. Modificaciones y cancelaciones por parte de la empresa
          </h2>
          <p>YaY Experiences se reserva el derecho de:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Modificar aspectos del retiro por razones organizativas, climáticas o
              de fuerza mayor
            </li>
            <li>
              Sustituir actividades o proveedores por otros de características
              similares
            </li>
          </ul>
          <p>
            En caso de cancelación total del retiro por parte de la empresa, el
            cliente tendrá derecho a la devolución íntegra de las cantidades
            abonadas.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            6. Servicios de terceros
          </h2>
          <p>
            Algunos servicios incluidos en los retiros pueden ser prestados por
            terceros (alojamientos, guías, actividades, excursiones, etc.).
          </p>
          <p>YaY Experiences no será responsable de:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Incidencias, retrasos o cancelaciones atribuibles a dichos
              proveedores
            </li>
            <li>Cambios derivados de la operativa de terceros</li>
          </ul>
          <p>
            No obstante, YaY Experiences selecciona cuidadosamente a sus
            colaboradores.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            7. Limitación de responsabilidad
          </h2>
          <p>YaY Experiences no será responsable de:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Pérdidas, robos o daños personales durante el retiro</li>
            <li>Lesiones derivadas de la participación en actividades</li>
            <li>
              Problemas derivados de viajes, transporte o retrasos externos
            </li>
            <li>
              Situaciones derivadas de condiciones médicas preexistentes del
              participante
            </li>
          </ul>
          <p>
            En cualquier caso, la responsabilidad máxima de YaY Experiences se
            limitará al importe total abonado por el cliente.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            8. Condiciones de participación
          </h2>
          <p>Al reservar un retiro, el participante declara que:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Es mayor de edad</li>
            <li>Se encuentra en condiciones físicas y mentales adecuadas</li>
            <li>Puede participar en actividades físicas como yoga o excursiones</li>
          </ul>
          <p>No se permite la participación de menores de edad.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            9. Asunción de riesgos
          </h2>
          <p>El participante reconoce que:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Las actividades de yoga y bienestar implican riesgos físicos
            </li>
            <li>Existe posibilidad de lesiones</li>
          </ul>
          <p>
            El participante asume voluntariamente dichos riesgos y exonera a YaY
            Experiences de responsabilidad, salvo en casos de negligencia grave.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            10. Seguros
          </h2>
          <p>
            YaY Experiences dispone de un seguro de responsabilidad civil.
          </p>
          <p>
            Se recomienda a los participantes contratar un seguro de viaje que
            cubra:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Cancelaciones</li>
            <li>Asistencia médica</li>
            <li>Accidentes</li>
            <li>Pérdida de equipaje</li>
          </ul>
          <p>
            YaY Experiences podrá facilitar recomendaciones o descuentos en
            seguros, sin asumir responsabilidad sobre los mismos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            11. Protección de datos
          </h2>
          <p>
            Los datos personales serán tratados conforme a la normativa vigente.
            Para más información, consulta la{" "}
            <Link
              href="/privacidad"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              Política de privacidad
            </Link>{" "}
            y la{" "}
            <Link
              href="/politica-cookies"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              Política de cookies
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            12. Legislación aplicable
          </h2>
          <p>
            Las presentes condiciones se rigen por la legislación española.
          </p>
          <p>
            Las controversias se someterán a los juzgados y tribunales del
            domicilio del consumidor.
          </p>
        </section>
      </div>
    </article>
  );
}
