import React from "react";

interface TitleProps {
  className?: string;
  children: React.ReactNode;
}

export default function Title({ className = "", children }: TitleProps) {
  return (
    <h2
      className={`font-title tracking-tight text-brand-blue-medium ${className}`.trim()}
    >
      {children}
    </h2>
  );
}
