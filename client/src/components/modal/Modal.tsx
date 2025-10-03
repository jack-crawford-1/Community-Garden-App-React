import { useNavigate } from "react-router";

type ModalProps = {
  confirmLatLng: { lat: number; lng: number } | null;
  setConfirmLatLng: React.Dispatch<
    React.SetStateAction<{ lat: number; lng: number } | null>
  >;
};

export default function Modal({ confirmLatLng, setConfirmLatLng }: ModalProps) {
  const navigate = useNavigate();

  if (!confirmLatLng) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out opacity-100" />

      <div className="relative z-10 bg-gray-900 p-6 rounded-lg shadow-xl max-w-md text-center transform transition-all duration-300 ease-out scale-100 opacity-100">
        <p className="mb-4 text-black dark:text-white">
          Do you want to add a garden at this location?
          <br />
          <strong>Latitude:</strong> {confirmLatLng.lat.toFixed(6)},{" "}
          <strong>Longitude:</strong> {confirmLatLng.lng.toFixed(6)}
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => {
              navigate(
                `/form?lat=${confirmLatLng.lat}&lng=${confirmLatLng.lng}`
              );
              setConfirmLatLng(null);
            }}
          >
            Yes
          </button>
          <button
            className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded hover:bg-gray-400"
            onClick={() => setConfirmLatLng(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
