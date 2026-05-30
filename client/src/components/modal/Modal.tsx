import { Link, useNavigate } from "react-router";

type ModalProps = {
  confirmLatLng: { lat: number; lng: number } | null;
  setConfirmLatLng: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
};

export default function Modal({ confirmLatLng, setConfirmLatLng }: ModalProps) {
  const navigate = useNavigate();

  if (!confirmLatLng) return null;

  const isLoggedIn = !!localStorage.getItem("token");
  const close = () => setConfirmLatLng(null);

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={close}
      />

      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <span className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf5ee]">
          <img src="/svg/leaf.svg" alt="" className="h-6 w-6" />
        </span>

        <h2 className="text-lg font-bold text-gray-900">Add a garden here?</h2>
        <p className="mt-1 text-xs font-medium text-gray-500">
          {confirmLatLng.lat.toFixed(5)}, {confirmLatLng.lng.toFixed(5)}
        </p>

        {isLoggedIn ? (
          <>
            <p className="mt-3 text-sm text-gray-600">
              You&apos;ll add the name, photos and details on the next step.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={close}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  navigate(
                    `/form?lat=${confirmLatLng.lat}&lng=${confirmLatLng.lng}`
                  );
                  close();
                }}
                className="rounded-lg bg-[#55b47e] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Add garden
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-3 text-sm text-gray-600">
              Log in to add a garden to the map.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <button
                onClick={close}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <Link
                to="/login"
                className="rounded-lg bg-[#55b47e] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700"
              >
                Log in
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
