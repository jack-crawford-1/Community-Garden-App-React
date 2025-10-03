import { Link, useParams } from "react-router";
import { useEffect, useState } from "react";
import type { Garden } from "../types/GardenInterface";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import Navbar from "../components/nav/Navbar";

type EventType = {
  date: string;
  details: string;
};

const dummyNearbyEvents = [
  {
    garden: "Aro Valley Garden",
    date: "2025-11-05",
    details: "Bonfire & Harvest Story Night",
  },
  {
    garden: "Newtown Urban Garden",
    date: "2025-12-10",
    details: "Summer Seedling Swap",
  },
  {
    garden: "Mt Vic Green Patch",
    date: "2026-01-15",
    details: "Composting 101 Workshop",
  },
];

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export default function EventsPage() {
  const { id } = useParams<{ id: string }>();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [garden, setGarden] = useState<Garden | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const gardenRes = await fetch(`http://localhost:3000/gardens/${id}`);
        const gardenData = await gardenRes.json();
        setGarden(gardenData);

        const eventsRes = await fetch(
          `http://localhost:3000/gardens/${id}/events`
        );
        const eventsData = await eventsRes.json();
        setEvents(eventsData.events || []);
      } catch (err) {
        console.error("Failed to load garden or events", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] text-white">
        <div className="pl-40 pr-40">
          <h1 className="text-4xl md:text-5xl font-bold text-[#55b47e] mb-2 tracking-wide  md:max-w-5xl ml-20 mt-10">
            Events at {garden?.description}
          </h1>

          <div className="flex flex-col md:flex-row mt-10 max-w-6xl ml-20">
            <div className="space-y-10">
              <h2 className="text-3xl text-white mb-6 border-b border-[#55b47e] pb-10 p-10 pt-10 ">
                {garden?.description} Events
              </h2>
              {[...events]
                .sort(
                  (a, b) =>
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                )
                .map((ev, idx) => (
                  <div key={ev.date + ev.details + idx} className="w-full">
                    <div className="flex flex-col md:flex-row w-full bg-green-900/20 rounded-lg shadow-inner overflow-hidden">
                      {/* Text - 2/3 */}
                      <div className="w-full md:w-1/2 p-6">
                        <p className="text-green-300 font-mono text-sm mb-1">
                          {ev.date}
                        </p>
                        <p className="text-white text-lg font-semibold">
                          {ev.details}
                        </p>
                        <p className="mt-2 text-white text-sm">
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Dignissimos aspernatur impedit quod magni
                          repudiandae quasi corrupti cupiditate ratione est ex!
                          Modi dolorum, quo rem odit animi fugit obcaecati
                          consequuntur expedita?
                        </p>
                        <p className="mt-2 text-whit text-sm">
                          Lorem ipsum dolor sit, amet consectetur adipisicing
                          elit. Dignissimos aspernatur impedit quod magni
                          repudiandae quasi corrupti cupiditate ratione est ex!
                          Modi dolorum, quo rem odit animi fugit obcaecati
                          consequuntur expedita?
                        </p>

                        <div className="flex items-center gap-4 mt-5">
                          <button className="px-4 py-2 bg-green-600 rounded-md">
                            register
                          </button>
                          <img
                            src="/savefav.svg"
                            alt="Save"
                            className="w-5 h-5 object-cover transition-transform duration-200 hover:scale-105"
                          />
                        </div>
                      </div>

                      {/* Image - 1/3 */}
                      <div className="w-full md:w-1/2 p-10 flex justify-center items-center">
                        <img
                          src="/png/event1.png"
                          alt="Garden event"
                          className="w-full h-48 md:h-full object-cover rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="w-full border-b-2 border-green-600 mt-20 mb-20"></div>

        <div className="flex justify-between items-center p-30">
          <div className="">
            <h2 className="text-3xl text-white mb-6 border-b border-yellow-600 pb-2">
              Other Events Nearby
            </h2>
            <ul className="space-y-4">
              {dummyNearbyEvents.map((event, idx) => (
                <li
                  key={event.garden + event.date + idx}
                  className="flex items-center space-x-4 bg-green-900/20 p-3 rounded-lg shadow-inner"
                >
                  <p className="text-sm text-green-300 font-mono">
                    {event.date}
                  </p>
                  <p className="text-white font-semibold">{event.details}</p>
                  <p className="text-sm text-gray-400 italic">{event.garden}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="">
            <APIProvider apiKey={API_KEY}>
              <div className="w-[650px] h-[250px] rounded-lg overflow-hidden">
                <Map
                  mapId="4ede449a95c7241845c0af90"
                  defaultCenter={{
                    lat: garden?.lat ?? -41.3,
                    lng: garden?.lon ?? 174.77,
                  }}
                  defaultZoom={11}
                >
                  {/* <Marker position={{ lat: garden.lat, lng: garden.lon }} /> */}
                </Map>
              </div>
            </APIProvider>
          </div>
        </div>

        <div className="m-10">
          {garden?._id && (
            <Link to={`/gardens/${garden._id}`} className="">
              <button className="bg-green-600/40 font-bold px-3 py-2 rounded-md mt-10">
                ⏎ {garden?.description}
              </button>
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
