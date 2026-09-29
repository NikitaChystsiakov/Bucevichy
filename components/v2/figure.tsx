// Цифра крупно (Prata) + подпись мелким капсом. Цвета и размеры — классами снаружи.
export function Figure({
  prefix,
  value,
  unit,
  label,
  valueClass,
  labelClass,
  className = "",
}: {
  prefix?: string;
  value: string;
  unit?: string;
  label: string;
  valueClass: string;
  labelClass: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className={`prata flex items-baseline leading-[0.85] ${valueClass}`}>
        {prefix && <span className="mr-2 text-[0.3em]">{prefix}</span>}
        <span>{value}</span>
        {unit && <span className="ml-1.5 text-[0.36em]">{unit}</span>}
      </p>
      <p
        className={`mt-3 text-[0.64rem] font-semibold uppercase tracking-[0.12em] md:text-[0.7rem] md:tracking-[0.18em] ${labelClass}`}
      >
        {label}
      </p>
    </div>
  );
}
