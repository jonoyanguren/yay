import { ReactNode } from "react";
import FadeInOnView from "@/components/retreats/FadeInOnView";

type RetreatSectionType = "full" | "narrow";

interface RetreatSectionProps {
  type?: RetreatSectionType;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
}

const widthByType: Record<RetreatSectionType, string> = {
  full: "max-w-6xl",
  narrow: "max-w-6xl",
};

const guttersByType: Record<RetreatSectionType, string> = {
  full: "px-6 md:px-12",
  narrow: "px-6 md:px-12",
};

const verticalPaddingByType: Record<RetreatSectionType, string> = {
  full: "py-6 md:py-12",
  narrow: "py-6 md:py-12",
};

export default function RetreatSection({
  type = "narrow",
  className = "",
  contentClassName = "",
  children,
}: RetreatSectionProps) {
  return (
    <FadeInOnView>
      <section className={className}>
        <div
          className={`mx-auto ${guttersByType[type]} ${widthByType[type]} ${verticalPaddingByType[type]} ${contentClassName}`.trim()}
        >
          {children}
        </div>
      </section>
    </FadeInOnView>
  );
}
