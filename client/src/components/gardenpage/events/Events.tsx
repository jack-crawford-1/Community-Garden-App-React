const ACCENT = "#55b47e";

function formatDate(date: string): { day: string; month: string; full: string } | null {
  if (!date) return null;
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return { day: "·", month: "TBC", full: date };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    month: d.toLocaleString("default", { month: "short" }).toUpperCase(),
    full: d.toLocaleDateString("default", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  };
}

export default function Events({
  events,
}: {
  events: { date: string; details: string }[];
}) {
  if (!events || events.length === 0) return null;

  return (
    <ul className="space-y-3">
      {events.map((ev, idx) => {
        const d = formatDate(ev.date);
        return (
          <li
            key={ev.date + ev.details + idx}
            className="flex items-stretch gap-4 rounded-xl bg-white/5 border border-white/10 overflow-hidden"
          >
            <div
              className="flex flex-col justify-center items-center px-5 py-4 min-w-[88px] shrink-0"
              style={{ backgroundColor: `${ACCENT}1a` }}
            >
              <span
                className="text-2xl font-bold leading-none"
                style={{ color: ACCENT }}
              >
                {d?.day ?? "·"}
              </span>
              <span
                className="text-[11px] uppercase tracking-[0.2em] mt-1"
                style={{ color: ACCENT }}
              >
                {d?.month ?? "TBC"}
              </span>
            </div>
            <div className="flex-1 py-4 pr-4 min-w-0">
              {d?.full && (
                <p className="text-xs uppercase tracking-[0.15em] text-white/40 mb-1">
                  {d.full}
                </p>
              )}
              <p className="text-green-50 leading-relaxed">{ev.details}</p>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
