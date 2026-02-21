"use server";

import { headers } from "next/headers";
import { sendMetaFrontendEvent } from "@/lib/meta-conversions";

type MetaParams = Record<string, string | number | boolean | string[]>;

type MetaActionPayload = {
  eventName: string;
  params?: MetaParams;
  eventId?: string;
};

export async function trackMetaEventAction({
  eventName,
  params,
  eventId,
}: MetaActionPayload): Promise<void> {
  const requestHeaders = await headers();
  const clientIpAddress =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? undefined;
  const clientUserAgent = requestHeaders.get("user-agent") ?? undefined;

  await sendMetaFrontendEvent({
    eventName,
    eventId,
    customData: params,
    clientIpAddress,
    clientUserAgent,
  });
}
