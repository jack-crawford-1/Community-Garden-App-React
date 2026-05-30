const ACCENT = "#55b47e";

export default function Rules({ rules }: { rules: string[] }) {
  if (!rules.length) return null;
  return (
    <ol className="max-w-2xl space-y-3">
      {rules.map((rule, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <span className="shrink-0 text-sm font-semibold" style={{ color: ACCENT }}>
            {idx + 1}.
          </span>
          <span className="text-sm leading-relaxed text-green-50/90">{rule}</span>
        </li>
      ))}
    </ol>
  );
}
