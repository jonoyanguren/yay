"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Retreat {
  id: string;
  slug: string;
  title: string;
  location: string;
  date: string;
  published: boolean;
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRetreats = async () => {
    const password = localStorage.getItem("adminPassword");
    if (!password) return;

    try {
      const res = await fetch("/api/admin/retreats", {
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setRetreats(data);
      } else {
        setError("Error fetching retreats");
      }
    } catch (err) {
      setError("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRetreats();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    const password = localStorage.getItem("adminPassword");
    if (!password) return;

    try {
      const res = await fetch(`/api/admin/retreats/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (res.ok) {
        setRetreats(retreats.filter((r) => r.id !== id));
      } else {
        alert("Error deleting retreat");
      }
    } catch (err) {
      alert("Error deleting retreat");
    }
  };

  const handleTogglePublish = async (id: string) => {
    const password = localStorage.getItem("adminPassword");
    if (!password) return;

    try {
      const res = await fetch(`/api/admin/retreats/${id}/publish`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${password}`,
        },
      });

      if (res.ok) {
        const updatedRetreat = await res.json();
        setRetreats(
          retreats.map((r) =>
            r.id === id ? { ...r, published: updatedRetreat.published } : r
          )
        );
      } else {
        alert("Error toggling publish status");
      }
    } catch (err) {
      alert("Error toggling publish status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminPassword");
    router.push("/admin/login");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Retreat Dashboard</h1>
          <div className="flex gap-3">
            <Link
              href="/admin/retreats/new"
              className="bg-emerald-600 text-white px-5 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
            >
              + New Retreat
            </Link>
            <button
              onClick={handleLogout}
              className="bg-slate-100 text-slate-700 px-5 py-2.5 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3.5 rounded-lg mb-6 font-medium text-sm">
            {error}
          </div>
        )}

        {/* Retreats Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {retreats.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    No retreats yet. Create your first one!
                  </td>
                </tr>
              ) : (
                retreats.map((retreat) => (
                  <tr key={retreat.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{retreat.title}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{retreat.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {retreat.location}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {retreat.date}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${
                          retreat.published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {retreat.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        {retreat.published ? (
                          <Link
                            href={`/retreats/${retreat.slug}`}
                            target="_blank"
                            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors"
                          >
                            View
                          </Link>
                        ) : (
                          <Link
                            href={`/admin/retreats/${retreat.id}/preview`}
                            target="_blank"
                            className="px-3 py-1.5 text-xs font-medium text-violet-700 bg-violet-50 hover:bg-violet-100 rounded-md transition-colors"
                          >
                            Preview
                          </Link>
                        )}
                        <Link
                          href={`/admin/retreats/${retreat.id}/edit`}
                          className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleTogglePublish(retreat.id)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                            retreat.published
                              ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                              : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                          }`}
                        >
                          {retreat.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          onClick={() => handleDelete(retreat.id, retreat.title)}
                          className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
