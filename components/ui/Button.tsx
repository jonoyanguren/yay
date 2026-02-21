import React from "react";
import Link from "next/link";

type CommonProps = {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

type LinkButtonProps = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href: string;
  };

type NativeButtonProps = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  target,
  rel,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-black text-white hover:bg-gray-dark hover:text-white",
    outline: "border border-black text-black hover:bg-black hover:text-white",
    ghost: "text-black hover:bg-sand/50",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-8 text-sm",
    lg: "h-14 px-10 text-base",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link
        href={href}
        className={combinedClassName}
        target={target}
        rel={rel}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
