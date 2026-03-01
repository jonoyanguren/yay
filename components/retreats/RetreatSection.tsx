import { CSSProperties, ReactNode } from "react";
import FadeInOnView from "@/components/retreats/FadeInOnView";

type RetreatSectionType = "full" | "narrow";

interface RetreatSectionProps {
  type?: RetreatSectionType;
  className?: string;
  contentClassName?: string;
  animate?: boolean;
  style?: CSSProperties;
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
  animate = true,
  style,
  children,
}: RetreatSectionProps) {
  const content = (
    <section className={className} style={style}>
      <div
        className={`mx-auto ${guttersByType[type]} ${widthByType[type]} ${verticalPaddingByType[type]} ${contentClassName}`.trim()}
      >
        {children}
      </div>
    </section>
  );

  if (!animate) {
    return content;
  }

  return (
    <FadeInOnView>
      {content}
    </FadeInOnView>
  );
}
