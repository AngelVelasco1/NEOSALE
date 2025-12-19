"use client";

import { useCallback, useState, useEffect, forwardRef } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { XCircle, UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

export const ImageDropzone = forwardRef<
  HTMLDivElement,
  {
    previewImage?: string;
    onFileAccepted: (file: File) => void;
    onFileRemoved: () => void;
  }
>(function ImageDropzone({ previewImage, onFileAccepted, onFileRemoved }, ref) {
  const [preview, setPreview] = useState<string | undefined>(previewImage);
  
  // Sincronizar el preview con la prop previewImage cuando cambie
  useEffect(() => {
    if (previewImage) {
      setPreview(previewImage);
    }
  }, [previewImage]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (preview) URL.revokeObjectURL(preview);

        setPreview(URL.createObjectURL(file));
        onFileAccepted(file);
      }
    },
    [onFileAccepted, preview]
  );

  const removePreview = () => {
    if (preview) URL.revokeObjectURL(preview);

    setPreview(undefined);
    onFileRemoved();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full">
      {preview ? (
        // Mostrar imagen actual o nueva con opción de cambiarla
        <div className="relative">
          <div className="flex flex-col items-center gap-4">
            {/* Imagen grande */}
            <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-slate-700/50 shadow-xl">
              <Image
                src={preview}
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-3">
              <div
                {...getRootProps({
                  className: "px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-400 cursor-pointer transition-all duration-200",
                })}
              >
                <input {...getInputProps()} />
                <span>Change Image</span>
              </div>

              <button
                type="button"
                onClick={removePreview}
                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-sm text-red-400 transition-all duration-200"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        // Mostrar dropzone cuando no hay imagen
        <div
          {...getRootProps({
            className: cn(
              "border-dashed border-2 border-slate-600/40 bg-slate-800/50 text-slate-200 placeholder:text-slate-400/70 focus:border-indigo-400/60 focus:bg-slate-700/50 hover:border-slate-500/60 transition-all duration-200 focus:ring-0 focus:ring-offset-0 shadow-sm cursor-pointer p-6 flex flex-col items-center justify-center rounded-md",
              isDragActive && "border-indigo-400/70 bg-slate-700/50"
            ),
            ref: ref,
          })}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col items-center space-y-2 pointer-events-none">
            <UploadCloud className="size-10 text-primary" />

            <p className="text-sm text-foreground/80">
              Drag your images or click here
            </p>

            <p className="text-xs italic text-muted-foreground">
              (Only *.jpeg, *.webp and *.png images will be accepted)
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
