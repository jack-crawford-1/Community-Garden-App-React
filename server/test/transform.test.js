import test from "node:test";
import assert from "node:assert/strict";
import { suburbFromAddress, toGardenDoc } from "../lib/transform.js";

test("finds the suburb even in messy council addresses", () => {
  assert.equal(suburbFromAddress("1 Endeavour Street, Lyall Bay, Wellington"), "Lyall Bay");
  assert.equal(suburbFromAddress("Beside 559 Adelaide Rd, Berhampore"), "Berhampore");
  assert.equal(suburbFromAddress("96 - 112 Kelburn Parade"), "Kelburn");
  assert.equal(suburbFromAddress("Corner of Tarikaka Street and Ngata Street, Ngaio"), "Ngaio");
});

test("prefers the suburb that appears latest in the address", () => {
  // "Karori" appears twice; the street mention must not confuse it.
  assert.equal(suburbFromAddress("21 Beauchamp Street, Karori, Wellington"), "Karori");
});

test("returns undefined when no known suburb matches", () => {
  assert.equal(suburbFromAddress("Massey Wellington Campus, Tasman Street"), undefined);
  assert.equal(suburbFromAddress(undefined), undefined);
});

test("maps a WCC record to a garden doc", () => {
  const doc = toGardenDoc({
    description: "A lovely garden.",
    address: "Harrison  Street,\nBrooklyn, Wellington",
    lat: -41.3,
    lon: 174.76,
    contact: { email: "a@b.nz" },
    _meta: { name: "Brooklyn Community Orchard", source: "WCC", sourceId: 1, hasDescription: true },
  });
  assert.equal(doc.name, "Brooklyn Community Orchard");
  assert.equal(doc.description, "A lovely garden.");
  assert.equal(doc.address, "Harrison Street, Brooklyn, Wellington");
  assert.equal(doc.suburb, "Brooklyn");
  assert.equal(doc.region, "Wellington");
  assert.equal(doc.sourceId, 1);
});

test("drops the description when it is just the name fallback", () => {
  const doc = toGardenDoc({
    description: "Tawa Community Gardens",
    address: "21-29 Oxford Street, Tawa, Wellington",
    lat: -41.17,
    lon: 174.82,
    _meta: { name: "Tawa Community Gardens", hasDescription: false },
  });
  assert.equal(doc.description, undefined);
});

test("rejects records without coordinates or name", () => {
  assert.equal(toGardenDoc({ description: "x", _meta: {} }), null);
});
