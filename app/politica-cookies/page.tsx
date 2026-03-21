import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Uso de cookies y tecnologías similares en el sitio de YaY Experiences (Google Tag Manager, GA4, Meta Pixel, Stripe).",
  alternates: {
    canonical: "/politica-cookies",
  },
};

export default function PoliticaCookiesPage() {
  return (
    <article className="px-4 md:px-12 py-24 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
          Política de cookies
        </h1>
        <p className="text-lg text-black/70 font-medium">
          YaY Experiences (Slow Project SL)
        </p>
      </header>

      <div className="space-y-10 text-black/80 leading-relaxed text-[15px] md:text-base">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            1. Qué son las cookies
          </h2>
          <p>
            Las cookies son pequeños archivos que se almacenan en tu dispositivo
            cuando visitas un sitio web. También pueden usarse tecnologías
            similares (píxeles, almacenamiento local, identificadores en el
            navegador) con fines análogos.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            2. Responsable
          </h2>
          <p>
            El uso de cookies en este sitio corresponde a{" "}
            <strong className="text-black">Slow Project SL</strong> (nombre
            comercial <strong className="text-black">YaY Experiences</strong>), con
            los datos de contacto indicados en la{" "}
            <Link
              href="/privacidad"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              Política de privacidad
            </Link>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            3. Google Tag Manager (GTM)
          </h2>
          <p>
            Este sitio utiliza{" "}
            <strong className="text-black">Google Tag Manager</strong>, una
            herramienta de Google que permite gestionar de forma centralizada
            etiquetas y scripts (por ejemplo, de analítica o publicidad) sin
            modificar cada vez el código de la página.
          </p>
          <p>
            GTM puede depositar o leer cookies o identificadores según la
            configuración activa. A través de GTM se cargan, entre otras, las
            herramientas descritas en los apartados siguientes.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            4. Google Analytics 4 (GA4)
          </h2>
          <p>
            Utilizamos <strong className="text-black">Google Analytics 4</strong>{" "}
            para conocer de forma agregada cómo se usa el sitio (páginas vistas,
            origen del tráfico, dispositivos, etc.). Google puede tratar datos
            conectados con la navegación según su política.
          </p>
          <p>
            Más información:{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              Política de privacidad de Google
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            5. Meta Pixel (Facebook)
          </h2>
          <p>
            Utilizamos el <strong className="text-black">Meta Pixel</strong>{" "}
            (Facebook) para medir conversiones, optimizar anuncios y elaborar
            audiencias cuando corresponda. Meta puede usar cookies y datos
            asociados a tu navegador o dispositivo.
          </p>
          <p>
            Más información:{" "}
            <a
              href="https://www.facebook.com/privacy/policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              Política de privacidad de Meta
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            6. Reservas y Stripe
          </h2>
          <p>
            Los formularios de reserva redirigen o integran el pago mediante{" "}
            <strong className="text-black">Stripe</strong>. Durante el proceso,
            Stripe puede utilizar cookies y tecnologías propias para la seguridad
            del pago, prevención de fraude y funcionamiento del checkout. Los
            datos bancarios no son tratados directamente por nuestros servidores;
            los gestiona Stripe según su documentación.
          </p>
          <p>
            Más información:{" "}
            <a
              href="https://stripe.com/es/legal/cookies-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              Política de cookies de Stripe
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            7. Tipos de cookies según su finalidad
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-black">Técnicas o necesarias:</strong>{" "}
              permiten la navegación, la seguridad básica o funciones esenciales
              del sitio (por ejemplo, recordar preferencias imprescindibles para
              el funcionamiento).
            </li>
            <li>
              <strong className="text-black">Medición y analítica:</strong>{" "}
              ayudan a entender el uso del sitio (p. ej. GA4 cargado vía GTM).
            </li>
            <li>
              <strong className="text-black">Publicidad y seguimiento:</strong>{" "}
              relacionadas con campañas y mediciones de rendimiento (p. ej. Meta
              Pixel cargado vía GTM).
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            8. Base legal y consentimiento
          </h2>
          <p>
            Las cookies estrictamente necesarias para prestar el servicio
            solicitado o para fines de seguridad pueden basarse en la ejecución
            del contrato o en interés legítimo, según el caso. Las cookies de
            analítica o de publicidad/terceros no esenciales, cuando así lo exija
            la normativa aplicable, se activan cuando nos has dado tu
            consentimiento (por ejemplo, mediante el banner o herramienta de
            consentimiento configurada en el sitio o en GTM).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            9. Cómo gestionar o desactivar cookies
          </h2>
          <p>
            Puedes eliminar las cookies desde la configuración de tu navegador,
            bloquearlas por sitio o activar el modo «No rastrear» si está
            disponible. Ten en cuenta que desactivar ciertas cookies puede afectar
            al funcionamiento de partes del sitio o al proceso de pago.
          </p>
          <p>
            También puedes revisar las opciones que ofrecen Google y Meta para
            personalizar anuncios y datos vinculados a tu cuenta, cuando proceda.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            10. Más información y cambios
          </h2>
          <p>
            Para el tratamiento de datos personales asociado a estas tecnologías,
            consulta la{" "}
            <Link
              href="/privacidad"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              Política de privacidad
            </Link>
            . YaY Experiences puede actualizar esta política cuando cambien las
            herramientas utilizadas o la normativa.
          </p>
        </section>
      </div>
    </article>
  );
}
