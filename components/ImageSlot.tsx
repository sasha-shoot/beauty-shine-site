type Props = {
  placeholder?: string;
  shape?: "rect" | "rounded" | "circle";
  radius?: number;
  className?: string;
  src?: string;
  alt?: string;
};

export function ImageSlot({
  placeholder = "Фото",
  shape = "rect",
  radius,
  className = "",
  src,
  alt,
}: Props) {
  const shapeClass =
    shape === "circle" ? "img-slot-circle" :
    shape === "rounded" ? "img-slot-rounded" : "";

  const style: React.CSSProperties = {};
  if (shape === "rounded" && radius) {
    style.borderRadius = `${radius}px`;
  }

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || placeholder}
        className={`${className} ${shapeClass}`}
        style={{ ...style, objectFit: "cover", width: "100%", height: "100%" }}
      />
    );
  }

  return (
    <div className={`img-slot ${className} ${shapeClass}`} style={style}>
      <span className="img-slot-label">{placeholder}</span>
    </div>
  );
}
