"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  lat?: number;
  lng?: number;
  zoom?: number;
  markerLabel?: string;
};

type GoogleMapsWindow = Window & {
  google?: {
    maps?: {
      Map: new (element: HTMLElement, options: Record<string, unknown>) => unknown;
      Marker: new (options: Record<string, unknown>) => unknown;
    };
  };
};

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) return resolve();
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Failed to load script"));
    document.head.appendChild(s);
  });
}

export default function Map({ lat = 41.835, lng = -71.397, zoom = 16, markerLabel = "Masjid Al Kareem" }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    const src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;

    let cancelled = false;

    loadScript(src)
      .then(() => {
        if (cancelled) return;
        if (!ref.current) return;
        const win = window as GoogleMapsWindow;
        const google = win.google;
        if (!google || !google.maps) return;

        const map = new google.maps.Map(ref.current, {
          center: { lat, lng },
          zoom,
          gestureHandling: "cooperative",
        });

        new google.maps.Marker({ position: { lat, lng }, map, title: markerLabel });
      })
      .catch(() => {
        /* ignore load errors; fallback will be shown in UI */
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lng, zoom, markerLabel]);

  return (
    <div className="h-full w-full bg-stone-100">
      <div ref={ref} className="h-full w-full" />
      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
        <div className="absolute inset-0 flex items-center justify-center p-4 text-center text-sm text-stone-600">
          Google Maps API key not set. Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` to enable the interactive map.
        </div>
      ) : null}
    </div>
  );
}
