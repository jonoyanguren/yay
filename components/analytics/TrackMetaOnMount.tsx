"use client";

import { useEffect } from "react";
import { trackMeta, type MetaEventName, type MetaParams } from "@/lib/meta-pixel";

type Props = {
  eventName: MetaEventName;
  params?: MetaParams;
  eventId?: string;
};

export default function TrackMetaOnMount({ eventName, params, eventId }: Props) {
  useEffect(() => {
    trackMeta(eventName, params, eventId);
  }, [eventName, params, eventId]);

  return null;
}
