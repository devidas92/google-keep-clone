const labelService = require("../services/labels");

// Utility function to check if a value is empty
const isEmpty = (value) => {
  return (
    value == null ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
};

// Middleware to validate the note body
const validateLabelBody = (req, res, next) => {
  // Check if the request body is empty
  if (isEmpty(req.body)) {
    return res.status(400).json({ error: "Label data is required." });
  }

  // Check for missing required keys
  const missingKeys = ["labelName"].filter(
    (key) => !req.body.hasOwnProperty(key)
  );
  if (missingKeys.length) {
    return res.status(400).json({
      error: "Missing required keys.",
      missingKeys,
    });
  }
  // Proceed to the next middleware/route handler
  next();
};

// Middleware to validate the note ID
const validateLabelID = async (req, res, next) => {
  const { id } = req.params;

  // Check if the ID parameter is provided and is a number
  if (!id || isNaN(id)) {
    return res.status(400).json({ error: "Label ID should be a valid number." });
  }

  try {
    const labels = await labelService.readLabelByUserId();

    // Check if the note with the provided ID exists
    if (!labels.some((label) => label.id === Number(id))) {
      return res
        .status(404)
        .json({ error: "Label with the given ID does not exist." });
    }

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Error validating Label ID:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while validating the Label ID." });
  }
};


// Middleware for checking if the user is authorized to access the reminder
const checkNoteOwnership = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userRelatedNoteIds = await noteService.readNoteByUserId(req.userId);
    const noteIds = userRelatedNoteIds.map((note) => note.id);

    // Check if the userId matches the note's userId
    if (!noteIds.includes(Number(id))) {
      return res.status(403).json({
        error:
          "Unauthorized access: You do not have permission to access this note.",
      });
    }

    // If userId matches, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking note ownership:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while checking note ownership." });
  }
};

module.exports = { validateNoteBody, validateNoteID, checkNoteOwnership };
