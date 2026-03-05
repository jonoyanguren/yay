"use client";

import { trackMetaEventAction } from "@/app/actions/meta-analytics";

export type AnalyticsEventName = string;
export type AnalyticsParams = Record<
  string,
  string | number | boolean | string[] | null | undefined
>;

type AnalyticsPayload = {
  eventName: AnalyticsEventName;
  params?: AnalyticsParams;
  eventId?: string;
};

type MetaSafeParams = Record<string, string | number | boolean | string[]>;

type AnalyticsDestinations = {
  meta?: boolean;
  dataLayer?: boolean;
  ga4?: boolean;
};

type GtagFunction = (
  command: "event",
  eventName: string,
  params?: AnalyticsParams,
) => void;

const META_TO_GA4_EVENT_MAP: Record<string, string> = {
  PageView: "page_view",
  ViewContent: "view_item",
  ViewBookingForm: "view_booking_form",
  AddPaymentInfo: "add_payment_info",
  Purchase: "purchase",
};

function toGa4EventName(eventName: string): string {
  return META_TO_GA4_EVENT_MAP[eventName] ?? eventName;
}

function sanitizeEventName(eventName: string): string {
  return eventName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function sendToMeta(payload: AnalyticsPayload) {
  const params: MetaSafeParams | undefined = payload.params
    ? Object.entries(payload.params).reduce<MetaSafeParams>(
        (acc, [key, value]) => {
          if (value !== null && value !== undefined) acc[key] = value;
          return acc;
        },
        {},
      )
    : undefined;

  trackMetaEventAction({
    eventName: payload.eventName,
    params,
    eventId: payload.eventId,
  }).catch((error: unknown) => {
    console.error("[Meta API] analytics action failed", error);
  });
}

function sendToDataLayer(payload: AnalyticsPayload) {
  const dataLayerPayload: Record<string, unknown> = {
    event: sanitizeEventName(payload.eventName),
    event_name: payload.eventName,
  };

  if (payload.eventId) dataLayerPayload.event_id = payload.eventId;
  if (payload.params) Object.assign(dataLayerPayload, payload.params);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(dataLayerPayload);
}

function sendToGa4(payload: AnalyticsPayload) {
  const eventName = toGa4EventName(payload.eventName);
  const params: AnalyticsParams = {
    ...(payload.params ?? {}),
  };
  if (payload.eventId) params.event_id = payload.eventId;

  if (!window.gtag) {
    // Queue the GA4 event while gtag initializes.
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", eventName, params]);
    return;
  }

  window.gtag("event", eventName, params);
}

export function trackAnalytics(
  eventName: AnalyticsEventName,
  params?: AnalyticsParams,
  eventId?: string,
  destinations?: AnalyticsDestinations,
) {
  if (typeof window === "undefined") return;

  const {
    meta = true,
    dataLayer = true,
    ga4 = true,
  } = destinations ?? {};

  const payload: AnalyticsPayload = {
    eventName,
    params,
    eventId,
  };

  if (meta) sendToMeta(payload);
  if (dataLayer) sendToDataLayer(payload);
  if (ga4) sendToGa4(payload);
}

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown> | unknown[]>;
    gtag?: GtagFunction;
  }
}
