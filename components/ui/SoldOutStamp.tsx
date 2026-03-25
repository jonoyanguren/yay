interface SoldOutStampProps {
  size?: "md" | "lg";
  className?: string;
}

export default function SoldOutStamp({
  size = "md",
  className = "",
}: SoldOutStampProps) {
  const sizeClass =
    size === "lg"
      ? "px-6 py-2.5 text-xl tracking-[0.2em]"
      : "px-5 py-2 text-lg tracking-[0.18em]";

  return (
    <span
      className={`inline-flex rotate-14 border-2 border-rose-700 bg-white font-extrabold text-rose-700 ${sizeClass} ${className}`}
    >
      SOLD OUT
    </span>
  );
}
