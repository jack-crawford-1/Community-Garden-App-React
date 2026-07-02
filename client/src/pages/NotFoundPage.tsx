import { Link } from "react-router";
import { usePageMeta } from "../lib/meta";

export default function NotFoundPage() {
  usePageMeta("Page not found");

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-moss-950 px-6 text-center text-white">
      <img src="/svg/leaf.svg" alt="" className="h-10 w-10 opacity-70" />
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="max-w-md text-sm text-white/60">
        That page doesn't exist. Try the map or the directory instead.
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="rounded-md bg-leaf-500 px-4 py-2 text-sm font-semibold text-white hover:bg-leaf-600"
        >
          Open the map
        </Link>
        <Link
          to="/gardens"
          className="rounded-md border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
        >
          Browse gardens
        </Link>
      </div>
    </div>
  );
}
