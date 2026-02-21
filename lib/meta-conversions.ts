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

type SendMetaLeadParams = {
  bookingId: string;
  retreatId: string;
  reservationAmountCents: number;
  customerEmail?: string | null;
  customerName?: string | null;
  clientIpAddress?: string;
  clientUserAgent?: string;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function splitName(name?: string | null): { firstName?: string; lastName?: string } {
  if (!name) return {};
  const tokens = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (tokens.length === 0) return {};
  if (tokens.length === 1) return { firstName: tokens[0] };
  return {
    firstName: tokens[0],
    lastName: tokens.slice(1).join(" "),
  };
}

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

export async function sendMetaLeadEvent({
  bookingId,
  retreatId,
  reservationAmountCents,
  customerEmail,
  customerName,
  clientIpAddress,
  clientUserAgent,
}: SendMetaLeadParams): Promise<void> {
  const accessToken = process.env.META_CONVERSIONS_ACCESS_TOKEN;
  if (!accessToken) return;

  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? DEFAULT_PIXEL_ID;
  const testEventCode = process.env.META_CONVERSIONS_TEST_EVENT_CODE;
  const { firstName, lastName } = splitName(customerName);

  const userData: Record<string, string[] | string> = {};
  if (customerEmail) userData.em = [sha256(normalize(customerEmail))];
  if (firstName) userData.fn = [sha256(normalize(firstName))];
  if (lastName) userData.ln = [sha256(normalize(lastName))];
  if (clientIpAddress) userData.client_ip_address = clientIpAddress;
  if (clientUserAgent) userData.client_user_agent = clientUserAgent;

  const body = {
    data: [
      {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `lead_${bookingId}`,
        action_source: "website",
        user_data: userData,
        custom_data: {
          currency: "EUR",
          value: reservationAmountCents / 100,
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
      console.error("Meta CAPI lead send failed:", response.status, errorText);
    }
  } catch (error) {
    console.error("Meta CAPI request error:", error);
  }
}
