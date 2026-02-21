export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "AddPaymentInfo"
  | "Purchase";

export type MetaParams = Record<string, string | number | boolean | string[]>;

declare global {
  interface Window {
    fbq?: (
      command: "track" | "trackCustom",
      eventName: string,
      params?: MetaParams,
      options?: { eventID?: string },
    ) => void;
  }
}

function cleanParams(params?: MetaParams): MetaParams | undefined {
  if (!params) return undefined;
  const entries = Object.entries(params).filter(([, value]) => value != null);
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export function trackMeta(
  eventName: MetaEventName,
  params?: MetaParams,
  eventId?: string,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", eventName, cleanParams(params), { eventID: eventId });
}

export function trackMetaCustom(
  eventName: string,
  params?: MetaParams,
  eventId?: string,
) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("trackCustom", eventName, cleanParams(params), { eventID: eventId });
}
