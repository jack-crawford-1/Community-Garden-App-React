import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import Footer from "../components/footer/Footer";
import { submitSuggestion } from "../api/gardens";
import { usePageMeta } from "../lib/meta";

export default function SuggestPage() {
  usePageMeta(
    "Suggest a garden",
    "Know a community garden that's missing from GrowLocal, or spotted an out-of-date detail? Send a suggestion.",
  );

  const [params] = useSearchParams();
  const gardenId = params.get("gardenId") ?? undefined;
  const [kind, setKind] = useState<"new-garden" | "correction">(
    params.get("kind") === "correction" ? "correction" : "new-garden",
  );
  const [gardenName, setGardenName] = useState(params.get("name") ?? "");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    void send();
  };

  const send = async () => {
    setStatus("sending");
    setErrorMessage("");
    try {
      await submitSuggestion({
        kind,
        gardenId: kind === "correction" ? gardenId : undefined,
        gardenName: gardenName.trim(),
        address: address.trim() || undefined,
        message: message.trim(),
        submitterEmail: submitterEmail.trim() || undefined,
      });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "sent") {
    return (
      <>
        <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-leaf-50 px-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-100">
            <img src="/svg/leaf.svg" alt="" className="h-7 w-7" />
          </span>
          <h1 className="font-display text-3xl font-semibold text-moss-950">
            Suggestion received
          </h1>
          <p className="max-w-md text-sm leading-relaxed text-gray-600">
            Thanks for helping keep the directory accurate. We review every suggestion before
            updating a listing.
          </p>
          <Link
            to="/gardens"
            className="rounded-md bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600"
          >
            Back to the directory
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <div className="min-h-[70vh] bg-leaf-50">
        <div className="mx-auto max-w-2xl px-6 py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-leaf-600">
            Help the directory grow
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-moss-950 sm:text-4xl">
            Suggest a garden
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            Know a community garden that isn't listed, or spotted a detail that's out of date?
            Tell us below — no account needed. We review every suggestion by hand.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-moss-950">
                What are you suggesting?
              </legend>
              <div className="flex gap-2">
                <KindButton
                  active={kind === "new-garden"}
                  onClick={() => setKind("new-garden")}
                  label="A garden that's missing"
                />
                <KindButton
                  active={kind === "correction"}
                  onClick={() => setKind("correction")}
                  label="A correction to a listing"
                />
              </div>
            </fieldset>

            <Field label="Garden name" required>
              <input
                required
                maxLength={200}
                value={gardenName}
                onChange={(e) => setGardenName(e.target.value)}
                placeholder="e.g. Aro Valley Community Garden"
                className={inputClass}
              />
            </Field>

            <Field label="Address" hint="Optional, but helps us find it">
              <input
                maxLength={300}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, suburb, city"
                className={inputClass}
              />
            </Field>

            <Field
              label={kind === "correction" ? "What needs fixing?" : "Tell us about the garden"}
              required
            >
              <textarea
                required
                maxLength={2000}
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  kind === "correction"
                    ? "e.g. The contact email has changed to…"
                    : "Who runs it, how to get in touch, anything else useful…"
                }
                className={inputClass}
              />
            </Field>

            <Field label="Your email" hint="Optional — only used if we need to follow up">
              <input
                type="email"
                maxLength={200}
                value={submitterEmail}
                onChange={(e) => setSubmitterEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </Field>

            {status === "error" && (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                Couldn't send your suggestion: {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "sending"}
              className="rounded-md bg-leaf-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-leaf-600 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send suggestion"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3.5 py-2.5 text-sm outline-none placeholder:text-gray-400 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-500/30";

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline gap-2 text-sm font-semibold text-moss-950">
        {label}
        {required ? <span className="text-leaf-600">*</span> : null}
        {hint && <span className="text-xs font-normal text-gray-500">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function KindButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors ${
        active
          ? "border-leaf-600 bg-leaf-600 text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-leaf-500"
      }`}
    >
      {label}
    </button>
  );
}
