"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type FlyerThumbnailProps = {
  src: string;
  alt: string;
  containerClassName?: string;
  imageClassName?: string;
};

export default function FlyerThumbnail({
  src,
  alt,
  containerClassName,
  imageClassName,
}: FlyerThumbnailProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isOpen]);

  return (
    <>
      <div className={containerClassName}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          onDoubleClick={() => setIsOpen(true)}
          className="h-full w-full cursor-zoom-in"
          aria-label={`Open flyer: ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            className={cn("h-full w-full", imageClassName)}
            loading="lazy"
          />
        </button>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Expanded flyer preview"
        >
          <div className="relative max-h-[92vh] max-w-[96vw]" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 text-xs font-semibold text-stone-900 shadow"
              aria-label="Close flyer preview"
            >
              Close
            </button>
            <img
              src={src}
              alt={alt}
              className="max-h-[92vh] max-w-[96vw] rounded-lg border border-white/20 bg-black object-contain"
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
