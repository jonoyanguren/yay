import { Booking } from "@prisma/client";

/** Re-export revalidateTag for convenience */
export { revalidateTag } from "next/cache";

// ─── Types ─────────────────────────────────────────────────────────────────

export type Retreat = {
  id: string;
  slug: string;
  title: string;
  location: string;
  description: string;
  fullDescription: string;
  activities?: string[];
  activitiesImage?: string | null;
  program?: string[];
  image: string;
  images: string[];
  date: string;
  price: string;
  reservationDepositCents: number;
  chargeFullAmount: boolean;
  forceSoldOut?: boolean;
  arrivalIntro?: string | null;
  arrivalOptions?: { title: string; detail: string }[] | null;
  hotelName?: string | null;
  hotelUrl?: string | null;
  videoUrl?: string | null;
  accommodationTitle?: string | null;
  accommodationDescription?: string | null;
  accommodationImages?: string[];
  dayByDay?: { day: string; items: string[] }[] | null;
  includes?: string[] | null;
  notIncludes?: string[] | null;
  bgColor?: string | null;
  textHighlights?: {
    fullDescription?: string[];
    arrivalIntro?: string[];
    accommodationDescription?: string[];
  } | null;
  published: boolean;
  roomTypes: RetreatRoomTypeRow[];
  extraActivities: RetreatExtraActivityRow[];
  bookings: Booking[];
};

/** Shape used in lib/data.ts for seed; seed script does not use these fields. */
export type RetreatSeedData = Omit<
  Retreat,
  | "published"
  | "roomTypes"
  | "extraActivities"
  | "bookings"
  | "reservationDepositCents"
  | "chargeFullAmount"
>;

export type RetreatRoomTypeRow = {
  id: string;
  retreat_id: string;
  name: string;
  description?: string;
  images: string[];
  price_cents: number;
  max_people: number;
};

export type RetreatExtraActivityRow = {
  id: string;
  retreat_id: string;
  name: string;
  description?: string | null;
  images: string[];
  price_cents: number;
  allow_multiple: boolean;
  max_quantity: number | null;
  link?: string | null;
};

export type RetreatRoomTypeWithAvailability = RetreatRoomTypeRow & {
  available: number;
};

export type BookingInsert = {
  retreatId: string;
  stripeSessionId: string | null;
  customerEmail: string;
  customerName: string | null;
  customerPhone?: string | null;
  status: "pending" | "deposit" | "paid" | "cancelled";
};

export type BookingRoomSlotInsert = {
  bookingId: string;
  retreatRoomTypeId: string;
  quantity: number;
};

export type BookingExtraInsert = {
  bookingId: string;
  retreatExtraActivityId: string;
  quantity: number;
};
