"use client";

import { useBooking } from "@/components/site/booking-provider";
import type { LeadPreset } from "@/components/site/lead-form";

// Кнопка, открывающая заявку «Узнать свободную дату» (та же, что в v1, в оформлении v2)
export function BookButton({
  children,
  className = "btn-v2 btn-v2-wine",
  preset,
}: {
  children: React.ReactNode;
  className?: string;
  preset?: LeadPreset;
}) {
  const { openBooking } = useBooking();
  return (
    <button type="button" onClick={() => openBooking(preset)} className={className}>
      {children}
    </button>
  );
}
