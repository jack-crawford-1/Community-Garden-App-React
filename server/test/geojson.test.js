import test from "node:test";
import assert from "node:assert/strict";
import { gardensToGeoJSON } from "../lib/geojson.js";

test("converts gardens to a GeoJSON FeatureCollection", () => {
  const gardens = [
    {
      _id: { toString: () => "abc123" },
      name: "Test Garden",
      description: "A garden",
      address: "1 Test St, Newtown, Wellington",
      suburb: "Newtown",
      region: "Wellington",
      lat: -41.3,
      lon: 174.78,
      contact: { email: "a@b.nz" },
      photos: [],
    },
  ];

  const fc = gardensToGeoJSON(gardens);
  assert.equal(fc.type, "FeatureCollection");
  assert.equal(fc.features.length, 1);

  const f = fc.features[0];
  assert.equal(f.id, "abc123");
  assert.deepEqual(f.geometry, { type: "Point", coordinates: [174.78, -41.3] });
  assert.equal(f.properties.name, "Test Garden");
  assert.equal(f.properties.suburb, "Newtown");
});

test("drops gardens without coordinates", () => {
  const fc = gardensToGeoJSON([{ _id: { toString: () => "x" }, name: "No coords" }]);
  assert.equal(fc.features.length, 0);
});
