import test from "node:test";
import assert from "node:assert/strict";
import { validateSuggestion } from "../lib/validate.js";

test("accepts a minimal new-garden suggestion", () => {
  const { value, error } = validateSuggestion({
    gardenName: "Aro Valley Patch",
    message: "There is a new garden behind the community hall.",
  });
  assert.equal(error, undefined);
  assert.equal(value.kind, "new-garden");
  assert.equal(value.gardenName, "Aro Valley Patch");
});

test("accepts a correction with a valid gardenId", () => {
  const { value, error } = validateSuggestion({
    kind: "correction",
    gardenId: "0123456789abcdef01234567",
    gardenName: "Kaicycle",
    message: "The email address has changed.",
    submitterEmail: "jack@example.com",
  });
  assert.equal(error, undefined);
  assert.equal(value.kind, "correction");
  assert.equal(value.gardenId, "0123456789abcdef01234567");
  assert.equal(value.submitterEmail, "jack@example.com");
});

test("rejects missing message", () => {
  const { error } = validateSuggestion({ gardenName: "X" });
  assert.match(error, /message/);
});

test("rejects missing gardenName", () => {
  const { error } = validateSuggestion({ message: "hello" });
  assert.match(error, /gardenName/);
});

test("rejects invalid email", () => {
  const { error } = validateSuggestion({
    gardenName: "X",
    message: "y",
    submitterEmail: "not-an-email",
  });
  assert.match(error, /submitterEmail/);
});

test("rejects malformed gardenId", () => {
  const { error } = validateSuggestion({
    kind: "correction",
    gardenId: "nope",
    gardenName: "X",
    message: "y",
  });
  assert.match(error, /gardenId/);
});

test("truncates oversized fields", () => {
  const { value } = validateSuggestion({
    gardenName: "n".repeat(500),
    message: "m".repeat(5000),
  });
  assert.equal(value.gardenName.length, 200);
  assert.equal(value.message.length, 2000);
});

test("rejects non-object bodies", () => {
  assert.ok(validateSuggestion(null).error);
  assert.ok(validateSuggestion("hi").error);
});
