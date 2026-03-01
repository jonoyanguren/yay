import Title from "@/components/ui/Title";

export interface ArrivalOption {
  title: string;
  detail: string;
}

interface ArrivalOptionsSectionProps {
  intro: string;
  options: ArrivalOption[];
}

export default function ArrivalOptionsSection({
  intro,
  options,
}: ArrivalOptionsSectionProps) {
  if (options.length === 0) return null;

  return (
    <section className="space-y-4">
      <Title className="text-5xl text-white">Llegadas y transfers</Title>
      <p className="text-2xl text-white leading-relaxed mb-12">{intro}</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((item, index) => (
          <div
            key={item.title}
            className={`p-4 border-2 rounded-lg shadow-sm ${
              index === 0 ? "" : "border-white/15 bg-white"
            }`}
            style={
              index === 0
                ? {
                    borderColor: "#4f73c3",
                    backgroundColor: "#faf8f4",
                  }
                : undefined
            }
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p className="text-sm font-semibold">{item.title}</p>
              {index === 0 && (
                <span className="text-[10px] px-2 py-1 rounded-full bg-brand-blue-medium text-white uppercase tracking-wide">
                  Recomendada
                </span>
              )}
            </div>
            <p className="text-sm text-left leading-relaxed text-black/80">
              {item.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
