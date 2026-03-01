import React from "react";

interface TitleProps {
  className?: string;
  children: React.ReactNode;
}

export default function Title({ className = "", children }: TitleProps) {
  return (
    <h2
      className={`font-title tracking-tight text-brand-blue-medium ${className}`.trim()}
      style={{ fontFamily: "var(--font-title-family), serif" }}
      data-title-font="true"
    >
      {children}
    </h2>
  );
}
