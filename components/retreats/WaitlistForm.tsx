import RetreatSoldOutEmailForm from "@/components/retreats/RetreatSoldOutEmailForm";

interface WaitlistFormProps {
  retreatSlug: string;
}

export default function WaitlistForm({
  retreatSlug,
}: WaitlistFormProps) {
  return (
    <section className="relative z-40 -mt-1">
      <div className="mx-auto max-w-6xl bg-white border border-black/10 p-5 md:p-8 rounded-xl">
        <div className="max-w-2xl mx-auto text-center">
          <p className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 mb-4">
            No quedan plazas
          </p>
          <p className="text-base md:text-lg text-black/75 leading-relaxed mb-4">
            Ahora mismo ya no quedan plazas, pero dejanos tu correo y vemos si
            podemos hacer algun apaño para que puedas venirte con nosotros.
          </p>
          <p className="text-sm text-black/60 mb-4">
            Si se libera un hueco o abrimos una opcion extra, seras de las
            primeras personas en enterarte.
          </p>
          <RetreatSoldOutEmailForm retreatSlug={retreatSlug} large />
        </div>
      </div>
    </section>
  );
}
