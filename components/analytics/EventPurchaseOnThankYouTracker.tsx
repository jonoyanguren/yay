"use client";

import { useEffect } from "react";
import { trackAnalytics } from "@/lib/analytics";

type PurchaseLookupResponse = {
  id: string;
  status: string;
  stripeAmountTotalCents: number | null;
  stripePaymentStatus: "paid" | "unpaid" | "no_payment_required" | null;
  eventId: string;
};

type Props = {
  sessionId: string;
};

export default function EventPurchaseOnThankYouTracker({ sessionId }: Props) {
  useEffect(() => {
    let cancelled = false;

    async function trackPurchase() {
      const response = await fetch(
        `/api/event-registrations/stripe-session/${sessionId}`,
        { method: "GET", cache: "no-store" },
      );
      if (!response.ok) return;

      const registration = (await response.json()) as PurchaseLookupResponse;
      if (cancelled || !registration?.id) return;

      const transactionId = registration.id;
      const dedupeKey = `ga4_event_purchase_tracked_${transactionId}`;
      if (window.sessionStorage.getItem(dedupeKey)) return;

      const isPaidByWebhook = registration.status === "paid";
      const isPaidByStripe = registration.stripePaymentStatus === "paid";

      if (isPaidByWebhook || isPaidByStripe) {
        trackAnalytics(
          "Purchase",
          {
            transaction_id: transactionId,
            currency: "EUR",
            value: (registration.stripeAmountTotalCents ?? 0) / 100,
            booking_status: registration.status,
            event_id: registration.eventId,
          },
          `event_purchase_${transactionId}`,
          { meta: false },
        );
        window.sessionStorage.setItem(dedupeKey, "1");
      }
    }

    trackPurchase().catch((error: unknown) => {
      console.error("Event purchase tracking failed:", error);
    });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return null;
}
