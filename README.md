This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Reservas y pagos (Stripe + Prisma + Postgres)

- **Base de datos**: El proyecto usa **Prisma** con Postgres. En Vercel crea un almacén (Prisma Postgres, Neon o Supabase) y enlázalo al proyecto para que inyecte `DATABASE_URL`. Luego:
  - `npx prisma migrate dev --name init` (crea las tablas) o, si la BD ya existe, `npx prisma generate`.
  - `npm run seed` para cargar retiros y opciones de reserva.
- **Stripe**: Crea cuenta en [Stripe](https://stripe.com), obtén la Secret Key y el Publishable Key. Para el webhook en local usa Stripe CLI (`stripe listen --forward-to localhost:3000/api/webhooks/stripe`); en producción configura la URL en el dashboard y usa el signing secret que te den.

### Variables de entorno

| Variable | Uso |
|----------|-----|
| `DATABASE_URL` | Connection string de Postgres (Prisma). Inyectada por Vercel al enlazar el almacén. |
| `STRIPE_SECRET_KEY` | Clave secreta de la API de Stripe. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret del webhook (diferente en local con CLI y en producción). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | (Opcional) Si más adelante usas Stripe.js en cliente. |
| `NEXT_PUBLIC_BASE_URL` o `VERCEL_URL` | URL base para success/cancel de Checkout (Vercel inyecta `VERCEL_URL`). |

Copia `.env.example` a `.env.local` y rellena los valores.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
