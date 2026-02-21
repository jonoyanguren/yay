"use client";

export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "AddPaymentInfo"
  | "Purchase"
  | (string & {});
import { trackMetaEventAction } from "@/app/actions/meta-analytics";

export type MetaParams = Record<string, string | number | boolean | string[]>;
type MetaEndpointPayload = {
  eventName: string;
  params?: MetaParams;
  eventId?: string;
};

export function trackMeta(
  eventName: MetaEventName,
  params?: MetaParams,
  eventId?: string,
) {
  sendToMetaEndpoint({ eventName, params, eventId });
}

function sendToMetaEndpoint(payload: MetaEndpointPayload) {
  if (typeof window === "undefined") return;
  trackMetaEventAction({
    eventName: payload.eventName,
    params: payload.params,
    eventId: payload.eventId,
  }).catch((error: unknown) => {
    console.error("[Meta API] server action failed", error);
  });
}
