const LABEL = "LABEL";
const NOTE = "NOTE";
const USER = "USER";

// Utility function to check if a value is empty
const isEmpty = (value) => {
  return (
    value == null ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
};

// Middleware function to validate based on type and required keys
const validateBody = (type) => {
  return (req, res, next) => {
    // Check if the request body is empty
    if (isEmpty(req.body)) {
      return res.status(400).json({ error: "Request body is required." });
    }

    // Define required keys based on the type
    let requiredKeys = [];
    switch (type) {
      case LABEL:
        requiredKeys = ["labelName"];
        break;

      case NOTE:
        requiredKeys = ["content", "labelIds"];
        break;

      case USER:
        requiredKeys = ["username", "email"];
        break;

      default:
        return res.status(400).json({ error: "Invalid type." });
    }

    // Check for missing required keys
    const missingKeys = requiredKeys.filter(
      (key) => !req.body.hasOwnProperty(key)
    );

    if (missingKeys.length) {
      return res.status(400).json({
        error: "Missing required keys.",
        missingKeys,
      });
    }

    // Additional validation for reminder field (only for NOTE type)
    const { reminder } = req.body;
    if (type === NOTE && reminder && !dateTimeValidate(reminder)) {
      return res.status(400).json({
        error: "Invalid time format.",
        details: "Expected format: YYYYMMDDThhmmss",
      });
    }

    // Proceed to the next middleware or route handler
    next();
  };
};

// Middleware to validate the entity ID (Note, Label, User)
const validateEntityID = (type, service) => {
  return async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req;

    // Check if the ID parameter is provided and is a valid number
    if (!id || isNaN(id)) {
      return res
        .status(400)
        .json({ error: `${type} ID should be a valid number.` });
    }

    try {
      // Use the corresponding service to fetch entities (e.g., noteService, labelService)
      const entities = await service.readEntityByUserId(Number(userId));
      // Check if the entity with the provided ID exists
      if (!entities.some((entity) => entity.id === Number(id))) {
        return res
          .status(404)
          .json({ error: `${type} with the given ID does not exist.` });
      }

      // Proceed to the next middleware/route handler
      next();
    } catch (error) {
      console.error(`Error validating ${type} ID:`, error);
      return res
        .status(500)
        .json({ error: `An error occurred while validating the ${type} ID.` });
    }
  };
};

// Utility function to validate the date format
const dateTimeValidate = (dateString) => {
  const date = new Date(dateString);
  return !isNaN(date.getTime()); // Return true if valid date
};

module.exports = { validateBody, validateEntityID };
