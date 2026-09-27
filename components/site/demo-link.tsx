"use client";

import Link from "next/link";
import type { NavLink } from "@/lib/site";
import { useBooking } from "./booking-provider";

// Ссылка на раздел сайта. Если раздела ещё нет в демо, показывает подсказку.
export function DemoLink({ link, className }: { link: NavLink; className?: string }) {
  const { showToast } = useBooking();
  return (
    <Link
      href={link.href}
      className={className}
      onClick={(e) => {
        if (!link.ready) {
          e.preventDefault();
          showToast("Этот раздел появится в полной версии сайта");
        }
      }}
    >
      {link.label}
    </Link>
  );
}
