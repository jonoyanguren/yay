-- CreateTable
CREATE TABLE "retreats" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "full_description" TEXT NOT NULL DEFAULT '',
    "activities" JSONB NOT NULL DEFAULT '[]',
    "program" JSONB NOT NULL DEFAULT '[]',
    "image" TEXT NOT NULL DEFAULT '',
    "date" TEXT NOT NULL DEFAULT '',
    "price" TEXT NOT NULL DEFAULT '',
    "arrival_intro" TEXT,
    "arrival_options" JSONB,
    "day_by_day" JSONB,
    "includes" JSONB,
    "not_includes" JSONB,
    "extra_ideas" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "retreats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retreat_room_types" (
    "id" TEXT NOT NULL,
    "retreat_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,
    "max_quantity" INTEGER NOT NULL,

    CONSTRAINT "retreat_room_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "retreat_extra_activities" (
    "id" TEXT NOT NULL,
    "retreat_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price_cents" INTEGER NOT NULL,

    CONSTRAINT "retreat_extra_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "retreat_id" TEXT NOT NULL,
    "stripe_session_id" TEXT,
    "customer_email" TEXT NOT NULL,
    "customer_name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_room_slots" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "retreat_room_type_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "booking_room_slots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_extras" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "retreat_extra_activity_id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "booking_extras_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "retreats_slug_key" ON "retreats"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_stripe_session_id_key" ON "bookings"("stripe_session_id");

-- AddForeignKey
ALTER TABLE "retreat_room_types" ADD CONSTRAINT "retreat_room_types_retreat_id_fkey" FOREIGN KEY ("retreat_id") REFERENCES "retreats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "retreat_extra_activities" ADD CONSTRAINT "retreat_extra_activities_retreat_id_fkey" FOREIGN KEY ("retreat_id") REFERENCES "retreats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_retreat_id_fkey" FOREIGN KEY ("retreat_id") REFERENCES "retreats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_room_slots" ADD CONSTRAINT "booking_room_slots_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_room_slots" ADD CONSTRAINT "booking_room_slots_retreat_room_type_id_fkey" FOREIGN KEY ("retreat_room_type_id") REFERENCES "retreat_room_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_extras" ADD CONSTRAINT "booking_extras_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_extras" ADD CONSTRAINT "booking_extras_retreat_extra_activity_id_fkey" FOREIGN KEY ("retreat_extra_activity_id") REFERENCES "retreat_extra_activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
