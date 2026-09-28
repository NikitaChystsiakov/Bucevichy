import { nav, type NavLink } from "@/lib/site";
import { Horseshoe } from "@/components/ui/motifs";

// Общее для шапки и футера v2 (серверный модуль: футер берёт отсюда данные, а не из client-файла)

export const V2_PATH = "/svadby-2";

// Пункты меню как в v1 (lib/site.ts), но «Свадьбы» ведут на эту версию страницы
function toV2(link: NavLink): NavLink {
  return link.href === "/svadby" ? { ...link, href: V2_PATH, ready: true } : link;
}

export const v2Links = nav.flatMap((item) =>
  item.children
    ? item.children.map((c) => ({ ...toV2(c), group: item.label }))
    : [{ ...toV2(item), group: "" }],
);

export function WordmarkV2({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2.5 leading-none ${className}`}>
      <Horseshoe size={20} className="shrink-0 text-terra" />
      <span className="flex flex-col">
        <span className="prata text-[1.35rem]">Буцевичи</span>
        {/* text-ink: на фактуре paper-2 под прозрачной шапкой ink-soft давал ~4:1 */}
        <span className="mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-ink">
          конная усадьба
        </span>
      </span>
    </span>
  );
}
