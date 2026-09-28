"use client";

import Link from "next/link";
import { navTarget, type NavLink } from "@/lib/site";
import { useBooking } from "./booking-provider";

// Ссылка на раздел сайта. Раздела ещё нет в демо — ведёт на страницу старого сайта в новой вкладке;
// если и её нет — показывает подсказку.
export function DemoLink({
  link,
  className,
  children,
  onNavigate,
  current,
}: {
  link: NavLink;
  className?: string;
  children?: React.ReactNode;
  // Вызывается при переходе (например, закрыть меню)
  onNavigate?: () => void;
  // Текущая страница: aria-current="page"
  current?: boolean;
}) {
  const { showToast } = useBooking();
  const target = navTarget(link);
  const content = children ?? link.label;

  if (target.external) {
    return (
      <a href={target.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onNavigate}>
        {content}
      </a>
    );
  }

  return (
    <Link
      href={target.href}
      aria-current={current ? "page" : undefined}
      // Раздела ещё нет — не запрашиваем его заранее (иначе 404 в консоли)
      prefetch={link.ready ? undefined : false}
      className={className}
      onClick={(e) => {
        if (!link.ready) {
          e.preventDefault();
          showToast("Этот раздел появится в полной версии сайта");
          return;
        }
        onNavigate?.();
      }}
    >
      {content}
    </Link>
  );
}
