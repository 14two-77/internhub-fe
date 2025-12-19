import React, { useEffect, useRef, useState } from "react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type Props = {
  address: string;
  className?: string;
  zoom?: number;
};

/**
 * Load Google Maps JS API once
 */
function loadGoogleMapsScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("No window"));
  }

  if (window.google?.maps) {
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("google-maps-script");
    if (existing) {
      const check = () => {
        if (window.google?.maps) resolve();
        else setTimeout(check, 100);
      };
      check();
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
}

export const GoogleMap: React.FC<Props> = ({
  address,
  className,
  zoom = 15,
}) => {
  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className={className}>
        <div className="text-rose-600">
          Google Maps API key is not set.
        </div>
      </div>
    );
  }
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!address) {
      setError("No address provided");
      return;
    }

    let cancelled = false;

    loadGoogleMapsScript()
      .then(() => {
        if (cancelled || !containerRef.current) return;

        setLoaded(true);

        const geocoder = new google.maps.Geocoder();

        geocoder.geocode(
          { address },
          (
            results: google.maps.GeocoderResult[] | null,
            status: google.maps.GeocoderStatus
          ) => {
            if (cancelled) return;

            if (status === google.maps.GeocoderStatus.OK && results?.[0]) {
              const location = results[0].geometry.location;

              const map = new google.maps.Map(containerRef.current!, {
                center: location,
                zoom,
                disableDefaultUI: true,
              });

              new google.maps.Marker({
                position: location,
                map,
              });
            } else {
              console.warn("Geocode failed:", status);
              setError("Cannot show map for this address.");
            }
          }
        );
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load Google Maps");
      });

    return () => {
      cancelled = true;
    };
  }, [address, zoom]);

  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address
  )}`;

  return (
    <div className={className}>
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: 240,
          borderRadius: 12,
          overflow: "hidden",
        }}
      />

      {!loaded && !error && (
        <div className="mt-2 text-sm text-slate-500">Loading map…</div>
      )}

      {error && (
        <div className="mt-2 text-sm text-rose-600">
          {error} —{" "}
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Open in Google Maps
          </a>
        </div>
      )}

      {!error && (
        <div className="mt-2 text-sm text-slate-500">
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Open in Google Maps
          </a>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
