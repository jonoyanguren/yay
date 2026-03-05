"use client";

import { useEffect } from "react";
import Swal from "sweetalert2";

interface CloudinaryWidget {
  open: () => void;
  close: () => void;
}

interface CloudinaryUploadResult {
  event: string;
  info: {
    secure_url: string;
    public_id: string;
    [key: string]: any;
  };
}

interface ImageUploadWidgetProps {
  onUpload: (url: string) => void;
  folder?: string;
}

declare global {
  interface Window {
    cloudinary?: {
      createUploadWidget: (
        options: any,
        callback: (error: any, result: CloudinaryUploadResult) => void,
      ) => CloudinaryWidget;
    };
  }
}

export default function ImageUploadWidget({
  onUpload,
  folder = "yay",
}: ImageUploadWidgetProps) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  useEffect(() => {
    // Load Cloudinary script if not already loaded
    if (!window.cloudinary) {
      const script = document.createElement("script");
      script.src = "https://upload-widget.cloudinary.com/global/all.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const openWidget = () => {
    if (!cloudName || !uploadPreset) {
      void Swal.fire({
        icon: "error",
        title: "Cloudinary no configurado",
        text: "Error: Cloudinary no está configurado. Agrega NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME y NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET en tu archivo .env",
      });
      return;
    }

    if (!window.cloudinary) {
      void Swal.fire({
        icon: "warning",
        title: "Widget no cargado",
        text: "Cloudinary widget aún no está cargado. Intenta de nuevo.",
      });
      return;
    }

    // Always create a fresh widget to avoid state issues
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName,
        uploadPreset,
        folder,
        sources: ["local", "url", "camera"],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ["png", "jpg", "jpeg", "webp", "gif"],
        maxImageFileSize: 10000000, // 10MB
        maxImageWidth: 2000,
        maxImageHeight: 2000,
        cropping: false,
        showSkipCropButton: true,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#10B981",
            tabIcon: "#10B981",
            menuIcons: "#334155",
            textDark: "#1E293B",
            textLight: "#FFFFFF",
            link: "#10B981",
            action: "#10B981",
            inactiveTabIcon: "#94A3B8",
            error: "#EF4444",
            inProgress: "#10B981",
            complete: "#10B981",
            sourceBg: "#F8FAFC",
          },
        },
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          void Swal.fire({
            icon: "error",
            title: "Error al subir imagen",
            text: "Intenta de nuevo en unos segundos.",
          });
          return;
        }

        if (result.event === "success") {
          onUpload(result.info.secure_url);
          // Close widget after successful upload
          widget.close();
        }
      },
    );

    widget.open();
  };

  return (
    <button
      type="button"
      onClick={openWidget}
      className="px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm whitespace-nowrap"
    >
      📷 Subir Imagen
    </button>
  );
}
