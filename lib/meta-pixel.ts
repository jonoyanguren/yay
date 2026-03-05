"use client";

import {
  trackAnalytics,
  type AnalyticsEventName,
  type AnalyticsParams,
} from "@/lib/analytics";

export type MetaEventName = AnalyticsEventName;
export type MetaParams = AnalyticsParams;

export function trackMeta(
  eventName: MetaEventName,
  params?: MetaParams,
  eventId?: string,
) {
  trackAnalytics(eventName, params, eventId);
}
