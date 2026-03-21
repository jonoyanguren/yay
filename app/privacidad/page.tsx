import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Política de privacidad de YaY Experiences (Slow Project SL). Tratamiento de datos personales.",
  alternates: {
    canonical: "/privacidad",
  },
};

export default function PrivacidadPage() {
  return (
    <article className="px-4 md:px-12 py-24 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2">
          Política de privacidad
        </h1>
        <p className="text-lg text-black/70 font-medium">
          YaY Experiences (Slow Project SL)
        </p>
      </header>

      <div className="space-y-10 text-black/80 leading-relaxed text-[15px] md:text-base">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            1. Responsable del tratamiento
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-black">Responsable:</strong> Slow Project SL
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
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            2. Datos que recopilamos
          </h2>
          <p>
            <strong className="text-black">
              Datos que nos facilitas directamente
            </strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-black">Identificación y contacto:</strong>{" "}
              nombre, email y teléfono cuando los introduces en formularios de
              contacto, reserva o comunicación directa.
            </li>
            <li>
              <strong className="text-black">Lista de espera:</strong> datos que
              solicite el formulario (habitualmente email y, si se piden, nombre u
              otros campos opcionales) asociados al retiro de interés.
            </li>
            <li>
              <strong className="text-black">Reserva y pago (Stripe):</strong> los
              datos necesarios para formalizar el cobro los introduce el usuario en
              el checkout de Stripe. En nuestros sistemas pueden constar, entre
              otros, identificadores de cliente, sesión o pago en Stripe, importes,
              estado de la reserva y datos de contacto vinculados a la compra.
            </li>
          </ul>
          <p>
            <strong className="text-black">
              Datos generados al usar el sitio o herramientas internas
            </strong>
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-black">Área de administración:</strong>{" "}
              credenciales de acceso y datos técnicos de sesión (por ejemplo
              cookies o tokens) para personal autorizado que gestiona reservas y
              contenidos.
            </li>
            <li>
              <strong className="text-black">Navegación, seguridad y hosting:</strong>{" "}
              dirección IP, fecha y hora de la solicitud, tipo de navegador,
              páginas visitadas u otros datos técnicos que pueden registrarse en
              los servidores o en el proveedor de alojamiento e infraestructura,
              con fines de seguridad, diagnóstico o cumplimiento legal.
            </li>
            <li>
              <strong className="text-black">Medición y publicidad:</strong>{" "}
              mediante Google Tag Manager pueden cargarse Google Analytics 4 y Meta
              Pixel; estos servicios pueden tratar datos relativos al uso del sitio
              o a interacciones con anuncios, según su configuración y tu
              consentimiento cuando aplique. El detalle por cookies se describe en
              la{" "}
              <Link
                href="/politica-cookies"
                className="text-black underline underline-offset-2 hover:text-black/70"
              >
                Política de cookies
              </Link>
              .
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            3. Finalidad del tratamiento
          </h2>
          <p>Tratamos los datos con las siguientes finalidades:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Gestionar reservas de retiros y cobros asociados</li>
            <li>Gestionar inscripciones en lista de espera</li>
            <li>Comunicarnos con los usuarios</li>
            <li>Enviar información relacionada con los servicios contratados</li>
            <li>Atender consultas</li>
            <li>
              Permitir el acceso seguro al área de administración y mantener la
              seguridad del sitio
            </li>
            <li>
              Medir audiencia, analizar el uso del sitio y, en su caso, optimizar
              campañas publicitarias o conversiones (GA4, Meta Pixel), según la
              base legal aplicable
            </li>
            <li>Cumplir obligaciones legales aplicables</li>
          </ul>
          <p className="pt-1">
            <strong className="text-black">Ejemplos de correos que puedes recibir</strong>{" "}
            (según tu relación con nosotros):
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              Confirmación de reserva con el detalle de tu pedido (habitación,
              extras, importes pagados y pendientes).
            </li>
            <li>
              Mensaje con enlace para completar el pago pendiente (factura de saldo
              gestionada con Stripe).
            </li>
            <li>
              Aviso de que has completado el pago total del retiro y recordatorio de
              próximos pasos.
            </li>
            <li>
              Información práctica en los días previos al retiro (horarios, punto de
              encuentro, qué llevar, últimos detalles).
            </li>
            <li>
              Avisos puntuales relacionados con la coordinación o asistencia al
              retiro.
            </li>
            <li>
              Lista de espera: confirmación de tu inscripción y, si aplica, avisos de
              plaza disponible o nuevas convocatorias.
            </li>
            <li>Respuesta a consultas enviadas por contacto o respondiendo a un email nuestro.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            4. Legitimación
          </h2>
          <p>La base legal para el tratamiento de datos puede ser:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>La ejecución de un contrato o medidas precontractuales (reserva)</li>
            <li>El consentimiento del usuario (p. ej. cookies no esenciales o comunicaciones opcionales)</li>
            <li>
              El interés legítimo en la seguridad del sitio, la prevención del
              fraude o el buen funcionamiento técnico, debidamente equilibrado con
              tus derechos
            </li>
            <li>El cumplimiento de obligaciones legales</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            5. Conservación de los datos
          </h2>
          <p>Los datos se conservarán:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Mientras exista relación contractual o sea necesario para la finalidad</li>
            <li>Durante el tiempo necesario para cumplir obligaciones legales</li>
            <li>
              En el caso de cookies o datos analíticos, según la duración indicada
              por cada proveedor o hasta que retires el consentimiento cuando
              proceda
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            6. Destinatarios
          </h2>
          <p>Los datos podrán ser compartidos con:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-black">Stripe</strong> (y entidades
              colaboradoras necesarias para el pago) para la gestión de cobros y
              prevención de fraude
            </li>
            <li>
              <strong className="text-black">Google</strong> (p. ej. Google Tag
              Manager, Google Analytics) y <strong className="text-black">Meta</strong>{" "}
              (Facebook Pixel), cuando esas herramientas estén activas y según su
              política y tu configuración de consentimiento
            </li>
            <li>
              Proveedores de alojamiento, infraestructura, correo transaccional u
              otros servicios necesarios para la ejecución del retiro o el
              funcionamiento del sitio (alojamiento, actividades, etc.), cuando sea
              necesario
            </li>
          </ul>
          <p>No se venderán datos a terceros.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            7. Transferencias internacionales
          </h2>
          <p>
            Algunos proveedores (como Stripe, Google o Meta) pueden estar ubicados
            fuera del Espacio Económico Europeo.
          </p>
          <p>
            En estos casos, se aplicarán las garantías adecuadas conforme al RGPD
            (por ejemplo, cláusulas contractuales tipo u otras medidas reconocidas).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            8. Derechos del usuario
          </h2>
          <p>El usuario puede ejercer sus derechos de:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Acceso</li>
            <li>Rectificación</li>
            <li>Supresión</li>
            <li>Limitación</li>
            <li>Oposición</li>
            <li>Portabilidad</li>
          </ul>
          <p>
            Enviando un email a:{" "}
            <a
              href="mailto:info@yayexperiences.com"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              info@yayexperiences.com
            </a>
          </p>
          <p>
            Si el tratamiento se basa en el consentimiento, puedes retirarlo en
            cualquier momento sin afectar a la licitud del tratamiento previo a
            dicha retirada.
          </p>
          <p>
            También tienes derecho a reclamar ante la Agencia Española de
            Protección de Datos (
            <a
              href="https://www.aepd.es"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              www.aepd.es
            </a>
            ).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            9. Seguridad
          </h2>
          <p>
            YaY Experiences adopta medidas técnicas y organizativas adecuadas para
            proteger los datos personales.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            10. Cambios en la política
          </h2>
          <p>
            YaY Experiences se reserva el derecho de modificar esta política para
            adaptarla a novedades legales o cambios en la actividad.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-black tracking-tight">
            11. Cookies
          </h2>
          <p>
            Este sitio utiliza cookies y tecnologías similares, incluidas las
            asociadas a Google Tag Manager, Google Analytics 4, Meta Pixel y el
            proceso de pago con Stripe. Puedes leer el detalle en la{" "}
            <Link
              href="/politica-cookies"
              className="text-black underline underline-offset-2 hover:text-black/70"
            >
              Política de cookies
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
