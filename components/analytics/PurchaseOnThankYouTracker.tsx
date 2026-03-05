"use client";

import { useEffect } from "react";
import { trackAnalytics } from "@/lib/analytics";

type PurchaseLookupResponse = {
  id: string;
  status: string;
  stripeAmountTotalCents: number | null;
  stripePaymentStatus: "paid" | "unpaid" | "no_payment_required" | null;
  retreatId: string;
};

type Props = {
  sessionId: string;
};

export default function PurchaseOnThankYouTracker({ sessionId }: Props) {
  useEffect(() => {
    let cancelled = false;

    async function trackPurchase() {
      const response = await fetch(
        `/api/bookings/stripe-session/${sessionId}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );
      if (!response.ok) return;

      const booking = (await response.json()) as PurchaseLookupResponse;
      if (cancelled) return;
      if (!booking?.id) return;

      const transactionId = booking.id;
      const dedupeKey = `ga4_purchase_tracked_${transactionId}`;
      if (window.sessionStorage.getItem(dedupeKey)) return;

      const isPaidByWebhook =
        booking.status === "paid" || booking.status === "deposit";
      const isPaidByStripe = booking.stripePaymentStatus === "paid";

      if (isPaidByWebhook || isPaidByStripe) {
        trackAnalytics(
          "Purchase",
          {
            transaction_id: transactionId,
            currency: "EUR",
            value: (booking.stripeAmountTotalCents ?? 0) / 100,
            booking_status: booking.status,
            retreat_id: booking.retreatId,
          },
          `purchase_${transactionId}`,
          { meta: false },
        );

        window.sessionStorage.setItem(dedupeKey, "1");
      }
    }

    trackPurchase().catch((error: unknown) => {
      console.error("Purchase tracking failed:", error);
    });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return null;
}
