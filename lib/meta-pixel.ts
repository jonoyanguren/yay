export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "AddPaymentInfo"
  | "Purchase";

export type MetaParams = Record<string, string | number | boolean | string[]>;
const MAX_FBQ_RETRIES = 12;
const FBQ_RETRY_DELAY_MS = 200;

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
  sendMetaEventWithRetry("track", eventName, params, eventId, 0);
}

export function trackMetaCustom(
  eventName: string,
  params?: MetaParams,
  eventId?: string,
) {
  sendMetaEventWithRetry("trackCustom", eventName, params, eventId, 0);
}

function sendMetaEventWithRetry(
  command: "track" | "trackCustom",
  eventName: string,
  params?: MetaParams,
  eventId?: string,
  attempt: number = 0,
) {
  if (typeof window === "undefined") return;

  if (typeof window.fbq !== "function") {
    if (attempt === 0) {
      console.warn("[Meta Pixel] fbq not ready, scheduling retry", {
        command,
        eventName,
        params,
        eventId,
      });
    }
    if (attempt < MAX_FBQ_RETRIES) {
      window.setTimeout(
        () =>
          sendMetaEventWithRetry(command, eventName, params, eventId, attempt + 1),
        FBQ_RETRY_DELAY_MS,
      );
    }
    return;
  }

  console.info(`[Meta Pixel] ${command}`, { eventName, params, eventId, attempt });
  window.fbq(command, eventName, cleanParams(params), { eventID: eventId });
}
