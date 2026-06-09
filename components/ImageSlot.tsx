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

  const wrapperStyle: React.CSSProperties = { ...extraStyle };

  if (shape === "rounded" && radius) {
    wrapperStyle.borderRadius = `${radius}px`;
    wrapperStyle.overflow = "hidden";
  }
  if (shape === "circle") {
    wrapperStyle.overflow = "hidden";
  }

  // Якщо className НЕ задано (наприклад всередині .bottle, .card-img),
  // wrapper повинен заповнити батьківський контейнер.
  // Якщо className задано (.master-av, .studio-img, .ba-layer) — там вже є розміри в CSS,
  // НЕ перебиваємо їх інлайн-стилями.
  if (!className && wrapperStyle.width === undefined) {
    wrapperStyle.width = "100%";
  }
  if (!className && wrapperStyle.height === undefined) {
    wrapperStyle.height = "100%";
  }

  if (src) {
    return (
      <div className={`${className} ${shapeClass}`} style={wrapperStyle}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || placeholder}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>
    );
  }

  return (
    <div className={`img-slot ${className} ${shapeClass}`} style={wrapperStyle}>
      <span className="img-slot-label">{placeholder}</span>
    </div>
  );
}
