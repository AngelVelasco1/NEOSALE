"use client";

import { useCallback, useState, forwardRef } from "react";
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
      <div
        {...getRootProps({
          className: cn(
            " border-dashed border-2 border-slate-600/40 bg-slate-800/50 text-slate-200 placeholder:text-slate-400/70 focus:border-indigo-400/60 focus:bg-slate-700/50 hover:border-slate-500/60 transition-all duration-200 focus:ring-0 focus:ring-offset-0 shadow-sm cursor-pointer p-6 flex flex-col items-center justify-center rounded-md",
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

      {preview && (
        <div className="size-28 p-2 rounded-md relative border border-input mt-4">
          <Image
            src={preview}
            alt="Preview"
            width={96}
            height={96}
            className="size-full object-cover"
          />

          <button
            onClick={removePreview}
            className="absolute -top-2 -right-2 text-red-500"
          >
            <XCircle className="size-5" />
          </button>
        </div>
      )}
    </div>
  );
});
