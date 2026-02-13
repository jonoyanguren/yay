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

  const [formData, setFormData] = useState({
    slug: retreat?.slug || "",
    title: retreat?.title || "",
    location: retreat?.location || "",
    description: retreat?.description || "",
    fullDescription: retreat?.fullDescription || "",
    date: retreat?.date || "",
    price: retreat?.price || "",
    maxPeople: retreat?.maxPeople ?? 12,
    published: retreat?.published || false,
    arrivalIntro: retreat?.arrivalIntro || "",
  });

  // Image states
  const [retreatImages, setRetreatImages] = useState<string[]>(
    retreat?.images || [],
  );

  // Array states for structured data
  const [activities, setActivities] = useState<string[]>(
    retreat?.activities || [],
  );
  const [program, setProgram] = useState<string[]>(retreat?.program || []);
  const [arrivalOptions, setArrivalOptions] = useState<ArrivalOption[]>(
    retreat?.arrivalOptions || [],
  );
  const [dayByDay, setDayByDay] = useState<DayByDay[]>(retreat?.dayByDay || []);
  const [includes, setIncludes] = useState<string[]>(retreat?.includes || []);
  const [notIncludes, setNotIncludes] = useState<string[]>(
    retreat?.notIncludes || [],
  );
  const [extraIdeas, setExtraIdeas] = useState<string[]>(
    retreat?.extraIdeas || [],
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
  const [newActivity, setNewActivity] = useState("");
  const [newProgram, setNewProgram] = useState("");
  const [newArrivalOption, setNewArrivalOption] = useState({
    title: "",
    detail: "",
  });
  const [newDayByDay, setNewDayByDay] = useState({ day: "", items: "" });
  const [newInclude, setNewInclude] = useState("");
  const [newNotInclude, setNewNotInclude] = useState("");
  const [newExtraIdea, setNewExtraIdea] = useState("");
  const [newRoomType, setNewRoomType] = useState({
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

  // Add/Remove functions
  const addActivity = () => {
    if (newActivity.trim()) {
      setActivities([...activities, newActivity.trim()]);
      setNewActivity("");
    }
  };

  const removeActivity = (index: number) => {
    setActivities(activities.filter((_, i) => i !== index));
  };

  const addProgram = () => {
    if (newProgram.trim()) {
      setProgram([...program, newProgram.trim()]);
      setNewProgram("");
    }
  };

  const removeProgram = (index: number) => {
    setProgram(program.filter((_, i) => i !== index));
  };

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
    setDayByDay(dayByDay.filter((_, i) => i !== index));
  };

  const addInclude = () => {
    if (newInclude.trim()) {
      setIncludes([...includes, newInclude.trim()]);
      setNewInclude("");
    }
  };

  const removeInclude = (index: number) => {
    setIncludes(includes.filter((_, i) => i !== index));
  };

  const addNotInclude = () => {
    if (newNotInclude.trim()) {
      setNotIncludes([...notIncludes, newNotInclude.trim()]);
      setNewNotInclude("");
    }
  };

  const removeNotInclude = (index: number) => {
    setNotIncludes(notIncludes.filter((_, i) => i !== index));
  };

  const addExtraIdea = () => {
    if (newExtraIdea.trim()) {
      setExtraIdeas([...extraIdeas, newExtraIdea.trim()]);
      setNewExtraIdea("");
    }
  };

  const removeExtraIdea = (index: number) => {
    setExtraIdeas(extraIdeas.filter((_, i) => i !== index));
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
    setRoomTypes(roomTypes.filter((_, i) => i !== index));
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
    setExtraActivities(extraActivities.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
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
        images: retreatImages,
        activities,
        program,
        arrivalOptions: arrivalOptions.length > 0 ? arrivalOptions : null,
        dayByDay: dayByDay.length > 0 ? dayByDay : null,
        includes: includes.length > 0 ? includes : null,
        notIncludes: notIncludes.length > 0 ? notIncludes : null,
        extraIdeas: extraIdeas.length > 0 ? extraIdeas : null,
        arrivalIntro: formData.arrivalIntro || null,
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
        router.push("/admin");
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
            maxImages={5}
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
        </div>
      </div>

      {/* Activities */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">
          Actividades Destacadas
        </h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newActivity}
            onChange={(e) => setNewActivity(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addActivity())
            }
            placeholder="Ej: Yoga matinal"
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={addActivity}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
          >
            Añadir
          </button>
        </div>
        {activities.length > 0 && (
          <ul className="space-y-2">
            {activities.map((activity, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg border border-slate-100"
              >
                <span className="text-slate-700">{activity}</span>
                <button
                  type="button"
                  onClick={() => removeActivity(index)}
                  className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Program */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">Programa</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newProgram}
            onChange={(e) => setNewProgram(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addProgram())
            }
            placeholder="Ej: Día 1: Llegada y bienvenida"
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={addProgram}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
          >
            Añadir
          </button>
        </div>
        {program.length > 0 && (
          <ul className="space-y-2">
            {program.map((item, index) => (
              <li
                key={index}
                className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg border border-slate-100"
              >
                <span className="text-slate-700">{item}</span>
                <button
                  type="button"
                  onClick={() => removeProgram(index)}
                  className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
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
                className="bg-slate-50 p-4 rounded-lg border border-slate-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-slate-800">{day.day}</p>
                  <button
                    type="button"
                    onClick={() => removeDayByDay(index)}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
                <ul className="text-sm text-slate-600 space-y-1">
                  {day.items.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-600">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
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
                className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg border border-slate-100"
              >
                <span className="flex gap-2 text-slate-700">
                  <span className="text-emerald-600 font-bold">✓</span>
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => removeInclude(index)}
                  className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
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
                className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg border border-slate-100"
              >
                <span className="flex gap-2 text-slate-700">
                  <span className="text-slate-400 font-bold">–</span>
                  {item}
                </span>
                <button
                  type="button"
                  onClick={() => removeNotInclude(index)}
                  className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Extra Ideas */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-5 text-slate-800">
          Otras Ideas (tarde/noche)
        </h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newExtraIdea}
            onChange={(e) => setNewExtraIdea(e.target.value)}
            onKeyPress={(e) =>
              e.key === "Enter" && (e.preventDefault(), addExtraIdea())
            }
            placeholder="Ej: Masaje relajante"
            className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-shadow"
          />
          <button
            type="button"
            onClick={addExtraIdea}
            className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium whitespace-nowrap"
          >
            Añadir
          </button>
        </div>
        {extraIdeas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {extraIdeas.map((idea, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-full border border-slate-100"
              >
                <span className="text-sm text-slate-700">{idea}</span>
                <button
                  type="button"
                  onClick={() => removeExtraIdea(index)}
                  className="text-rose-600 hover:text-rose-700 text-xs font-medium transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
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
              maxImages={3}
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
                  <button
                    type="button"
                    onClick={() => removeRoomType(index)}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
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
              maxImages={3}
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
                  <button
                    type="button"
                    onClick={() => removeExtraActivity(index)}
                    className="text-rose-600 hover:text-rose-700 text-sm font-medium transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
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
