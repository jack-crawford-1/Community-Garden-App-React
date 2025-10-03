export default function Events({
  events,
}: {
  events: { date: string; details: string }[];
}) {
  if (!events || events.length === 0) return null;

  return (
    <div className="mb-5 rounded-xl shadow-lg p-6 bg-gray-800 border-l-8 border-[#55b47e] font-mono">
      <h3 className="text-white text-lg uppercase mb-4 border-b border-yellow-500 pb-2">
        Upcoming Events
      </h3>
      <ul className="space-y-3">
        {events.map((ev, idx) => (
          <li
            key={ev.date + ev.details + idx}
            className="flex items-center space-x-4 bg-green-900/20 p-3 rounded-lg shadow-inner"
          >
            <span className="bg-[#55b47e] text-black px-2 py-1 rounded font-bold text-xs min-w-[100px] text-center shadow-md">
              {ev.date}
            </span>
            <span className="text-green-100 text-sm">{ev.details}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
