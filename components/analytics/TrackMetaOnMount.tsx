"use client";

import { useEffect } from "react";
import {
  trackAnalytics,
  type AnalyticsEventName,
  type AnalyticsParams,
} from "@/lib/analytics";

type Props = {
  eventName: AnalyticsEventName;
  params?: AnalyticsParams;
  eventId?: string;
};

export default function TrackMetaOnMount({ eventName, params, eventId }: Props) {
  useEffect(() => {
    trackAnalytics(eventName, params, eventId);
  }, [eventName, params, eventId]);

  return null;
}
