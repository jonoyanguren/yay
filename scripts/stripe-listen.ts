/**
 * Forward Stripe webhooks to the local Next.js app using STRIPE_SECRET_KEY from .env.
 * The Stripe CLI does not read project .env by default — it uses `stripe login` credentials.
 *
 * When listen starts, copy the printed whsec_... value into STRIPE_WEBHOOK_SECRET.
 */
import { spawn } from "child_process";
import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

const root = resolve(__dirname, "..");

function loadEnvFile(filename: string) {
  const path = resolve(root, filename);
  if (!existsSync(path)) return;

  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;

    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
}

// Same order as Next.js: .env then .env.local overrides
loadEnvFile(".env");
loadEnvFile(".env.local");

const apiKey = process.env.STRIPE_SECRET_KEY?.trim();
if (!apiKey) {
  console.error(
    "Falta STRIPE_SECRET_KEY en .env o .env.local (misma clave que usa `npm run dev`).",
  );
  process.exit(1);
}

if (!apiKey.startsWith("sk_test_") && !apiKey.startsWith("sk_live_")) {
  console.error("STRIPE_SECRET_KEY no parece una clave secreta de Stripe (sk_test_ / sk_live_).");
  process.exit(1);
}

console.info("Stripe listen → http://localhost:3000/api/webhooks/stripe");
console.info("Usando STRIPE_SECRET_KEY del proyecto (.env / .env.local).");
console.info(
  "Cuando aparezca whsec_..., cópialo en STRIPE_WEBHOOK_SECRET y reinicia `npm run dev` si hace falta.\n",
);

const child = spawn(
  "stripe",
  [
    "listen",
    "--api-key",
    apiKey,
    "--forward-to",
    "http://localhost:3000/api/webhooks/stripe",
  ],
  { stdio: "inherit" },
);

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
