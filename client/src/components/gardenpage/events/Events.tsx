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
    <ul className="max-w-2xl divide-y divide-white/10">
      {events.map((ev, idx) => {
        const d = formatDate(ev.date);
        return (
          <li
            key={ev.date + ev.details + idx}
            className="flex items-baseline gap-5 py-3"
          >
            <span
              className="w-28 shrink-0 text-sm font-semibold"
              style={{ color: ACCENT }}
            >
              {d ? `${d.day} ${d.month}` : "TBC"}
            </span>
            <span className="text-sm leading-relaxed text-green-50/90">
              {ev.details}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
