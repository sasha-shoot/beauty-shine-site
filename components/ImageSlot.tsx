type Props = {
  placeholder?: string;
  shape?: "rect" | "rounded" | "circle";
  radius?: number;
  className?: string;
  src?: string;
  alt?: string;
  style?: React.CSSProperties;
};

export function ImageSlot({
  placeholder = "Фото",
  shape = "rect",
  radius,
  className = "",
  src,
  alt,
  style: extraStyle,
}: Props) {
  const shapeClass =
    shape === "circle" ? "img-slot-circle" :
    shape === "rounded" ? "img-slot-rounded" : "";

  const baseStyle: React.CSSProperties = {};
  if (shape === "rounded" && radius) {
    baseStyle.borderRadius = `${radius}px`;
  }
  const finalStyle = { ...baseStyle, ...extraStyle };

  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt || placeholder}
        className={`${className} ${shapeClass}`}
        style={{ ...finalStyle, objectFit: "cover", width: "100%", height: "100%" }}
      />
    );
  }

  return (
    <div className={`img-slot ${className} ${shapeClass}`} style={finalStyle}>
      <span className="img-slot-label">{placeholder}</span>
    </div>
  );
}
