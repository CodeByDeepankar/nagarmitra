import { type JSX, type ReactNode } from "react";

export function Card({
  className = "",
  title,
  children,
  onClick,
}: {
  className?: string;
  title?: string;
  children: ReactNode;
  onClick?: () => void;
}): JSX.Element {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow ${className}`}
      onClick={onClick}
    >
      {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
      {children}
    </div>
  );
}

