import type { ReactNode } from "react";

type SlidingDrawerProps = {
  children: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
};

export default function SlidingDrawer({
  children,
  open,
  setOpen,
  width = 460,
  maxWidth = 480,
}: SlidingDrawerProps) {
  return (
    <>
      {/* Dimmed backdrop */}
      <div
        className={`fixed inset-0 z-[9990] bg-black/40 backdrop-blur-[1px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      <div
        className="fixed top-0 right-0 z-[9999] flex h-full max-w-[92vw] flex-col overflow-y-auto bg-neutral-900/97 p-6 text-white shadow-2xl transition-transform duration-300"
        style={{
          width,
          maxWidth,
          transform: open ? "translateX(0px)" : `translateX(${maxWidth + 40}px)`,
        }}
        role="dialog"
        aria-modal="true"
      >
        <button
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition-colors hover:bg-white/20"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="mt-6">{children}</div>
      </div>
    </>
  );
}
