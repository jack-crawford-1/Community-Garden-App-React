const ACCENT = "#55b47e";

export default function Rules({ rules }: { rules: string[] }) {
  if (!rules.length) return null;
  return (
    <ol className="space-y-3">
      {rules.map((rule, idx) => (
        <li
          key={idx}
          className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <span
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold text-gray-900"
            style={{ backgroundColor: ACCENT }}
          >
            {idx + 1}
          </span>
          <span className="text-green-50 leading-relaxed">{rule}</span>
        </li>
      ))}
    </ol>
  );
}
