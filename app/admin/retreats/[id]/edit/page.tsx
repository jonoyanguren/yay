"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import RetreatForm from "../../../components/RetreatForm";

export default function EditRetreatPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [retreat, setRetreat] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRetreat = async () => {
      const password = localStorage.getItem("adminPassword");
      if (!password) return;

      try {
        const res = await fetch(`/api/admin/retreats/${id}`, {
          headers: {
            Authorization: `Bearer ${password}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setRetreat(data);
        } else {
          setError("Error fetching retreat");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRetreat();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !retreat) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
            {error || "Retreat not found"}
          </div>
          <Link href="/admin" className="mt-4 inline-block text-slate-600 hover:text-slate-800 font-medium">
            &larr; Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            href="/admin"
            className="text-slate-600 hover:text-slate-800 inline-flex items-center font-medium"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-gray-800">Edit Retreat</h1>
        
        <RetreatForm retreat={retreat} isEdit />
      </div>
    </div>
  );
}
