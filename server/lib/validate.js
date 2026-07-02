const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a suggestion payload. Returns { value } with a cleaned object,
 * or { error } with a human-readable message.
 */
export function validateSuggestion(body) {
  if (typeof body !== "object" || body === null) {
    return { error: "Request body must be a JSON object" };
  }

  const kind = body.kind === "correction" ? "correction" : "new-garden";

  const gardenName = str(body.gardenName, 200);
  if (!gardenName) return { error: "gardenName is required" };

  const message = str(body.message, 2000);
  if (!message) return { error: "message is required" };

  const submitterEmail = str(body.submitterEmail, 200);
  if (submitterEmail && !EMAIL_RE.test(submitterEmail)) {
    return { error: "submitterEmail is not a valid email address" };
  }

  const value = { kind, gardenName, message };
  const address = str(body.address, 300);
  if (address) value.address = address;
  if (submitterEmail) value.submitterEmail = submitterEmail;

  if (kind === "correction" && typeof body.gardenId === "string") {
    if (!/^[0-9a-fA-F]{24}$/.test(body.gardenId)) {
      return { error: "gardenId is not a valid id" };
    }
    value.gardenId = body.gardenId;
  }

  return { value };
}

function str(input, maxLength) {
  if (typeof input !== "string") return null;
  const trimmed = input.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, maxLength);
}
