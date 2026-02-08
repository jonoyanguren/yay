"use client";

import { useState } from "react";
import ImageUploadWidget from "./ImageUploadWidget";

interface ImageGalleryProps {
  images: string[];
  onRemove: (index: number) => void;
  onAdd: (url: string) => void;
  maxImages?: number;
  folder?: string;
}

export default function ImageGallery({
  images,
  onRemove,
  onAdd,
  maxImages = 5,
  folder = "yay",
}: ImageGalleryProps) {
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);
  const canAddMore = images.length < maxImages;

  const handleDelete = async (index: number, imageUrl: string) => {
    if (deletingIndex !== null) return; // Prevent multiple simultaneous deletions
    
    const confirmed = confirm("¿Estás seguro de que quieres eliminar esta imagen? Se borrará permanentemente de Cloudinary.");
    if (!confirmed) return;

    setDeletingIndex(index);

    try {
      // Get password from localStorage
      const password = localStorage.getItem("adminPassword");
      if (!password) {
        alert("No estás autenticado");
        setDeletingIndex(null);
        return;
      }

      // Delete from Cloudinary via API
      const response = await fetch("/api/cloudinary/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${password}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      const result = await response.json();

      if (response.ok) {
        // Remove from local state
        onRemove(index);
        
        if (result.warning) {
          console.warn(result.warning);
        }
      } else {
        alert(`Error al eliminar: ${result.error}`);
      }
    } catch (error: any) {
      console.error("Error deleting image:", error);
      alert("Error al eliminar la imagen. Por favor, intenta de nuevo.");
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Images Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {images.map((imageUrl, index) => {
            console.log("Rendering image:", imageUrl);
            return (
              <div
                key={`${imageUrl}-${index}`}
                className="relative w-full bg-slate-100 group"
                style={{ paddingBottom: "100%" }}
              >
                <div className="absolute inset-0 rounded-lg overflow-hidden border-2 border-slate-200">
                  {/* Image */}
                  <img
                    src={imageUrl}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-full object-cover"
                    style={{ display: "block" }}
                    onLoad={(e) => {
                      console.log("Image loaded:", imageUrl);
                    }}
                    onError={(e) => {
                      console.error("Image error:", imageUrl);
                    }}
                  />
                  
                  {/* Image Number Badge */}
                  <div className="absolute top-2 left-2 bg-slate-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded z-20">
                    {index + 1}
                  </div>
                  
                  {/* Hover Overlay with Delete Button - ONLY visible on hover */}
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-40 transition-opacity duration-200 pointer-events-none z-10"></div>
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <button
                      type="button"
                      onClick={() => handleDelete(index, imageUrl)}
                      disabled={deletingIndex === index}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg shadow-lg disabled:cursor-not-allowed"
                      title="Eliminar imagen de Cloudinary"
                    >
                      {deletingIndex === index ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        "✕"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {images.length === 0 && (
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
          <div className="text-slate-400 text-4xl mb-2">📷</div>
          <p className="text-slate-600 text-sm mb-1">No hay imágenes</p>
          <p className="text-slate-500 text-xs">
            Sube hasta {maxImages} imágenes
          </p>
        </div>
      )}

      {/* Upload Button */}
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg border border-slate-200">
        <div className="text-sm text-slate-600">
          {images.length} de {maxImages} imágenes
          {!canAddMore && (
            <span className="ml-2 text-amber-600">(límite alcanzado)</span>
          )}
        </div>
        {canAddMore && (
          <ImageUploadWidget onUpload={onAdd} folder={folder} />
        )}
      </div>
      
      {/* Debug info */}
      {images.length > 0 && (
        <div className="text-xs text-slate-400 p-2 bg-slate-50 rounded border border-slate-200">
          <details>
            <summary className="cursor-pointer">Debug: Ver URLs</summary>
            <div className="mt-2 space-y-1">
              {images.map((url, i) => (
                <div key={i} className="font-mono text-xs break-all">
                  {i + 1}. {url}
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
