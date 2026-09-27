import { siInstagram, siTelegram, siViber } from "simple-icons";

// Логотипы мессенджеров из Simple Icons (официальные пути брендов)
const icons = { viber: siViber, telegram: siTelegram, instagram: siInstagram };

export function BrandIcon({
  name,
  size = 18,
  className,
}: {
  name: keyof typeof icons;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d={icons[name].path} />
    </svg>
  );
}
