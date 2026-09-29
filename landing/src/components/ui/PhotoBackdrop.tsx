interface PhotoBackdropProps {
  src: string;
  mono?: boolean;
  position?: string;
}

/** Background photo that dissolves into the page color, so the text stays legible in both themes. */
export function PhotoBackdrop({ src, mono, position = "center" }: PhotoBackdropProps) {
  return (
    <div className="grain pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className={`absolute inset-0 bg-cover ${mono ? "grayscale" : ""}`}
        style={{ backgroundImage: `url(/${src})`, backgroundPosition: position, opacity: "var(--photo-opacity)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-page/30 via-page/60 to-page" />
    </div>
  );
}
