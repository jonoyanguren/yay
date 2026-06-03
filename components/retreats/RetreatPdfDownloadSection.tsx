interface RetreatPdfDownloadSectionProps {
  pdfLink: string;
}

export default function RetreatPdfDownloadSection({
  pdfLink,
}: RetreatPdfDownloadSectionProps) {
  const url = pdfLink.trim();
  if (!url) return null;

  return (
    <section
      className="rounded-2xl bg-brand-blue-dark text-center px-6 md:px-12 py-10 md:py-14 border border-black/10 shadow-[0_12px_40px_rgba(48,30,14,0.18)]"
      aria-labelledby="retreat-pdf-download-heading"
    >
      <p className="text-brand-yellow text-xs md:text-sm font-semibold uppercase tracking-[0.14em]">
        Tu dossier está listo
      </p>
      <h2
        id="retreat-pdf-download-heading"
        className="mt-3 text-2xl md:text-4xl font-bold text-white leading-tight font-title"
      >
        Descárgate toda la información
      </h2>
      <p className="mt-4 mx-auto max-w-xl text-base md:text-lg text-white/90 leading-relaxed">
        Itinerario completo, alojamiento, qué llevar y consejos prácticos en un
        solo documento. Guárdalo en el móvil para tenerlo a mano durante el
        viaje.
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-yellow px-8 py-4 text-base md:text-lg font-bold text-brand-blue-dark shadow-md transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow"
      >
        Descargar dossier del retiro
        <span className="ml-2" aria-hidden>
          →
        </span>
      </a>
    </section>
  );
}
