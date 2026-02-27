import Title from "@/components/ui/Title";

interface ItineraryDay {
  day: string;
  items: string[];
}

interface ItinerarySectionProps {
  title: string;
  days: ItineraryDay[];
}

const markerVariants = [
  {
    rotate: -1.6,
    height: "0.44em",
    bottom: "-0.10em",
    scaleX: 1.06,
    translateX: "-0.01em",
  },
  {
    rotate: 1.2,
    height: "0.40em",
    bottom: "-0.08em",
    scaleX: 1.08,
    translateX: "0.01em",
  },
  {
    rotate: -0.8,
    height: "0.46em",
    bottom: "-0.11em",
    scaleX: 1.05,
    translateX: "0em",
  },
  {
    rotate: 1.8,
    height: "0.42em",
    bottom: "-0.09em",
    scaleX: 1.07,
    translateX: "-0.01em",
  },
  {
    rotate: -1.3,
    height: "0.45em",
    bottom: "-0.12em",
    scaleX: 1.09,
    translateX: "0.01em",
  },
  {
    rotate: 0.9,
    height: "0.41em",
    bottom: "-0.08em",
    scaleX: 1.06,
    translateX: "0em",
  },
] as const;

function splitStartTime(item: string) {
  const trimmed = item.trim();
  const match = trimmed.match(
    /^(\d{1,2}[:.]\d{2})(?:\s*[-–]\s*\d{1,2}[:.]\d{2})?\s*(.*)$/,
  );

  if (!match) {
    return { startTime: "", activity: trimmed };
  }

  return {
    startTime: match[1].replace(".", ":"),
    activity: match[2].trim(),
  };
}

function splitDayLabel(dayLabel: string) {
  const normalized = dayLabel.trim();
  const match = normalized.match(/^(.*?)(\d+)$/);

  if (!match) {
    return { name: normalized, number: "" };
  }

  return {
    name: match[1].trim(),
    number: match[2],
  };
}

export default function ItinerarySection({
  title,
  days,
}: ItinerarySectionProps) {
  if (days.length === 0) return null;

  return (
    <section className="space-y-6">
      <Title className="text-2xl text-brand-blue-medium">{title}</Title>

      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-flow-col md:auto-cols-fr">
        {days.map((day, index) => {
          const { name, number } = splitDayLabel(day.day);
          const marker = markerVariants[index % markerVariants.length];

          return (
            <div key={day.day}>
              <div className="mb-3">
                <p className="text-brand-blue-dark font-semibold leading-none text-xl md:text-2xl">
                  <span className="relative inline-block">
                    <span className="relative z-10">
                      {name}
                      {number ? ` ${number}` : ""}
                    </span>
                    <span
                      className="absolute bg-brand-accent-yellow/80 z-0 rounded-[2px]"
                      style={{
                        left: 0,
                        width: "100%",
                        bottom: marker.bottom,
                        height: marker.height,
                        transform: `translateX(${marker.translateX}) scaleX(${marker.scaleX}) rotate(${marker.rotate}deg)`,
                        transformOrigin: "center",
                      }}
                    />
                  </span>
                </p>
              </div>

              <ul className="space-y-2">
                {day.items.map((item) => {
                  const { startTime, activity } = splitStartTime(item);

                  return (
                    <li
                      key={item}
                      className="text-sm leading-snug text-brand-blue-dark whitespace-pre-line"
                    >
                      {startTime && (
                        <span className="font-handwriting mr-1 text-xl md:text-2xl font-bold leading-none text-brand-main-dark">
                          {startTime}:
                        </span>
                      )}
                      {activity && (
                        <span>{startTime ? ` ${activity}` : activity}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
