/**
 * Enriches every existing Venue (garden) with realistic-looking demo data so the
 * garden pages look full. Sets a short `name` (1-3 words) for the title and a
 * longer `description` blurb. Coordinates, photos and _id are preserved.
 *
 * Run from the server directory:  node scripts/enrich-venues.js
 */
import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { connectDB } from "../db/mongodbConnection.js";
import Venue from "../models/Venue.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUBURBS = [
  "Newtown", "Aro Valley", "Berhampore", "Island Bay", "Brooklyn",
  "Mount Victoria", "Kelburn", "Karori", "Miramar", "Kilbirnie",
  "Thorndon", "Te Aro", "Mount Cook", "Hataitai", "Lyall Bay",
  "Northland", "Wadestown", "Strathmore", "Owhiro Bay", "Khandallah",
  "Johnsonville", "Ngaio", "Crofton Downs", "Roseneath", "Houghton Bay",
  "Vogeltown", "Melrose", "Wilton", "Highbury", "Tawa",
];

const COORDINATORS = [
  "Aroha Williams", "Tāne Reed", "Mere Tipene", "James Carter", "Sophie Nguyen",
  "Hemi Walker", "Olivia Chen", "Daniel O'Brien", "Pita Rangi", "Emma Thompson",
  "Wiremu Cooper", "Grace Patel", "Liam Murphy", "Ana Faleolo", "Ruby Sinclair",
  "Manaia Brown",
];

const STREETS = [
  "Daniell Street", "Riddiford Street", "Constable Street", "Adelaide Road",
  "The Parade", "Owen Street", "Coromandel Street", "Russell Terrace",
  "Mansfield Street", "Hanson Street", "Rintoul Street", "Drummond Street",
];

const PRODUCE = [
  "Tomatoes", "Silverbeet", "Kale", "Runner beans", "Pumpkin", "Mixed herbs",
  "Strawberries", "Garlic", "Lettuce", "Courgettes", "Rhubarb", "Spring onions",
  "Broad beans", "Carrots", "Beetroot",
];
const WATER_SOURCE = ["Rainwater tanks", "Mains supply", "Rain barrels", "On-site bore"];
const SOIL = ["Free-draining loam", "Clay loam", "Sandy loam", "Compost-enriched topsoil", "Raised-bed mix"];
const IRRIGATION = ["Drip irrigation", "Hand watering", "Soaker hoses", "Timed sprinklers"];
const COMPOST = ["Three-bay compost system", "Worm farm", "Bokashi bins", "Communal compost"];
const MULCH = ["Straw mulch", "Wood chip", "Leaf litter", "Pea straw"];
const ORGANIC = ["Spray-free", "Certified organic", "Transitioning to organic", "Not certified"];
const POLLINATOR = ["Bee-friendly flower borders", "Native plantings", "Insect hotel", "Wildflower strip"];
const WATER_CONS = ["Rainwater harvesting", "Heavy mulching", "Drip irrigation", "Greywater reuse"];
const FERT = ["Home-made compost", "Sheep pellets", "Seaweed solution", "Comfrey tea", "Worm castings"];
const FACILITIES = [
  "Tool shed", "Rainwater tanks", "Communal seating", "Greenhouse", "Compost bays",
  "Wheelbarrows", "Potting bench", "Picnic table", "Children's plot", "Notice board",
];
const ACCESS = [
  "Wheelchair-accessible paths", "Raised beds for limited mobility", "Sealed pathways",
  "Accessible toilet nearby", "Level entry from street",
];
const WASTE = ["On-site composting", "Green-waste collection", "Soft-plastics recycling", "Cardboard mulching"];
const RULES = [
  "Return tools to the shed after use", "Compost green waste only", "Lock the gate when you leave",
  "Children to be supervised", "No sprays in shared beds", "Share surplus on the produce table",
];
const PARTNERS = [
  "Wellington City Council", "Sustainability Trust", "Local primary school",
  "Forest & Bird", "Kaicycle", "Regional food bank", "Neighbourhood association",
];
const EVENT_DETAILS = [
  "Monthly working bee — all welcome", "Seedling & seed swap", "Harvest potluck",
  "Composting workshop", "Pruning demonstration", "Kids' planting morning",
];
const INSURANCE = [
  "Public liability cover via the Wellington City Council community garden programme.",
  "Covered under the Sustainability Trust community garden policy.",
  "Public liability insurance held through the local residents' association.",
];
const SEASONS = {
  Summer: [
    "Tomatoes, beans and courgettes in full swing — keep the water up.",
    "Harvesting salad greens, zucchini and the first tomatoes.",
  ],
  Autumn: [
    "Sowing garlic, broad beans and winter brassicas.",
    "Planting onions and leafy greens as the soil cools.",
  ],
  Winter: [
    "Kale, silverbeet and leeks carry the beds through the cold.",
    "Mulching, composting and planning next season's plots.",
  ],
  Spring: [
    "Seed-raising tomatoes and pumpkins under cover; first plantings out.",
    "Beds turned over and the new season's seedlings going in.",
  ],
};

const pick = (arr, i) => arr[Math.abs(i) % arr.length];
const rotate = (arr, start) =>
  arr.slice(start % arr.length).concat(arr.slice(0, start % arr.length));
const subset = (arr, i, n) => rotate(arr, i).slice(0, n);

function deriveSuburb(address, i) {
  if (address && !/test st/i.test(address)) {
    const parts = address.split(",").map((s) => s.trim());
    const known = parts.find((p) => SUBURBS.includes(p));
    if (known) return known;
  }
  return pick(SUBURBS, i);
}

function blurb(suburb, i) {
  const templates = [
    `A volunteer-run community garden in ${suburb} with raised beds, a shared tool shed and a busy compost system. New growers of all experience levels are welcome.`,
    `Tucked into ${suburb}, this garden brings neighbours together to grow vegetables, herbs and flowers using organic, spray-free methods.`,
    `A friendly ${suburb} garden focused on growing kai locally, sharing surplus produce and learning together through regular working bees.`,
    `Started by local residents, the ${suburb} garden offers individual plots, communal beds and a welcoming space to grow food and meet people.`,
  ];
  return pick(templates, i);
}

function hours(i) {
  // A couple of patterns so they're not all identical.
  if (i % 3 === 0) {
    return {
      Monday: ["07:00", "19:00"], Tuesday: ["07:00", "19:00"],
      Wednesday: ["07:00", "19:00"], Thursday: ["07:00", "19:00"],
      Friday: ["07:00", "19:00"], Saturday: ["08:00", "18:00"],
      Sunday: ["08:00", "18:00"], Holidays: ["09:00", "16:00"],
    };
  }
  if (i % 3 === 1) {
    return {
      Monday: ["", ""], Tuesday: ["08:00", "17:00"],
      Wednesday: ["08:00", "17:00"], Thursday: ["08:00", "17:00"],
      Friday: ["08:00", "17:00"], Saturday: ["09:00", "16:00"],
      Sunday: ["09:00", "16:00"], Holidays: ["", ""],
    };
  }
  return {
    Monday: ["06:30", "20:00"], Tuesday: ["06:30", "20:00"],
    Wednesday: ["06:30", "20:00"], Thursday: ["06:30", "20:00"],
    Friday: ["06:30", "20:00"], Saturday: ["06:30", "20:00"],
    Sunday: ["06:30", "20:00"], Holidays: ["06:30", "20:00"],
  };
}

function futureDate(monthsAhead) {
  // Fixed base date so reruns are deterministic (no Date.now drift in output).
  const base = new Date("2026-06-15T00:00:00Z");
  base.setMonth(base.getMonth() + monthsAhead);
  return base.toISOString().slice(0, 10);
}

async function run() {
  await connectDB(process.env.URI);

  const venues = await Venue.find();

  // Safety backup of current records (raw) so this is reversible.
  const backupPath = path.join(__dirname, "venues-backup.json");
  if (!fs.existsSync(backupPath)) {
    const raw = await Venue.find().lean();
    fs.writeFileSync(backupPath, JSON.stringify(raw, null, 2));
    console.log(`Backed up ${raw.length} records to ${backupPath}`);
  } else {
    console.log(`Backup already exists at ${backupPath} (not overwriting).`);
  }

  console.log(`Enriching ${venues.length} gardens...`);

  let n = 0;
  for (let i = 0; i < venues.length; i++) {
    const v = venues[i];
    const suburb = deriveSuburb(v.address, i);

    v.name = `${suburb} Garden`;
    v.description = blurb(suburb, i);

    if (!v.address || /test st/i.test(v.address || "")) {
      v.address = `${10 + (i % 80)} ${pick(STREETS, i)}, ${suburb}, Wellington`;
    }

    v.coordinator = pick(COORDINATORS, i);
    v.established = `${2009 + (i % 13)}-0${1 + (i % 9)}-01`;
    v.lastUpdated = "2026-05-30T00:00:00.000Z";
    v.volunteersWelcome = i % 5 !== 0;
    v.membershipRequired = i % 4 === 0;
    v.insurance = pick(INSURANCE, i);

    v.contact = {
      email: `${suburb.toLowerCase().replace(/\s+/g, "")}@growlocal.example.nz`,
      phone: `04 ${String(380 + (i % 600)).padStart(3, "0")} ${String(1000 + (i * 37) % 9000).padStart(4, "0")}`,
      website: `https://growlocal.example.nz/${suburb.toLowerCase().replace(/\s+/g, "-")}`,
      social: {
        facebook: `https://facebook.com/${suburb.toLowerCase().replace(/\s+/g, "")}garden`,
        other: "",
        other2: "",
      },
    };

    v.facilities = subset(FACILITIES, i, 4 + (i % 3));
    v.accessibility = subset(ACCESS, i + 1, 2 + (i % 3));
    v.wasteManagement = subset(WASTE, i, 2 + (i % 2));
    v.rules = subset(RULES, i + 2, 3 + (i % 3));
    v.partnerships = subset(PARTNERS, i, 2 + (i % 3));

    v.events = [
      { date: futureDate(1 + (i % 2)), details: pick(EVENT_DETAILS, i) },
      { date: futureDate(2 + (i % 3)), details: pick(EVENT_DETAILS, i + 2) },
    ];
    if (i % 2 === 0) {
      v.events.push({ date: futureDate(4), details: pick(EVENT_DETAILS, i + 4) });
    }

    v.openingHours = hours(i);

    v.environment = {
      gardenSizeSqm: 200 + ((i * 137) % 1400),
      numberOfBeds: 8 + ((i * 7) % 34),
      produceType: subset(PRODUCE, i, 5 + (i % 4)),
      waterSource: subset(WATER_SOURCE, i, 1 + (i % 2)),
      soilType: subset(SOIL, i, 1 + (i % 2)),
      pollinatorSupport: subset(POLLINATOR, i, 2 + (i % 2)),
      fertiliserUse: subset(FERT, i, 2 + (i % 3)),
      seasonalPlantingCalendar: {
        Summer: pick(SEASONS.Summer, i),
        Autumn: pick(SEASONS.Autumn, i),
        Winter: pick(SEASONS.Winter, i),
        Spring: pick(SEASONS.Spring, i),
      },
      organicCertification: pick(ORGANIC, i),
      waterConservation: subset(WATER_CONS, i, 2 + (i % 2)),
      irrigationSystem: pick(IRRIGATION, i),
      compostingFacilities: subset(COMPOST, i, 1 + (i % 2)),
      mulchingPractices: subset(MULCH, i, 1 + (i % 2)),
    };

    await v.save();
    n++;
  }

  console.log(`Done — enriched ${n} gardens.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
