"use client";

import { FormEvent, useState } from "react";

interface RetreatSoldOutEmailFormProps {
  retreatSlug: string;
  large?: boolean;
}

export default function RetreatSoldOutEmailForm({
  retreatSlug,
  large = false,
}: RetreatSoldOutEmailFormProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Introduce un email válido.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/retreats/${retreatSlug}/waitlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "No se pudo guardar tu email.");
        return;
      }

      setMessage(
        "Perfecto. Te avisaremos si se libera una plaza y, si se apunta suficiente gente, podremos abrir otro retiro.",
      );
      setEmail("");
    } catch {
      setError("Error de conexión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:w-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          className={
            large
              ? "w-full sm:w-[28rem] rounded-full border border-gray/20 bg-white px-6 py-4 text-base"
              : "w-full sm:w-64 rounded-full border border-gray/20 bg-white px-4 py-2.5 text-sm"
          }
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={
            large
              ? "rounded-full bg-black text-white px-7 py-4 text-base font-medium hover:bg-gray-dark disabled:opacity-60 disabled:cursor-not-allowed"
              : "rounded-full bg-black text-white px-5 py-2.5 text-sm font-medium hover:bg-gray-dark disabled:opacity-60 disabled:cursor-not-allowed"
          }
        >
          {loading ? "Enviando..." : "Avisadme"}
        </button>
      </div>
      {message && (
        <p className="text-sm md:text-base font-medium text-green mt-3">{message}</p>
      )}
      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
    </form>
  );
}
