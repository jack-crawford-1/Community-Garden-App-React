import { useEffect, useState } from "react";
import type { Garden } from "../../types/GardenInterface";
import Navbar from "../nav/Navbar";
import { useSearchParams } from "react-router";

const initialGarden: Garden = {
  lastUpdated: new Date(),
  description: "",
  address: "",
  coordinator: "",
  lat: 0,
  lon: 0,
  openingHours: {
    Monday: ["", ""],
    Tuesday: ["", ""],
    Wednesday: ["", ""],
    Thursday: ["", ""],
    Friday: ["", ""],
    Saturday: ["", ""],
    Sunday: ["", ""],
    Holidays: ["", ""],
  },
  established: "",
  volunteersWelcome: false,
  facilities: [],
  events: [],
  accessibility: [],
  environment: {
    gardenSizeSqm: 0,
    numberOfBeds: 0,
    produceType: [],
    waterConservation: [],
    soilType: [],
    pollinatorSupport: [],
    fertiliserUse: [],
    seasonalPlantingCalendar: {
      Summer: "",
      Autumn: "",
      Winter: "",
      Spring: "",
    },
    organicCertification: "",
    waterSource: [],

    irrigationSystem: "",
    compostingFacilities: [],
    mulchingPractices: [],
  },
  contact: {
    email: "",
    phone: "",
    website: "",
    social: {
      facebook: "",
      other: "",
      other2: "",
    },
  },
  photos: [],
  rules: [],
  partnerships: [],
  wasteManagement: [],
  id: 0,
  membershipRequired: false,
  insurance: "",
  phone: "",
};

const predefinedFacilities = [
  "Toilets",
  "BBQ area",
  "Children’s play area",
  "Greenhouse",
  "Bike racks",
  "Kitchen",
  "Meeting room",
];

export default function Form() {
  const [garden, setGarden] = useState(initialGarden);
  const [status, setStatus] = useState<string | null>(null);
  const [customFacility, setCustomFacility] = useState("");
  const [newRule, setNewRule] = useState("");
  const [newEvent, setNewEvent] = useState({ date: "", details: "" });
  const [customAccessibility, setCustomAccessibility] = useState("");
  const [customProduceType, setCustomProduceType] = useState("");
  const [customPollinatorSupport, setCustomPollinatorSupport] = useState("");
  const [customWaterConservation, setCustomWaterConservation] = useState("");
  const [customFertiliserUse, setCustomFertiliserUse] = useState("");
  const [customSoilType, setCustomSoilType] = useState("");
  const [customWasteManagement, setCustomWasteManagement] = useState("");
  const [newPartnership, setNewPartnership] = useState("");
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (lat && lng) {
      setGarden((prev) => ({
        ...prev,
        lat: parseFloat(lat),
        lon: parseFloat(lng),
      }));
    }
  }, [searchParams]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;

    const parsed =
      type === "checkbox" ? checked : type === "number" ? Number(value) : value;

    setGarden((prev) => ({
      ...prev,
      [name]: parsed,
    }));
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus(null);

    const gardenToSend = {
      ...garden,
      lastUpdated: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3000/gardens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(gardenToSend),
      });

      if (res.ok) {
        setStatus("Garden submitted successfully!");
        setGarden(initialGarden);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const err = await res.json();
        setStatus("Error: " + (err.message || res.statusText));
      }
    } catch (err: any) {
      setStatus("Error: " + err.message);
    }
  }

  return (
    <div className="bg-[#55b47e]">
      <Navbar />
      <div className="bg-black z-100 w-full opacity-55">
        <form
          className="max-w-2xl mx-auto p-6 bg-black rounded-xl text-gray-100 space-y-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-4">Add Garden Form</h2>
          {status && (
            <div
              className={`p-2 rounded ${
                status.startsWith("Error") ? "bg-red-700" : "bg-green-700"
              }`}
            >
              {status}
            </div>
          )}

          <fieldset className="block border p-2 rounded mb-2">
            <label className="block">
              Garden Name/Description
              <textarea
                name="description"
                value={garden.description}
                onChange={handleChange}
                placeholder='e.g. "Community Garden at Central Park"'
                rows={3}
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Address
              <input
                name="address"
                value={garden.address}
                onChange={handleChange}
                placeholder="123 Main St, Springfield"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Latitude
              <input
                type="number"
                name="lat"
                value={garden.lat}
                onChange={handleChange}
                placeholder="to auto populate"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Longitude
              <input
                type="number"
                name="lon"
                value={garden.lon}
                onChange={handleChange}
                placeholder="to auto populate"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Established
              <input
                type="date"
                name="established"
                value={garden.established}
                onChange={handleChange}
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>

            <label className="font-semibold">Partnerships</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newPartnership}
                onChange={(e) => {
                  setNewPartnership(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newPartnership.trim()) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      partnerships: [
                        ...prev.partnerships,
                        newPartnership.trim(),
                      ],
                    }));
                    setNewPartnership("");
                  }
                }}
                placeholder="eg local council, local school"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (newPartnership.trim()) {
                    setGarden((prev) => ({
                      ...prev,
                      partnerships: [
                        ...prev.partnerships,
                        newPartnership.trim(),
                      ],
                    }));
                    setNewPartnership("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {garden.partnerships.map((partner, idx) => (
              <div key={idx} className="flex items-center mb-2 space-x-2">
                <input
                  type="text"
                  value={partner}
                  onChange={(e) => {
                    const updated = [...garden.partnerships];
                    updated[idx] = e.target.value;
                    setGarden((prev) => ({ ...prev, partnerships: updated }));
                  }}
                  placeholder={`Partnership ${idx + 1}`}
                  className="flex-1 p-2 rounded bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    setGarden((prev) => ({
                      ...prev,
                      partnerships: prev.partnerships.filter(
                        (_, i) => i !== idx
                      ),
                    }));
                  }}
                  className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                  aria-label="Remove partnership"
                >
                  &times;
                </button>
              </div>
            ))}
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Contact</legend>
            <label className="block">
              Coordinator Name
              <input
                name="coordinator"
                value={garden.coordinator}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Email
              <input
                name="email"
                value={garden.contact.email}
                onChange={(e) => {
                  setGarden((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      email: e.target.value,
                    },
                  }));
                }}
                placeholder='e.g. "johndoe@example.com"'
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Phone
              <input
                name="phone"
                value={garden.contact.phone}
                onChange={(e) => {
                  setGarden((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      phone: e.target.value,
                    },
                  }));
                }}
                placeholder='e.g. "+64 21 123 4567"'
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Website URL
              <input
                name="website"
                value={garden.contact.website}
                onChange={(e) => {
                  setGarden((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      website: e.target.value,
                    },
                  }));
                }}
                placeholder='e.g. "https://example.com"'
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Facebook URL
              <input
                name="facebook"
                value={garden.contact.social.facebook}
                onChange={(e) => {
                  setGarden((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      social: {
                        ...prev.contact.social,
                        facebook: e.target.value,
                      },
                    },
                  }));
                }}
                placeholder='e.g. "https://facebook.com/example"'
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Other URL
              <input
                name="other"
                value={garden.contact.social.other}
                onChange={(e) => {
                  setGarden((prev) => ({
                    ...prev,
                    contact: {
                      ...prev.contact,
                      social: {
                        ...prev.contact.social,
                        instagram: e.target.value,
                      },
                    },
                  }));
                }}
                placeholder='e.g. "https://thirdparty.com/example"'
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
          </fieldset>
          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Details</legend>
            <label className="block">
              Membership Required
              <input
                type="checkbox"
                name="membershipRequired"
                checked={garden.membershipRequired}
                onChange={handleChange}
                className="ml-2"
              />
            </label>

            <label className="block">
              Volunteers Welcome
              <input
                type="checkbox"
                name="volunteersWelcome"
                checked={garden.volunteersWelcome}
                onChange={handleChange}
                className="ml-2"
              />
            </label>
            <label className="block">
              Organic Certification
              <input
                type="checkbox"
                name="organicCertification"
                value={garden.environment.organicCertification}
                onChange={handleChange}
                className="ml-2"
              />
            </label>
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Opening Hours</legend>

            {Object.entries(garden.openingHours).map(([day, hours]) => (
              <div key={day} className="flex items-center mb-2">
                <label className="w-24">{day}</label>
                <input
                  type="time"
                  value={hours[0]}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      openingHours: {
                        ...prev.openingHours,
                        [day]: [e.target.value, prev.openingHours[day][1]],
                      },
                    }));
                  }}
                  className="ml-2 p-1 rounded bg-gray-800"
                />
                <span className="mx-2">to</span>
                <input
                  type="time"
                  value={hours[1]}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      openingHours: {
                        ...prev.openingHours,
                        [day]: [prev.openingHours[day][0], e.target.value],
                      },
                    }));
                  }}
                  className="p-1 rounded bg-gray-800"
                />
              </div>
            ))}

            <button
              type="button"
              className="mt-2 px-3 py-1 bg-green-700 rounded text-white hover:bg-green-800"
              onClick={() => {
                setGarden((prev) => {
                  const mondayHours = prev.openingHours.Monday;
                  const updated = Object.fromEntries(
                    Object.keys(prev.openingHours).map((day) => [
                      day,
                      mondayHours,
                    ])
                  );
                  return {
                    ...prev,
                    openingHours: updated,
                  };
                });
              }}
            >
              Copy Monday’s Hours to All
            </button>
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <label className="block">
              Garden Size (sqm)
              <input
                type="number"
                name="gardenSizeSqm"
                value={garden.environment.gardenSizeSqm}
                onChange={(e) => {
                  setGarden((prev) => ({
                    ...prev,
                    environment: {
                      ...prev.environment,
                      gardenSizeSqm: Number(e.target.value),
                    },
                  }));
                }}
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
            <label className="block">
              Number of Beds
              <input
                type="number"
                name="numberOfBeds"
                value={garden.environment.numberOfBeds}
                onChange={(e) => {
                  setGarden((prev) => ({
                    ...prev,
                    environment: {
                      ...prev.environment,
                      numberOfBeds: Number(e.target.value),
                    },
                  }));
                }}
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
            </label>
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Facilities</legend>
            <div className="flex mb-2">
              <input
                type="text"
                value={customFacility}
                onChange={(e) => {
                  setCustomFacility(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customFacility.trim()) {
                    e.preventDefault();
                    if (
                      !garden.facilities.includes(customFacility.trim()) &&
                      customFacility.trim().length > 0
                    ) {
                      setGarden((prev) => ({
                        ...prev,
                        facilities: [...prev.facilities, customFacility.trim()],
                      }));
                      setCustomFacility("");
                    }
                  }
                }}
                placeholder="Add custom facility"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (
                    customFacility.trim() &&
                    !garden.facilities.includes(customFacility.trim())
                  ) {
                    setGarden((prev) => ({
                      ...prev,
                      facilities: [...prev.facilities, customFacility.trim()],
                    }));
                    setCustomFacility("");
                  }
                }}
              >
                Add
              </button>
            </div>
            <div className="mb-1 text-sm text-gray-400">
              Or select from the options below:
            </div>
            {predefinedFacilities.map((facility) => (
              <label key={facility} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={garden.facilities.includes(facility)}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      facilities: e.target.checked
                        ? [...prev.facilities, facility]
                        : prev.facilities.filter((f) => f !== facility),
                    }));
                  }}
                  className="mr-2"
                />
                {facility}
              </label>
            ))}

            {garden.facilities
              .filter((f) => !predefinedFacilities.includes(f))
              .map((custom, idx) => (
                <div key={custom} className="flex items-center mt-1">
                  <span className="flex-1">{custom}</span>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                    onClick={() => {
                      setGarden((prev) => ({
                        ...prev,
                        facilities: prev.facilities.filter((f) => f !== custom),
                      }));
                    }}
                    aria-label="Remove custom facility"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Rules List</legend>
            <div className="flex mb-2">
              <input
                type="text"
                value={newRule}
                onChange={(e) => {
                  setNewRule(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && newRule.trim()) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      rules: [...prev.rules, newRule.trim()],
                    }));
                    setNewRule("");
                  }
                }}
                placeholder="Add new rule"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (newRule.trim()) {
                    setGarden((prev) => ({
                      ...prev,
                      rules: [...prev.rules, newRule.trim()],
                    }));
                    setNewRule("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {garden.rules.map((rule, idx) => (
              <div key={idx} className="flex items-center mb-2 space-x-2">
                <input
                  type="text"
                  value={rule}
                  onChange={(e) => {
                    const updated = [...garden.rules];
                    updated[idx] = e.target.value;
                    setGarden((prev) => ({ ...prev, rules: updated }));
                  }}
                  placeholder={`Rule ${idx + 1}`}
                  className="flex-1 p-2 rounded bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    setGarden((prev) => ({
                      ...prev,
                      rules: prev.rules.filter((_, i) => i !== idx),
                    }));
                  }}
                  className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                  aria-label="Remove rule"
                >
                  &times;
                </button>
              </div>
            ))}
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Regular Events</legend>
            <div className="flex items-center mb-2 space-x-2">
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) => {
                  setNewEvent((ev) => ({ ...ev, date: e.target.value }));
                }}
                className="p-2 rounded bg-gray-800"
              />
              <input
                type="text"
                value={newEvent.details}
                onChange={(e) => {
                  setNewEvent((ev) => ({ ...ev, details: e.target.value }));
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    (newEvent.date || newEvent.details)
                  ) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      events: [...prev.events, { ...newEvent }],
                    }));
                    setNewEvent({ date: "", details: "" });
                  }
                }}
                placeholder="Event details"
                className="flex-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (newEvent.date || newEvent.details) {
                    setGarden((prev) => ({
                      ...prev,
                      events: [...prev.events, { ...newEvent }],
                    }));
                    setNewEvent({ date: "", details: "" });
                  }
                }}
              >
                Add
              </button>
            </div>
            {garden.events.map((event, idx) => (
              <div key={idx} className="flex items-center mb-2 space-x-2">
                <input
                  type="date"
                  value={event?.date || ""}
                  onChange={(e) => {
                    setGarden((prev) => {
                      const updated = prev.events.map((ev, i) =>
                        i === idx
                          ? {
                              ...(typeof ev === "object" && ev !== null
                                ? ev
                                : { date: "", details: "" }),
                              date: e.target.value,
                            }
                          : ev
                      );
                      return { ...prev, events: updated };
                    });
                  }}
                  className="p-2 rounded bg-gray-800"
                />
                <input
                  type="text"
                  value={event?.details || ""}
                  onChange={(e) => {
                    setGarden((prev) => {
                      const updated = prev.events.map((ev, i) =>
                        i === idx
                          ? {
                              ...(typeof ev === "object" && ev !== null
                                ? ev
                                : { date: "", details: "" }),
                              details: e.target.value,
                            }
                          : ev
                      );
                      return { ...prev, events: updated };
                    });
                  }}
                  placeholder="Event details"
                  className="flex-1 p-2 rounded bg-gray-800"
                />
                <button
                  type="button"
                  onClick={() => {
                    setGarden((prev) => ({
                      ...prev,
                      events: prev.events.filter((_, i) => i !== idx),
                    }));
                  }}
                  className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                  aria-label="Remove event"
                >
                  &times;
                </button>
              </div>
            ))}
          </fieldset>
          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Accessibility</legend>
            <div className="flex mb-2">
              <input
                type="text"
                value={customAccessibility}
                onChange={(e) => {
                  setCustomAccessibility(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    customAccessibility.trim() &&
                    !garden.accessibility.includes(customAccessibility.trim())
                  ) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      accessibility: [
                        ...prev.accessibility,
                        customAccessibility.trim(),
                      ],
                    }));
                    setCustomAccessibility("");
                  }
                }}
                placeholder="Add custom accessibility option"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (
                    customAccessibility.trim() &&
                    !garden.accessibility.includes(customAccessibility.trim())
                  ) {
                    setGarden((prev) => ({
                      ...prev,
                      accessibility: [
                        ...prev.accessibility,
                        customAccessibility.trim(),
                      ],
                    }));
                    setCustomAccessibility("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {[
              "Wheelchair accessible",
              "Accessible paths",
              "Accessible restrooms",
              "Accessible parking",
            ].map((option) => (
              <label key={option} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={garden.accessibility.includes(option)}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      accessibility: e.target.checked
                        ? [...prev.accessibility, option]
                        : prev.accessibility.filter((a) => a !== option),
                    }));
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
            {/* List custom accessibility options with remove button */}
            {garden.accessibility
              .filter(
                (a) =>
                  ![
                    "Wheelchair accessible",
                    "Accessible paths",
                    "Accessible restrooms",
                    "Accessible parking",
                    "Braille signage",
                    "Sensory garden area",
                    "Seating at regular intervals",
                    "Audio garden guides",
                    "Visual aids for plant identification",
                    "Large print signage",
                    "Tactile maps of the garden",
                  ].includes(a)
              )
              .map((custom, idx) => (
                <div key={custom} className="flex items-center mt-1">
                  <span className="flex-1">{custom}</span>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                    onClick={() => {
                      setGarden((prev) => ({
                        ...prev,
                        accessibility: prev.accessibility.filter(
                          (a) => a !== custom
                        ),
                      }));
                    }}
                    aria-label="Remove custom accessibility"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Produce Type</legend>
            <div className="flex mb-2">
              <input
                type="text"
                value={customProduceType}
                onChange={(e) => {
                  setCustomProduceType(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    customProduceType.trim() &&
                    !garden.environment.produceType.includes(
                      customProduceType.trim()
                    )
                  ) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        produceType: [
                          ...prev.environment.produceType,
                          customProduceType.trim(),
                        ],
                      },
                    }));
                    setCustomProduceType("");
                  }
                }}
                placeholder="Add custom produce type"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (
                    customProduceType.trim() &&
                    !garden.environment.produceType.includes(
                      customProduceType.trim()
                    )
                  ) {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        produceType: [
                          ...prev.environment.produceType,
                          customProduceType.trim(),
                        ],
                      },
                    }));
                    setCustomProduceType("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {[
              "Vegetables",
              "Herbs",
              "Native Plants",
              "Flowers",
              "Fruit Trees",
            ].map((type) => (
              <label key={type} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={garden.environment.produceType.includes(type)}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        produceType: e.target.checked
                          ? [...prev.environment.produceType, type]
                          : prev.environment.produceType.filter(
                              (t) => t !== type
                            ),
                      },
                    }));
                  }}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
            {/* List custom produce types with remove button */}
            {garden.environment.produceType
              .filter(
                (t) =>
                  ![
                    "Vegetables",
                    "Herbs",
                    "Native Plants",
                    "Flowers",
                    "Fruit Trees",
                    "Seedlings",
                    "Compost",
                    "Soil",
                    "Mulch",
                    "Fertiliser",
                    "Medicinal plants",
                    "Pollinator plants",
                  ].includes(t)
              )
              .map((custom, idx) => (
                <div key={custom} className="flex items-center mt-1">
                  <span className="flex-1">{custom}</span>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                    onClick={() => {
                      setGarden((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          produceType: prev.environment.produceType.filter(
                            (t) => t !== custom
                          ),
                        },
                      }));
                    }}
                    aria-label="Remove custom produce type"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </fieldset>
          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Water Conservation</legend>
            <div className="flex mb-2">
              <input
                type="text"
                value={customWaterConservation}
                onChange={(e) => {
                  setCustomWaterConservation(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    customWaterConservation.trim() &&
                    !garden.environment.waterConservation.includes(
                      customWaterConservation.trim()
                    )
                  ) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        waterConservation: [
                          ...prev.environment.waterConservation,
                          customWaterConservation.trim(),
                        ],
                      },
                    }));
                    setCustomWaterConservation("");
                  }
                }}
                placeholder="Add custom water conservation option"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (
                    customWaterConservation.trim() &&
                    !garden.environment.waterConservation.includes(
                      customWaterConservation.trim()
                    )
                  ) {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        waterConservation: [
                          ...prev.environment.waterConservation,
                          customWaterConservation.trim(),
                        ],
                      },
                    }));
                    setCustomWaterConservation("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {[
              "Rainwater harvesting",
              "Drought-tolerant plants",
              "Mulching",
              "Drip irrigation",
              "Greywater reuse",
            ].map((option) => (
              <label key={option} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={garden.environment.waterConservation.includes(
                    option
                  )}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        waterConservation: e.target.checked
                          ? [...prev.environment.waterConservation, option]
                          : prev.environment.waterConservation.filter(
                              (v) => v !== option
                            ),
                      },
                    }));
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Soil Type</legend>
            <div className="flex mb-2">
              <input
                type="text"
                value={customSoilType}
                onChange={(e) => {
                  setCustomSoilType(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    customSoilType.trim() &&
                    !garden.environment.soilType.includes(customSoilType.trim())
                  ) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        soilType: [
                          ...prev.environment.soilType,
                          customSoilType.trim(),
                        ],
                      },
                    }));
                    setCustomSoilType("");
                  }
                }}
                placeholder="Add custom soil type"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (
                    customSoilType.trim() &&
                    !garden.environment.soilType.includes(customSoilType.trim())
                  ) {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        soilType: [
                          ...prev.environment.soilType,
                          customSoilType.trim(),
                        ],
                      },
                    }));
                    setCustomSoilType("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {[
              "Sandy",
              "Clay",
              "Loamy",
              "Silty",
              "Peaty",
              "Chalky",
              "Saline",
            ].map((type) => (
              <label key={type} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={garden.environment.soilType.includes(type)}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        soilType: e.target.checked
                          ? [...prev.environment.soilType, type]
                          : prev.environment.soilType.filter((t) => t !== type),
                      },
                    }));
                  }}
                  className="mr-2"
                />
                {type}
              </label>
            ))}
            {/* List custom soil types with remove button */}
            {garden.environment.soilType
              .filter(
                (t) =>
                  ![
                    "Sandy",
                    "Clay",
                    "Loamy",
                    "Silty",
                    "Peaty",
                    "Chalky",
                    "Saline",
                  ].includes(t)
              )
              .map((custom, idx) => (
                <div key={custom} className="flex items-center mt-1">
                  <span className="flex-1">{custom}</span>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                    onClick={() => {
                      setGarden((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          soilType: prev.environment.soilType.filter(
                            (t) => t !== custom
                          ),
                        },
                      }));
                    }}
                    aria-label="Remove custom soil type"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Pollinator and Wildlife</legend>
            <div className="flex mb-2">
              <input
                type="text"
                value={customPollinatorSupport}
                onChange={(e) => {
                  setCustomPollinatorSupport(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    customPollinatorSupport.trim() &&
                    !garden.environment.pollinatorSupport.includes(
                      customPollinatorSupport.trim()
                    )
                  ) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        pollinatorSupport: [
                          ...prev.environment.pollinatorSupport,
                          customPollinatorSupport.trim(),
                        ],
                      },
                    }));
                    setCustomPollinatorSupport("");
                  }
                }}
                placeholder="Add custom pollinator support and wildlife habitat"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (
                    customPollinatorSupport.trim() &&
                    !garden.environment.pollinatorSupport.includes(
                      customPollinatorSupport.trim()
                    )
                  ) {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        pollinatorSupport: [
                          ...prev.environment.pollinatorSupport,
                          customPollinatorSupport.trim(),
                        ],
                      },
                    }));
                    setCustomPollinatorSupport("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {[
              "Butterfly bushes",
              "Lavender",
              "Bee hives",
              "Birdhouses",
              "Native plantings",
              "Frog pond",
              "Log piles for lizards",
            ].map((option) => (
              <label key={option} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={garden.environment.pollinatorSupport.includes(
                    option
                  )}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        pollinatorSupport: e.target.checked
                          ? [...prev.environment.pollinatorSupport, option]
                          : prev.environment.pollinatorSupport.filter(
                              (v) => v !== option
                            ),
                      },
                    }));
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}

            {garden.environment.pollinatorSupport
              .filter(
                (v) =>
                  ![
                    "Butterfly bushes",
                    "Lavender",
                    "Bee hives",
                    "Birdhouses",
                    "Native plantings",
                    "Frog pond",
                    "Log piles for lizards",
                  ].includes(v)
              )
              .map((custom, idx) => (
                <div key={custom} className="flex items-center mt-1">
                  <span className="flex-1">{custom}</span>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                    onClick={() => {
                      setGarden((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          pollinatorSupport:
                            prev.environment.pollinatorSupport.filter(
                              (v) => v !== custom
                            ),
                        },
                      }));
                    }}
                    aria-label="Remove custom pollinator support"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Waste Management</legend>
            <div className="flex mb-2">
              <input
                type="text"
                value={customWasteManagement}
                onChange={(e) => {
                  setCustomWasteManagement(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    customWasteManagement.trim() &&
                    !garden.wasteManagement.includes(
                      customWasteManagement.trim()
                    )
                  ) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      wasteManagement: [
                        ...prev.wasteManagement,
                        customWasteManagement.trim(),
                      ],
                    }));
                    setCustomWasteManagement("");
                  }
                }}
                placeholder="Add custom waste management method"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (
                    customWasteManagement.trim() &&
                    !garden.wasteManagement.includes(
                      customWasteManagement.trim()
                    )
                  ) {
                    setGarden((prev) => ({
                      ...prev,
                      wasteManagement: [
                        ...prev.wasteManagement,
                        customWasteManagement.trim(),
                      ],
                    }));
                    setCustomWasteManagement("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {[
              "General Rubbish",
              "Recycling",
              "Green waste",
              "On-site composting",
              "Hazardous waste disposal",
              "Council green bin",
              "Mulching of prunings",
              "Community green waste drop-off",
            ].map((option) => (
              <label key={option} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={garden.wasteManagement.includes(option)}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      wasteManagement: e.target.checked
                        ? [...prev.wasteManagement, option]
                        : prev.wasteManagement.filter((v) => v !== option),
                    }));
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}

            {garden.wasteManagement
              .filter(
                (v) =>
                  ![
                    "General waste bin",
                    "Recycling bin",
                    "Green waste bin",
                    "On-site composting",
                    "E-waste collection",
                    "Hazardous waste disposal",
                    "Council green bin",
                    "Mulching of prunings",
                    "Community green waste drop-off",
                  ].includes(v)
              )
              .map((custom, idx) => (
                <div key={custom} className="flex items-center mt-1">
                  <span className="flex-1">{custom}</span>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                    onClick={() => {
                      setGarden((prev) => ({
                        ...prev,
                        wasteManagement: prev.wasteManagement.filter(
                          (v) => v !== custom
                        ),
                      }));
                    }}
                    aria-label="Remove custom waste management"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">Fertiliser Use</legend>
            <div className="flex mb-2">
              <input
                type="text"
                value={customFertiliserUse}
                onChange={(e) => {
                  setCustomFertiliserUse(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    customFertiliserUse.trim() &&
                    !garden.environment.fertiliserUse.includes(
                      customFertiliserUse.trim()
                    )
                  ) {
                    e.preventDefault();
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        fertiliserUse: [
                          ...prev.environment.fertiliserUse,
                          customFertiliserUse.trim(),
                        ],
                      },
                    }));
                    setCustomFertiliserUse("");
                  }
                }}
                placeholder="Add custom fertiliser use"
                className="w-full mt-1 p-2 rounded bg-gray-800"
              />
              <button
                type="button"
                className="ml-2 px-3 py-1 bg-green-900 rounded text-white"
                onClick={() => {
                  if (
                    customFertiliserUse.trim() &&
                    !garden.environment.fertiliserUse.includes(
                      customFertiliserUse.trim()
                    )
                  ) {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        fertiliserUse: [
                          ...prev.environment.fertiliserUse,
                          customFertiliserUse.trim(),
                        ],
                      },
                    }));
                    setCustomFertiliserUse("");
                  }
                }}
              >
                Add
              </button>
            </div>
            {[
              "Organic compost",
              "No synthetic fertilisers",
              "Seaweed solution",
              "Worm castings",
            ].map((option) => (
              <label key={option} className="flex items-center mb-1">
                <input
                  type="checkbox"
                  checked={garden.environment.fertiliserUse.includes(option)}
                  onChange={(e) => {
                    setGarden((prev) => ({
                      ...prev,
                      environment: {
                        ...prev.environment,
                        fertiliserUse: e.target.checked
                          ? [...prev.environment.fertiliserUse, option]
                          : prev.environment.fertiliserUse.filter(
                              (v) => v !== option
                            ),
                      },
                    }));
                  }}
                  className="mr-2"
                />
                {option}
              </label>
            ))}

            {garden.environment.fertiliserUse
              .filter(
                (v) =>
                  ![
                    "Organic compost",
                    "No synthetic fertilisers",
                    "Seaweed solution",
                    "Worm castings",
                  ].includes(v)
              )
              .map((custom, idx) => (
                <div key={custom} className="flex items-center mt-1">
                  <span className="flex-1">{custom}</span>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 bg-red-700 rounded text-white"
                    onClick={() => {
                      setGarden((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          fertiliserUse: prev.environment.fertiliserUse.filter(
                            (v) => v !== custom
                          ),
                        },
                      }));
                    }}
                    aria-label="Remove custom fertiliser use"
                  >
                    &times;
                  </button>
                </div>
              ))}
          </fieldset>

          <fieldset className="block border p-2 rounded mb-2">
            <legend className="font-semibold">
              Seasonal Planting Calendar
            </legend>
            {(["Summer", "Autumn", "Winter", "Spring"] as const).map(
              (season) => (
                <div key={season} className="flex items-center mb-2">
                  <label className="w-20">{season}</label>
                  <input
                    type="text"
                    value={garden.environment.seasonalPlantingCalendar[season]}
                    onChange={(e) => {
                      setGarden((prev) => ({
                        ...prev,
                        environment: {
                          ...prev.environment,
                          seasonalPlantingCalendar: {
                            ...prev.environment.seasonalPlantingCalendar,
                            [season]: e.target.value,
                          },
                        },
                      }));
                    }}
                    placeholder={`e.g. ${season} crops`}
                    className="flex-1 p-2 rounded bg-gray-800 ml-2"
                  />
                </div>
              )
            )}
          </fieldset>

          <label className="block">
            Photos
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                const uploadedFilenames: string[] = [];

                for (const file of files) {
                  const formData = new FormData();
                  formData.append("image", file);

                  try {
                    const res = await fetch("http://localhost:3000/upload", {
                      method: "POST",
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                      body: formData,
                    });

                    if (res.ok) {
                      const { url } = await res.json();
                      uploadedFilenames.push(url);
                    } else {
                      console.error("Failed to upload image:", file.name);
                    }
                  } catch (err) {
                    console.error("Error uploading image:", err);
                  }
                }

                setGarden((prev) => ({
                  ...prev,
                  photos: [...prev.photos, ...uploadedFilenames],
                }));
              }}
              className="w-full mt-1 p-2 rounded bg-gray-800"
            />
          </label>
          {photoFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {photoFiles.map((file, idx) => (
                <img
                  key={idx}
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx + 1}`}
                  className="w-24 h-24 object-cover rounded"
                />
              ))}
            </div>
          )}

          <button
            type="submit"
            className="bg-[#1ca24f8b] hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
