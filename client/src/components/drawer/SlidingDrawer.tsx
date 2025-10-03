// SlidingDrawer.tsx
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
  width = 600,
  maxWidth = 950,
}: SlidingDrawerProps) {
  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full bg-[#000000c9] text-white shadow-lg transition-transform duration-300 z-[9999] flex flex-col p-4 rounded-l-md overflow-y-auto`}
        style={{
          width,
          maxWidth,
          transform: open ? "translateX(0px)" : `translateX(${maxWidth}px)`,
        }}
      >
        <button
          className="absolute top-2 left-2 text-white text-2xl"
          onClick={() => {
            setOpen(false);
          }}
          aria-label="Close"
        >
          &times;
        </button>
        <div className="space-y-2">{children}</div>
      </div>
      {open && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
}
