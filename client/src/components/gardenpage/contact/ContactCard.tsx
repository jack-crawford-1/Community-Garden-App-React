import type { Garden } from "../../../types/GardenInterface";

const ACCENT = "#55b47e";

function ContactRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <span className="text-xs uppercase tracking-[0.2em] w-24 shrink-0 mt-0.5 text-white/50">
        {label}
      </span>
      <span className="text-sm text-green-50 break-all min-w-0">{children}</span>
    </div>
  );
}

export default function ContactCard({ garden }: { garden: Garden }) {
  const c = garden.contact ?? {};
  const hasAnyContact =
    !!c.email || !!c.phone || !!c.website || !!c.social?.facebook;

  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
      {/* Coordinator header */}
      <div className="flex items-center gap-5 p-6 border-b border-white/10">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-gray-900 shrink-0"
          style={{ backgroundColor: ACCENT }}
        >
          {garden.coordinator?.charAt(0)?.toUpperCase() ?? "·"}
        </div>
        <div className="min-w-0">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-1"
            style={{ color: ACCENT }}
          >
            Garden coordinator
          </p>
          <h3 className="text-xl text-white font-semibold truncate">
            {garden.coordinator ?? "Coordinator not listed"}
          </h3>
        </div>
      </div>

      {/* Contact rows */}
      {hasAnyContact && (
        <div className="px-6 py-2">
          {c.email && (
            <ContactRow label="Email">
              <a
                href={`mailto:${c.email}`}
                className="hover:underline"
                style={{ color: ACCENT }}
              >
                {c.email}
              </a>
            </ContactRow>
          )}
          {c.phone && (
            <ContactRow label="Phone">
              <a
                href={`tel:${c.phone.replace(/\s+/g, "")}`}
                className="hover:underline text-white"
              >
                {c.phone}
              </a>
            </ContactRow>
          )}
          {c.website && (
            <ContactRow label="Website">
              <a
                href={c.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: ACCENT }}
              >
                {c.website.replace(/^https?:\/\//, "")}
              </a>
            </ContactRow>
          )}
          {c.social?.facebook && (
            <ContactRow label="Facebook">
              <a
                href={c.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: ACCENT }}
              >
                {c.social.facebook.replace(/^https?:\/\//, "")}
              </a>
            </ContactRow>
          )}
        </div>
      )}
    </div>
  );
}
