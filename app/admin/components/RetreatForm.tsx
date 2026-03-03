"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ImageGallery from "./ImageGallery";
import { Retreat } from "@/lib/types";

interface RetreatFormProps {
  retreat?: Retreat;
  isEdit?: boolean;
}

interface ArrivalOption {
  title: string;
  detail: string;
}

interface DayByDay {
  day: string;
  items: string[];
}

interface RoomType {
  id?: string;
  name: string;
  description?: string;
  images?: string[];
  priceCents: number;
  maxQuantity: number;
  priceEuros?: number; // For display only
}

interface ExtraActivity {
  id?: string;
  name: string;
  description?: string;
  images?: string[];
  priceCents: number;
  allowMultiple: boolean;
  maxQuantity: number | null;
  link?: string;
  priceEuros?: number; // For display only
}

export default function RetreatForm({
  retreat,
  isEdit = false,
}: RetreatFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    slug: retreat?.slug || "",
    title: retreat?.title || "",
    location: retreat?.location || "",
    description: retreat?.description || "",
    fullDescription: retreat?.fullDescription || "",
    date: retreat?.date || "",
    price: retreat?.price || "",
    reservationDepositCents: retreat?.reservationDepositCents ?? 60000,
    chargeFullAmount: retreat?.chargeFullAmount || false,
    maxPeople: retreat?.maxPeople ?? 12,
    published: retreat?.published || false,
    arrivalIntro: retreat?.arrivalIntro || "",
    hotelName: retreat?.hotelName || "",
    hotelUrl: retreat?.hotelUrl || "",
    videoUrl: retreat?.videoUrl || "",
    accommodationTitle: retreat?.accommodationTitle || "",
    accommodationDescription: retreat?.accommodationDescription || "",
    bgColor: retreat?.bgColor || "#d77a61",
  });
  const [fullDescriptionHighlights, setFullDescriptionHighlights] = useState<
    string[]
  >(
    Array.isArray(retreat?.textHighlights?.fullDescription)
      ? retreat.textHighlights.fullDescription
      : [],
  );
  const [newFullDescriptionHighlight, setNewFullDescriptionHighlight] =
    useState("");

  // Image states
  const [retreatImages, setRetreatImages] = useState<string[]>(
    retreat?.images || [],
  );
  const [activitiesImage, setActivitiesImage] = useState<string>(
    retreat?.activitiesImage || "",
  );
  const [accommodationImages, setAccommodationImages] = useState<string[]>(
    retreat?.accommodationImages || [],
  );

  // Array states for structured data
  const [arrivalOptions, setArrivalOptions] = useState<ArrivalOption[]>(
    retreat?.arrivalOptions || [],
  );
  const [dayByDay, setDayByDay] = useState<DayByDay[]>(retreat?.dayByDay || []);
  const [includes, setIncludes] = useState<string[]>(retreat?.includes || []);
  const [notIncludes, setNotIncludes] = useState<string[]>(
    retreat?.notIncludes || [],
  );
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(
    retreat?.roomTypes?.map((rt: any) => ({
      ...rt,
      images: rt.images || [],
      priceEuros: rt.priceCents / 100,
    })) || [],
  );
  const [extraActivities, setExtraActivities] = useState<ExtraActivity[]>(
    retreat?.extraActivities?.map((ea: any) => ({
      ...ea,
      images: ea.images || [],
      priceEuros: ea.priceCents / 100,
    })) || [],
  );

  // Temporary input states
  const [newArrivalOption, setNewArrivalOption] = useState({
    title: "",
    detail: "",
  });
  const [newDayByDay, setNewDayByDay] = useState({ day: "", items: "" });
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [editingDayByDay, setEditingDayByDay] = useState({ day: "", items: "" });
  const [draggedDayIndex, setDraggedDayIndex] = useState<number | null>(null);
  const [newInclude, setNewInclude] = useState("");
  const [newNotInclude, setNewNotInclude] = useState("");
  const [editingIncludeIndex, setEditingIncludeIndex] = useState<number | null>(
    null,
  );
  const [editingIncludeValue, setEditingIncludeValue] = useState("");
  const [draggedIncludeIndex, setDraggedIncludeIndex] = useState<number | null>(
    null,
  );
  const [editingNotIncludeIndex, setEditingNotIncludeIndex] = useState<
    number | null
  >(null);
  const [editingNotIncludeValue, setEditingNotIncludeValue] = useState("");
  const [draggedNotIncludeIndex, setDraggedNotIncludeIndex] = useState<
    number | null
  >(null);
  const [newRoomType, setNewRoomType] = useState({
    name: "",
    description: "",
    images: [] as string[],
    priceCents: "",
    maxQuantity: "",
  });
  const [editingRoomTypeIndex, setEditingRoomTypeIndex] = useState<number | null>(
    null,
  );
  const [editingRoomType, setEditingRoomType] = useState({
    name: "",
    description: "",
    images: [] as string[],
    priceCents: "",
    maxQuantity: "",
  });
  const [newExtraActivity, setNewExtraActivity] = useState({
    name: "",
    description: "",
    images: [] as string[],
    priceCents: "",
    allowMultiple: true,
    maxQuantity: "",
    link: "",
  });
  const [editingExtraActivityIndex, setEditingExtraActivityIndex] = useState<
    number | null
  >(null);
  const [editingExtraActivity, setEditingExtraActivity] = useState({
    name: "",
    description: "",
    images: [] as string[],
    priceCents: "",
    allowMultiple: true,
    maxQuantity: "",
    link: "",
  });

  // Add/Remove functions
  const addArrivalOption = () => {
    if (newArrivalOption.title.trim() && newArrivalOption.detail.trim()) {
      setArrivalOptions([...arrivalOptions, newArrivalOption]);
      setNewArrivalOption({ title: "", detail: "" });
    }
  };

  const removeArrivalOption = (index: number) => {
    setArrivalOptions(arrivalOptions.filter((_, i) => i !== index));
  };

  const addDayByDay = () => {
    if (newDayByDay.day.trim() && newDayByDay.items.trim()) {
      const items = newDayByDay.items.split("\n").filter((item) => item.trim());
      setDayByDay([...dayByDay, { day: newDayByDay.day.trim(), items }]);
      setNewDayByDay({ day: "", items: "" });
    }
  };

  const removeDayByDay = (index: number) => {
    if (editingDayIndex === index) {
      setEditingDayIndex(null);
      setEditingDayByDay({ day: "", items: "" });
    }
    setDayByDay(dayByDay.filter((_, i) => i !== index));
  };

  const startEditDayByDay = (index: number) => {
    const day = dayByDay[index];
    if (!day) return;
    setEditingDayIndex(index);
    setEditingDayByDay({
      day: day.day,
      items: day.items.join("\n"),
    });
  };

  const cancelEditDayByDay = () => {
    setEditingDayIndex(null);
    setEditingDayByDay({ day: "", items: "" });
  };

  const saveEditDayByDay = () => {
    if (editingDayIndex === null) return;
    if (!editingDayByDay.day.trim() || !editingDayByDay.items.trim()) return;

    const items = editingDayByDay.items
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    setDayByDay(
      dayByDay.map((day, index) =>
        index === editingDayIndex
          ? { day: editingDayByDay.day.trim(), items }
          : day,
      ),
    );
    cancelEditDayByDay();
  };

  const onDayByDayDrop = (targetIndex: number) => {
    if (
      draggedDayIndex === null ||
      draggedDayIndex === targetIndex ||
      editingDayIndex !== null
    ) {
      setDraggedDayIndex(null);
      return;
    }

    setDayByDay((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedDayIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDraggedDayIndex(null);
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude("");
    }
  };

  const removeInclude = (index: number) => {
    if (editingIncludeIndex === index) {
      setEditingIncludeIndex(null);
      setEditingIncludeValue("");
    }
    setIncludes(includes.filter((_, i) => i !== index));
  };

  const startEditInclude = (index: number) => {
    setEditingIncludeIndex(index);
    setEditingIncludeValue(includes[index] || "");
  };

  const cancelEditInclude = () => {
    setEditingIncludeIndex(null);
    setEditingIncludeValue("");
  };

  const saveEditInclude = () => {
    if (editingIncludeIndex === null) return;
    const value = editingIncludeValue.trim();
    if (!value) return;
    setIncludes(
      includes.map((item, index) =>
        index === editingIncludeIndex ? value : item,
      ),
    );
    cancelEditInclude();
  };

  const onIncludeDrop = (targetIndex: number) => {
    if (
      draggedIncludeIndex === null ||
      draggedIncludeIndex === targetIndex ||
      editingIncludeIndex !== null
    ) {
      setDraggedIncludeIndex(null);
      return;
    }

    setIncludes((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedIncludeIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDraggedIncludeIndex(null);
  };

  const addNotInclude = () => {
    if (newNotInclude.trim()) {
      setNotIncludes([...notIncludes, newNotInclude.trim()]);
      setNewNotInclude("");
    }
  };

  const removeNotInclude = (index: number) => {
    if (editingNotIncludeIndex === index) {
      setEditingNotIncludeIndex(null);
      setEditingNotIncludeValue("");
    }
    setNotIncludes(notIncludes.filter((_, i) => i !== index));
  };

  const startEditNotInclude = (index: number) => {
    setEditingNotIncludeIndex(index);
    setEditingNotIncludeValue(notIncludes[index] || "");
  };

  const cancelEditNotInclude = () => {
    setEditingNotIncludeIndex(null);
    setEditingNotIncludeValue("");
  };

  const saveEditNotInclude = () => {
    if (editingNotIncludeIndex === null) return;
    const value = editingNotIncludeValue.trim();
    if (!value) return;
    setNotIncludes(
      notIncludes.map((item, index) =>
        index === editingNotIncludeIndex ? value : item,
      ),
    );
    cancelEditNotInclude();
  };

  const onNotIncludeDrop = (targetIndex: number) => {
    if (
      draggedNotIncludeIndex === null ||
      draggedNotIncludeIndex === targetIndex ||
      editingNotIncludeIndex !== null
    ) {
      setDraggedNotIncludeIndex(null);
      return;
    }

    setNotIncludes((prev) => {
      const next = [...prev];
      const [moved] = next.splice(draggedNotIncludeIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDraggedNotIncludeIndex(null);
  };

  const addRoomType = () => {
    if (
      newRoomType.name.trim() &&
      newRoomType.priceCents &&
      newRoomType.maxQuantity
    ) {
      const priceEuros = parseFloat(newRoomType.priceCents);
      const priceCents = Math.round(priceEuros * 100);
      setRoomTypes([
        ...roomTypes,
        {
          name: newRoomType.name.trim(),
          description: newRoomType.description.trim() || "",
          images: newRoomType.images,
          priceCents,
          priceEuros,
          maxQuantity: parseInt(newRoomType.maxQuantity),
        },
      ]);
      setNewRoomType({
        name: "",
        description: "",
        images: [],
        priceCents: "",
        maxQuantity: "",
      });
    }
  };

  const removeRoomType = (index: number) => {
    if (editingRoomTypeIndex === index) {
      setEditingRoomTypeIndex(null);
      setEditingRoomType({
        name: "",
        description: "",
        images: [],
        priceCents: "",
        maxQuantity: "",
      });
    }
    setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  const startEditRoomType = (index: number) => {
    const room = roomTypes[index];
    if (!room) return;
    setEditingRoomTypeIndex(index);
    setEditingRoomType({
      name: room.name,
      description: room.description || "",
      images: room.images || [],
      priceCents: (room.priceEuros ?? room.priceCents / 100).toString(),
      maxQuantity: room.maxQuantity.toString(),
    });
  };

  const cancelEditRoomType = () => {
    setEditingRoomTypeIndex(null);
    setEditingRoomType({
      name: "",
      description: "",
      images: [],
      priceCents: "",
      maxQuantity: "",
    });
  };

  const saveEditRoomType = () => {
    if (editingRoomTypeIndex === null) return;
    if (
      !editingRoomType.name.trim() ||
      !editingRoomType.priceCents ||
      !editingRoomType.maxQuantity
    ) {
      return;
    }

    const priceEuros = parseFloat(editingRoomType.priceCents);
    const maxQuantity = parseInt(editingRoomType.maxQuantity);
    if (Number.isNaN(priceEuros) || Number.isNaN(maxQuantity)) return;

    const priceCents = Math.round(priceEuros * 100);
    setRoomTypes((prev) =>
      prev.map((room, index) =>
        index === editingRoomTypeIndex
          ? {
              ...room,
              name: editingRoomType.name.trim(),
              description: editingRoomType.description.trim() || "",
              images: editingRoomType.images,
              priceCents,
              priceEuros,
              maxQuantity,
            }
          : room,
      ),
    );
    cancelEditRoomType();
  };

  const addExtraActivity = () => {
    if (newExtraActivity.name.trim() && newExtraActivity.priceCents) {
      const priceEuros = parseFloat(newExtraActivity.priceCents);
      const priceCents = Math.round(priceEuros * 100);
      setExtraActivities([
        ...extraActivities,
        {
          name: newExtraActivity.name.trim(),
          description: newExtraActivity.description.trim() || "",
          images: newExtraActivity.images,
          priceCents,
          priceEuros,
          allowMultiple: newExtraActivity.allowMultiple,
          maxQuantity: newExtraActivity.maxQuantity
            ? parseInt(newExtraActivity.maxQuantity)
            : null,
          link: newExtraActivity.link.trim() || undefined,
        },
      ]);
      setNewExtraActivity({
        name: "",
        description: "",
        images: [],
        priceCents: "",
        allowMultiple: true,
        maxQuantity: "",
        link: "",
      });
    }
  };

  const removeExtraActivity = (index: number) => {
    if (editingExtraActivityIndex === index) {
      setEditingExtraActivityIndex(null);
      setEditingExtraActivity({
        name: "",
        description: "",
        images: [],
        priceCents: "",
        allowMultiple: true,
        maxQuantity: "",
        link: "",
      });
    }
    setExtraActivities(extraActivities.filter((_, i) => i !== index));
  };

  const startEditExtraActivity = (index: number) => {
    const activity = extraActivities[index];
    if (!activity) return;
    setEditingExtraActivityIndex(index);
    setEditingExtraActivity({
      name: activity.name,
      description: activity.description || "",
      images: activity.images || [],
      priceCents: (activity.priceEuros ?? activity.priceCents / 100).toString(),
      allowMultiple: activity.allowMultiple,
      maxQuantity:
        activity.maxQuantity !== null && activity.maxQuantity !== undefined
          ? activity.maxQuantity.toString()
          : "",
      link: activity.link || "",
    });
  };

  const cancelEditExtraActivity = () => {
    setEditingExtraActivityIndex(null);
    setEditingExtraActivity({
      name: "",
      description: "",
      images: [],
      priceCents: "",
      allowMultiple: true,
      maxQuantity: "",
      link: "",
    });
  };

  const saveEditExtraActivity = () => {
    if (editingExtraActivityIndex === null) return;
    if (!editingExtraActivity.name.trim() || !editingExtraActivity.priceCents) {
      return;
    }

    const priceEuros = parseFloat(editingExtraActivity.priceCents);
    if (Number.isNaN(priceEuros)) return;
    const priceCents = Math.round(priceEuros * 100);

    const parsedMaxQuantity = editingExtraActivity.maxQuantity
      ? parseInt(editingExtraActivity.maxQuantity)
      : null;
    if (
      editingExtraActivity.maxQuantity &&
      (parsedMaxQuantity === null || Number.isNaN(parsedMaxQuantity))
    ) {
      return;
    }

    setExtraActivities((prev) =>
      prev.map((activity, index) =>
        index === editingExtraActivityIndex
          ? {
              ...activity,
              name: editingExtraActivity.name.trim(),
              description: editingExtraActivity.description.trim() || "",
              images: editingExtraActivity.images,
              priceCents,
              priceEuros,
              allowMultiple: editingExtraActivity.allowMultiple,
              maxQuantity: parsedMaxQuantity,
              link: editingExtraActivity.link.trim() || undefined,
            }
          : activity,
      ),
    );
    cancelEditExtraActivity();
  };

  const addFullDescriptionHighlight = () => {
    const value = newFullDescriptionHighlight.trim();
    if (!value) return;
    setFullDescriptionHighlights((prev) => [...prev, value]);
    setNewFullDescriptionHighlight("");
  };

  const removeFullDescriptionHighlight = (index: number) => {
    setFullDescriptionHighlights((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    const password = localStorage.getItem("adminPassword");
    if (!password) {
      router.push("/admin/login");
      return;
    }

    try {
      const data = {
        ...formData,
        maxPeople: Number(formData.maxPeople) || 12,
        reservationDepositCents: Math.max(
          0,
          Number(formData.reservationDepositCents) || 0,
        ),
        chargeFullAmount: formData.chargeFullAmount,
        images: retreatImages,
        activitiesImage: activitiesImage || null,
        arrivalOptions: arrivalOptions.length > 0 ? arrivalOptions : null,
        hotelName: formData.hotelName || null,
        hotelUrl: formData.hotelUrl || null,
        videoUrl: formData.videoUrl || null,
        accommodationTitle: formData.accommodationTitle || null,
        accommodationDescription: formData.accommodationDescription || null,
        accommodationImages,
        dayByDay: dayByDay.length > 0 ? dayByDay : null,
        includes: includes.length > 0 ? includes : null,
        notIncludes: notIncludes.length > 0 ? notIncludes : null,
        textHighlights:
          fullDescriptionHighlights.length > 0
            ? {
                fullDescription: fullDescriptionHighlights,
              }
            : null,
        arrivalIntro: formData.arrivalIntro || null,
        bgColor: formData.bgColor || null,
        roomTypes: roomTypes.map((rt) => ({
          name: rt.name,
          description: rt.description || "",
          images: rt.images || [],
          priceCents: rt.priceCents,
          maxQuantity: rt.maxQuantity,
        })),
        extraActivities: extraActivities.map((ea) => ({
          name: ea.name,
          description: ea.description || "",
          images: ea.images || [],
          priceCents: ea.priceCents,
          allowMultiple: ea.allowMultiple,
          maxQuantity: ea.maxQuantity,
        })),
      };

      const url = isEdit
        ? `/api/admin/retreats/${retreat?.slug}`
        : `/api/admin/retreats`;

      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccessMessage(
          isEdit
            ? "Retiro actualizado correctamente."
            : "Retiro creado correctamente.",
        );
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Error saving retreat");
      }
    } catch (err: any) {
      setError(err.message || "Error saving retreat");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  const colorPreview = formData.bgColor?.trim() || "#ffffff";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMessage && (
        <div className="fixed top-6 right-6 z-50">
          <div className="bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-lg border border-emerald-500">
            {successMessage}
          </div>
        </div>
      )}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">
          Información Básica
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Slug <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              required
              disabled={isEdit}
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Identificador único para la URL (no se puede cambiar)
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Título <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Ubicación
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Ej: Pirineos, España"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Fechas
            </label>
            <input
              type="text"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Ej: 15-18 Mayo 2024"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Precio
            </label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Ej: Desde 450€"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Color fondo (waves y secciones)
            </label>
            <div className="flex items-center gap-2">
              <span
                className="h-10 w-10 shrink-0 rounded-md border border-slate-300"
                style={{ backgroundColor: colorPreview }}
                aria-hidden="true"
              />
              <input
                type="text"
                name="bgColor"
                value={formData.bgColor}
                onChange={handleChange}
                placeholder="#d77a61"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              Formato HEX. Ej: #d77a61
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Reserva / señal (€)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={(formData.reservationDepositCents / 100).toString()}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  reservationDepositCents: Math.round(
                    (Number(e.target.value) || 0) * 100,
                  ),
                }))
              }
              placeholder="Ej: 600"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Importe máximo de reserva para este retiro (se cobra min(reserva,
              total)).
            </p>
            <label className="mt-3 flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="chargeFullAmount"
                checked={formData.chargeFullAmount}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
              />
              <span className="ml-2 text-sm font-medium text-slate-700">
                Cobrar total (sin reserva)
              </span>
            </label>
            <p className="text-xs text-slate-500 mt-1.5">
              Si está activo, se cobrará el 100% del retiro en Checkout.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Máx. personas
            </label>
            <input
              type="number"
              name="maxPeople"
              min={1}
              value={formData.maxPeople}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
            <p className="text-xs text-slate-500 mt-1.5">
              Número máximo de plazas del retiro
            </p>
          </div>
        </div>

        <div className="mt-5">
          <label className="block text-sm font-semibold mb-3 text-slate-700">
            Imágenes del Retiro
          </label>
          <ImageGallery
            images={retreatImages}
            onRemove={(index) =>
              setRetreatImages(retreatImages.filter((_, i) => i !== index))
            }
            onAdd={(url) => setRetreatImages([...retreatImages, url])}
            folder="yay/retreats"
          />
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="published"
              checked={formData.published}
              onChange={handleChange}
              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span className="ml-2 text-sm font-medium text-slate-700">
              Publicado
            </span>
            <span className="ml-2 text-xs text-slate-500">
              (visible en la web)
            </span>
          </label>
        </div>
      </div>

      {/* Descriptions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">Descripciones</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Descripción Corta
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Resumen breve del retiro..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Descripción Completa
            </label>
            <textarea
              name="fullDescription"
              value={formData.fullDescription}
              onChange={handleChange}
              rows={6}
              placeholder="Descripción detallada de la experiencia..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Highlights descripción completa
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFullDescriptionHighlight}
                onChange={(e) => setNewFullDescriptionHighlight(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addFullDescriptionHighlight())
                }
                placeholder="Añade un highlight"
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
              />
              <button
                type="button"
                onClick={addFullDescriptionHighlight}
                className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
              >
                Añadir
              </button>
            </div>
            {fullDescriptionHighlights.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {fullDescriptionHighlights.map((highlight, index) => (
                  <span
                    key={`${highlight}-${index}`}
                    className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full text-sm"
                  >
                    {highlight}
                    <button
                      type="button"
                      onClick={() => removeFullDescriptionHighlight(index)}
                      className="text-emerald-700 hover:text-rose-600 transition-colors text-xs font-bold"
                      aria-label="Eliminar highlight"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
            <p className="text-xs text-slate-500 mt-1.5">
              Se mostrarán como badges. Puedes quitar cada uno con la x.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Intro Llegadas
            </label>
            <textarea
              name="arrivalIntro"
              value={formData.arrivalIntro}
              onChange={handleChange}
              rows={3}
              placeholder="Texto introductorio sobre las opciones de llegada..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Nombre del hotel
            </label>
            <input
              type="text"
              name="hotelName"
              value={formData.hotelName}
              onChange={handleChange}
              placeholder="Ej: Riad Merzouga Premium"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              URL del hotel
            </label>
            <input
              type="url"
              name="hotelUrl"
              value={formData.hotelUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Video URL Accommodation
            </label>
            <input
              type="url"
              name="videoUrl"
              value={formData.videoUrl}
              onChange={handleChange}
              placeholder="https://...mp4"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Título Accommodation
            </label>
            <input
              type="text"
              name="accommodationTitle"
              value={formData.accommodationTitle}
              onChange={handleChange}
              placeholder="Ej: Accommodation"
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Descripción Accommodation
            </label>
            <textarea
              name="accommodationDescription"
              value={formData.accommodationDescription}
              onChange={handleChange}
              rows={4}
              placeholder="Describe el alojamiento del retiro..."
              className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-3 text-slate-700">
              Imágenes Accommodation
            </label>
            <ImageGallery
              images={accommodationImages}
              onRemove={(index) =>
                setAccommodationImages(
                  accommodationImages.filter((_, i) => i !== index),
                )
              }
              onAdd={(url) =>
                setAccommodationImages([...accommodationImages, url])
              }
              folder="yay/accommodation"
            />
          </div>
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">
          Actividades
        </h2>
        <div className="mb-5">
          <label className="block text-sm font-semibold mb-2 text-slate-700">
            Imagen collage de actividades
          </label>
          <ImageGallery
            images={activitiesImage ? [activitiesImage] : []}
            onRemove={() => setActivitiesImage("")}
            onAdd={(url) => setActivitiesImage(url)}
            folder="yay/activities"
          />
          <p className="text-xs text-slate-500 mt-1.5">
            Esta imagen se mostrará como collage visual de actividades.
          </p>
        </div>
      </div>

      {/* Arrival Options */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">
          Opciones de Llegada
        </h2>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            type="text"
            value={newArrivalOption.title}
            onChange={(e) =>
              setNewArrivalOption({
                ...newArrivalOption,
                title: e.target.value,
              })
            }
            placeholder="Título (Ej: Vuelo Madrid)"
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <input
            type="text"
            value={newArrivalOption.detail}
            onChange={(e) =>
              setNewArrivalOption({
                ...newArrivalOption,
                detail: e.target.value,
              })
            }
            placeholder="Detalle (Ej: Te recogemos en aeropuerto)"
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={addArrivalOption}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Añadir Opción
          </button>
        </div>
        {arrivalOptions.length > 0 && (
          <div className="space-y-3">
            {arrivalOptions.map((option, index) => (
              <div
                key={index}
                className="bg-slate-50 p-4 rounded-lg border border-slate-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-slate-800">{option.title}</p>
                  <button
                    type="button"
                    onClick={() => removeArrivalOption(index)}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
                <p className="text-sm text-slate-600">{option.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Day by Day */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">
          Itinerario Día a Día
        </h2>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            type="text"
            value={newDayByDay.day}
            onChange={(e) =>
              setNewDayByDay({ ...newDayByDay, day: e.target.value })
            }
            placeholder="Día (Ej: Día 1)"
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <textarea
            value={newDayByDay.items}
            onChange={(e) =>
              setNewDayByDay({ ...newDayByDay, items: e.target.value })
            }
            placeholder="Actividades (una por línea)&#10;Ej:&#10;Llegada 16:00h&#10;Yoga de bienvenida&#10;Cena"
            rows={4}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={addDayByDay}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Añadir Día
          </button>
        </div>
        {dayByDay.length > 0 && (
          <div className="space-y-3">
            {dayByDay.map((day, index) => (
              <div
                key={index}
                draggable={editingDayIndex === null}
                onDragStart={() => setDraggedDayIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDayByDayDrop(index)}
                onDragEnd={() => setDraggedDayIndex(null)}
                className={`bg-slate-50 p-4 rounded-lg border border-slate-100 ${
                  draggedDayIndex === index ? "opacity-50" : ""
                } ${editingDayIndex === null ? "cursor-move" : ""}`}
              >
                {editingDayIndex === index ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingDayByDay.day}
                      onChange={(e) =>
                        setEditingDayByDay({
                          ...editingDayByDay,
                          day: e.target.value,
                        })
                      }
                      placeholder="Día (Ej: Día 1)"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                    />
                    <textarea
                      value={editingDayByDay.items}
                      onChange={(e) =>
                        setEditingDayByDay({
                          ...editingDayByDay,
                          items: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Actividades (una por línea)"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={saveEditDayByDay}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditDayByDay}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-slate-800 flex items-center gap-2">
                        <span className="text-slate-400 font-bold">⋮⋮</span>
                        {day.day}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => startEditDayByDay(index)}
                          className="text-sky-600 hover:text-sky-700 text-sm font-medium transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDayByDay(index)}
                          className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                    <ul className="text-sm text-slate-600 space-y-1">
                      {day.items.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-emerald-600">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Includes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">Qué Incluye</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newInclude}
            onChange={(e) => setNewInclude(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addInclude())
            }
            placeholder="Ej: Alojamiento 3 noches"
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={addInclude}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
          >
            Añadir
          </button>
        </div>
        {includes.length > 0 && (
          <ul className="space-y-2">
            {includes.map((item, index) => (
              <li
                key={index}
                draggable={editingIncludeIndex === null}
                onDragStart={() => setDraggedIncludeIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onIncludeDrop(index)}
                onDragEnd={() => setDraggedIncludeIndex(null)}
                className={`bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 ${
                  draggedIncludeIndex === index ? "opacity-50" : ""
                } ${editingIncludeIndex === null ? "cursor-move" : ""}`}
              >
                {editingIncludeIndex === index ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingIncludeValue}
                      onChange={(e) => setEditingIncludeValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveEditInclude();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          cancelEditInclude();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={saveEditInclude}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditInclude}
                      className="text-slate-600 hover:text-slate-700 text-sm font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="flex gap-2 text-slate-700">
                      <span className="text-slate-400 font-bold">⋮⋮</span>
                      <span className="text-emerald-600 font-bold">✓</span>
                      {item}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => startEditInclude(index)}
                        className="text-sky-600 hover:text-sky-700 text-sm font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => removeInclude(index)}
                        className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Not Includes */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">No Incluye</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newNotInclude}
            onChange={(e) => setNewNotInclude(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addNotInclude())
            }
            placeholder="Ej: Vuelos"
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={addNotInclude}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
          >
            Añadir
          </button>
        </div>
        {notIncludes.length > 0 && (
          <ul className="space-y-2">
            {notIncludes.map((item, index) => (
              <li
                key={index}
                draggable={editingNotIncludeIndex === null}
                onDragStart={() => setDraggedNotIncludeIndex(index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onNotIncludeDrop(index)}
                onDragEnd={() => setDraggedNotIncludeIndex(null)}
                className={`bg-slate-50 px-4 py-3 rounded-lg border border-slate-100 ${
                  draggedNotIncludeIndex === index ? "opacity-50" : ""
                } ${editingNotIncludeIndex === null ? "cursor-move" : ""}`}
              >
                {editingNotIncludeIndex === index ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={editingNotIncludeValue}
                      onChange={(e) => setEditingNotIncludeValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          saveEditNotInclude();
                        }
                        if (e.key === "Escape") {
                          e.preventDefault();
                          cancelEditNotInclude();
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={saveEditNotInclude}
                      className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                    >
                      Guardar
                    </button>
                    <button
                      type="button"
                      onClick={cancelEditNotInclude}
                      className="text-slate-600 hover:text-slate-700 text-sm font-medium transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className="flex gap-2 text-slate-700">
                      <span className="text-slate-400 font-bold">⋮⋮</span>
                      <span className="text-slate-400 font-bold">–</span>
                      {item}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => startEditNotInclude(index)}
                        className="text-sky-600 hover:text-sky-700 text-sm font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => removeNotInclude(index)}
                        className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Room Types */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">
          Tipos de Habitación
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Define las opciones de alojamiento y sus precios
        </p>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            type="text"
            value={newRoomType.name}
            onChange={(e) =>
              setNewRoomType({ ...newRoomType, name: e.target.value })
            }
            placeholder="Nombre (Ej: Habitación compartida)"
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <textarea
            value={newRoomType.description}
            onChange={(e) =>
              setNewRoomType({ ...newRoomType, description: e.target.value })
            }
            placeholder="Descripción (Ej: Habitación amplia con cama doble y vistas al mar)"
            rows={2}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="number"
              step="0.01"
              min="0"
              value={newRoomType.priceCents}
              onChange={(e) =>
                setNewRoomType({ ...newRoomType, priceCents: e.target.value })
              }
              placeholder="Precio en € (Ej: 450.00)"
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
            <input
              type="number"
              min="1"
              value={newRoomType.maxQuantity}
              onChange={(e) =>
                setNewRoomType({ ...newRoomType, maxQuantity: e.target.value })
              }
              placeholder="Cantidad máxima"
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Imágenes
            </label>
            <ImageGallery
              images={newRoomType.images}
              onRemove={(index) =>
                setNewRoomType({
                  ...newRoomType,
                  images: newRoomType.images.filter((_, i) => i !== index),
                })
              }
              onAdd={(url) =>
                setNewRoomType({
                  ...newRoomType,
                  images: [...newRoomType.images, url],
                })
              }
              folder="yay/rooms"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={addRoomType}
          className="w-full px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Añadir Tipo de Habitación
        </button>
        {roomTypes.length > 0 && (
          <div className="mt-4 space-y-3">
            {roomTypes.map((room, index) => (
              <div
                key={index}
                className="bg-slate-50 p-4 rounded-lg border border-slate-100"
              >
                {editingRoomTypeIndex === index ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingRoomType.name}
                      onChange={(e) =>
                        setEditingRoomType({
                          ...editingRoomType,
                          name: e.target.value,
                        })
                      }
                      placeholder="Nombre"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                    />
                    <textarea
                      value={editingRoomType.description}
                      onChange={(e) =>
                        setEditingRoomType({
                          ...editingRoomType,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Descripción"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingRoomType.priceCents}
                        onChange={(e) =>
                          setEditingRoomType({
                            ...editingRoomType,
                            priceCents: e.target.value,
                          })
                        }
                        placeholder="Precio en €"
                        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      />
                      <input
                        type="number"
                        min="1"
                        value={editingRoomType.maxQuantity}
                        onChange={(e) =>
                          setEditingRoomType({
                            ...editingRoomType,
                            maxQuantity: e.target.value,
                          })
                        }
                        placeholder="Cantidad máxima"
                        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      />
                    </div>
                    <ImageGallery
                      images={editingRoomType.images}
                      onRemove={(imgIndex) =>
                        setEditingRoomType({
                          ...editingRoomType,
                          images: editingRoomType.images.filter(
                            (_, i) => i !== imgIndex,
                          ),
                        })
                      }
                      onAdd={(url) =>
                        setEditingRoomType({
                          ...editingRoomType,
                          images: [...editingRoomType.images, url],
                        })
                      }
                      folder="yay/rooms"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={saveEditRoomType}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditRoomType}
                        className="text-slate-600 hover:text-slate-700 text-sm font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{room.name}</p>
                      {room.description && (
                        <p className="text-sm text-slate-600 mt-1">
                          {room.description}
                        </p>
                      )}
                      {room.images && room.images.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {room.images.map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="w-12 h-12 relative rounded border border-slate-200"
                            >
                              <Image
                                src={img}
                                alt=""
                                fill
                                className="object-cover rounded"
                                sizes="48px"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-slate-600">
                        <span className="font-medium">
                          💰{" "}
                          {(room.priceEuros ?? room.priceCents / 100).toFixed(2)}€
                        </span>
                        <span>📦 Max: {room.maxQuantity}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => startEditRoomType(index)}
                        className="text-sky-600 hover:text-sky-700 text-sm font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRoomType(index)}
                        className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Extra Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">
          Actividades Extra
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Actividades opcionales que se pueden añadir a la reserva
        </p>
        <div className="grid grid-cols-1 gap-3 mb-4">
          <input
            type="text"
            value={newExtraActivity.name}
            onChange={(e) =>
              setNewExtraActivity({ ...newExtraActivity, name: e.target.value })
            }
            placeholder="Nombre (Ej: Masaje relajante)"
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <textarea
            value={newExtraActivity.description}
            onChange={(e) =>
              setNewExtraActivity({
                ...newExtraActivity,
                description: e.target.value,
              })
            }
            placeholder="Descripción (Ej: Masaje de 60 minutos con aceites esenciales)"
            rows={2}
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <input
            type="url"
            value={newExtraActivity.link}
            onChange={(e) =>
              setNewExtraActivity({ ...newExtraActivity, link: e.target.value })
            }
            placeholder="Link (opcional) - Ej: https://ejemplo.com/info"
            className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="number"
              step="0.01"
              min="0"
              value={newExtraActivity.priceCents}
              onChange={(e) =>
                setNewExtraActivity({
                  ...newExtraActivity,
                  priceCents: e.target.value,
                })
              }
              placeholder="Precio en € (Ej: 50.00)"
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
            <input
              type="number"
              min="1"
              value={newExtraActivity.maxQuantity}
              onChange={(e) =>
                setNewExtraActivity({
                  ...newExtraActivity,
                  maxQuantity: e.target.value,
                })
              }
              placeholder="Cantidad máxima (opcional)"
              className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
            />
          </div>
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={newExtraActivity.allowMultiple}
              onChange={(e) =>
                setNewExtraActivity({
                  ...newExtraActivity,
                  allowMultiple: e.target.checked,
                })
              }
              className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
            />
            <span className="ml-2 text-sm font-medium text-slate-700">
              Permitir múltiples unidades
            </span>
          </label>
          <div>
            <label className="block text-sm font-semibold mb-2 text-slate-700">
              Imágenes
            </label>
            <ImageGallery
              images={newExtraActivity.images}
              onRemove={(index) =>
                setNewExtraActivity({
                  ...newExtraActivity,
                  images: newExtraActivity.images.filter((_, i) => i !== index),
                })
              }
              onAdd={(url) =>
                setNewExtraActivity({
                  ...newExtraActivity,
                  images: [...newExtraActivity.images, url],
                })
              }
              folder="yay/extras"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={addExtraActivity}
          className="w-full px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
        >
          Añadir Actividad Extra
        </button>
        {extraActivities.length > 0 && (
          <div className="mt-4 space-y-3">
            {extraActivities.map((activity, index) => (
              <div
                key={index}
                className="bg-slate-50 p-4 rounded-lg border border-slate-100"
              >
                {editingExtraActivityIndex === index ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editingExtraActivity.name}
                      onChange={(e) =>
                        setEditingExtraActivity({
                          ...editingExtraActivity,
                          name: e.target.value,
                        })
                      }
                      placeholder="Nombre"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                    />
                    <textarea
                      value={editingExtraActivity.description}
                      onChange={(e) =>
                        setEditingExtraActivity({
                          ...editingExtraActivity,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      placeholder="Descripción"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                    />
                    <input
                      type="url"
                      value={editingExtraActivity.link}
                      onChange={(e) =>
                        setEditingExtraActivity({
                          ...editingExtraActivity,
                          link: e.target.value,
                        })
                      }
                      placeholder="Link (opcional)"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editingExtraActivity.priceCents}
                        onChange={(e) =>
                          setEditingExtraActivity({
                            ...editingExtraActivity,
                            priceCents: e.target.value,
                          })
                        }
                        placeholder="Precio en €"
                        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      />
                      <input
                        type="number"
                        min="1"
                        value={editingExtraActivity.maxQuantity}
                        onChange={(e) =>
                          setEditingExtraActivity({
                            ...editingExtraActivity,
                            maxQuantity: e.target.value,
                          })
                        }
                        placeholder="Cantidad máxima (opcional)"
                        className="px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
                      />
                    </div>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingExtraActivity.allowMultiple}
                        onChange={(e) =>
                          setEditingExtraActivity({
                            ...editingExtraActivity,
                            allowMultiple: e.target.checked,
                          })
                        }
                        className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <span className="ml-2 text-sm font-medium text-slate-700">
                        Permitir múltiples unidades
                      </span>
                    </label>
                    <ImageGallery
                      images={editingExtraActivity.images}
                      onRemove={(imgIndex) =>
                        setEditingExtraActivity({
                          ...editingExtraActivity,
                          images: editingExtraActivity.images.filter(
                            (_, i) => i !== imgIndex,
                          ),
                        })
                      }
                      onAdd={(url) =>
                        setEditingExtraActivity({
                          ...editingExtraActivity,
                          images: [...editingExtraActivity.images, url],
                        })
                      }
                      folder="yay/extras"
                    />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={saveEditExtraActivity}
                        className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
                      >
                        Guardar
                      </button>
                      <button
                        type="button"
                        onClick={cancelEditExtraActivity}
                        className="text-slate-600 hover:text-slate-700 text-sm font-medium transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">
                        {activity.name}
                      </p>
                      {activity.description && (
                        <p className="text-sm text-slate-600 mt-1">
                          {activity.description}
                        </p>
                      )}
                      {activity.link && (
                        <a
                          href={activity.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline mt-1 inline-block"
                        >
                          🔗 Ver más información
                        </a>
                      )}
                      {activity.images && activity.images.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {activity.images.map((img, imgIdx) => (
                            <div
                              key={imgIdx}
                              className="w-12 h-12 relative rounded border border-slate-200"
                            >
                              <Image
                                src={img}
                                alt=""
                                fill
                                className="object-cover rounded"
                                sizes="48px"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-slate-600">
                        <span className="font-medium">
                          💰{" "}
                          {(
                            activity.priceEuros ?? activity.priceCents / 100
                          ).toFixed(2)}
                          €
                        </span>
                        {activity.maxQuantity && (
                          <span>📦 Max: {activity.maxQuantity}</span>
                        )}
                        <span
                          className={
                            activity.allowMultiple
                              ? "text-emerald-600"
                              : "text-slate-400"
                          }
                        >
                          {activity.allowMultiple ? "✓ Múltiples" : "✗ Único"}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => startEditExtraActivity(index)}
                        className="text-sky-600 hover:text-sky-700 text-sm font-medium transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => removeExtraActivity(index)}
                        className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow sticky bottom-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-8 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading
            ? "Guardando..."
            : isEdit
              ? "Actualizar Retiro"
              : "Crear Retiro"}
        </button>
      </div>
    </form>
  );
}
