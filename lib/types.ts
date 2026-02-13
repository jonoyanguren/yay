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
  activities: string[];
  program: string[];
  image: string;
  images: string[];
  date: string;
  price: string;
  maxPeople: number;
  arrivalIntro?: string | null;
  arrivalOptions?: { title: string; detail: string }[] | null;
  dayByDay?: { day: string; items: string[] }[] | null;
  includes?: string[] | null;
  notIncludes?: string[] | null;
  extraIdeas?: string[] | null;
  published: boolean;
  roomTypes: RetreatRoomTypeRow[];
  extraActivities: RetreatExtraActivityRow[];
  bookings: Booking[];
};

/** Shape used in lib/data.ts for seed; seed script does not use these fields. */
export type RetreatSeedData = Omit<
  Retreat,
  "images" | "published" | "roomTypes" | "extraActivities" | "bookings" | "maxPeople"
>;

export type RetreatRoomTypeRow = {
  id: string;
  retreat_id: string;
  name: string;
  description?: string;
  images: string[];
  price_cents: number;
  max_quantity: number;
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
  status: "pending" | "paid" | "cancelled";
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
