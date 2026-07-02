import Suggestion from "../models/Suggestion.js";
import { validateSuggestion } from "../lib/validate.js";

export async function createSuggestion(req, res, next) {
  try {
    const { value, error } = validateSuggestion(req.body);
    if (error) return res.status(400).json({ message: error });

    const suggestion = await Suggestion.create(value);
    res.status(201).json({ id: suggestion._id, message: "Suggestion received — thank you!" });
  } catch (err) {
    next(err);
  }
}
