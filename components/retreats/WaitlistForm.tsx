import RetreatSoldOutEmailForm from "@/components/retreats/RetreatSoldOutEmailForm";
import SoldOutStamp from "@/components/ui/SoldOutStamp";

interface WaitlistFormProps {
  retreatSlug: string;
}

export default function WaitlistForm({ retreatSlug }: WaitlistFormProps) {
  return (
    <section className="relative z-40 -mt-1">
      <div className="relative mx-auto max-w-6xl rounded-xl border border-black/10 bg-white p-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] md:p-8">
        <div className="pointer-events-none absolute -top-4 right-2 md:-top-5 md:-right-3">
          <SoldOutStamp size="lg" className="bg-white" />
        </div>
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="mb-3 text-2xl font-bold tracking-tight text-black">
            Apuntate a la lista de espera
          </h3>
          <p className="mb-4 text-base leading-relaxed text-black/75 md:text-lg">
            Dejanos tu correo y vemos si podemos hacerte un hueco para que
            puedas venirte con nosotros.
          </p>
          <p className="mb-5 text-base text-black/75 md:text-lg">
            Si se libera una plaza o abrimos un retiro extra, seras de las
            primeras personas en enterarte.
          </p>
          <RetreatSoldOutEmailForm retreatSlug={retreatSlug} large />
        </div>
      </div>
    </section>
  );
}
