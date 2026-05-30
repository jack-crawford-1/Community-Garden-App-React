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
    <div className="flex items-start gap-4 py-3 border-b border-white/10 last:border-0">
      <span className="text-xs uppercase tracking-[0.2em] w-24 shrink-0 mt-0.5 text-white/40">
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
    <div className="max-w-2xl">
      {garden.coordinator && (
        <div className="mb-2">
          <p
            className="text-xs uppercase tracking-[0.2em] mb-1"
            style={{ color: ACCENT }}
          >
            Coordinator
          </p>
          <p className="text-lg font-semibold text-white">
            {garden.coordinator}
          </p>
        </div>
      )}

      {/* Contact rows */}
      {hasAnyContact && (
        <div>
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
