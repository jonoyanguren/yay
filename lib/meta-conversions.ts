import { createHash } from "node:crypto";

const META_GRAPH_VERSION = "v22.0";
const DEFAULT_PIXEL_ID = "948434710971588";

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

type SendMetaPurchaseParams = {
  bookingId: string;
  retreatId: string;
  chargedAmountCents: number;
  customerEmail?: string | null;
};

export async function sendMetaPurchaseEvent({
  bookingId,
  retreatId,
  chargedAmountCents,
  customerEmail,
}: SendMetaPurchaseParams): Promise<void> {
  const accessToken = process.env.META_CONVERSIONS_ACCESS_TOKEN;
  if (!accessToken) return;

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? DEFAULT_PIXEL_ID;
  const testEventCode = process.env.META_CONVERSIONS_TEST_EVENT_CODE;

  const userData: Record<string, string[]> = {};
  if (customerEmail) {
    userData.em = [sha256(customerEmail.trim().toLowerCase())];
  }

  const body = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `purchase_${bookingId}`,
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: "EUR",
          value: chargedAmountCents / 100,
          content_ids: [retreatId],
          content_type: "product",
          order_id: bookingId,
        },
      },
    ],
    test_event_code: testEventCode,
  };

  const endpoint = `https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Meta CAPI purchase send failed:", response.status, errorText);
    }
  } catch (error) {
    console.error("Meta CAPI request error:", error);
  }
}
