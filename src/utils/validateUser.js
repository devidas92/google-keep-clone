const userServices = require("../services/users");

const validateUserBody = (req, res, next) => {
  const data = req.body;
  if (isEmpty(data)) {
    return res.status(400).json({ error: "User data is required" });
  }
  const requiredKeys = ["username", "password", "role"];

  const missingKeys = requiredKeys.filter(
    (key) => !Object.prototype.hasOwnProperty.call(data, key)
  );
  if (missingKeys.length > 0) {
    return res.status(400).json({
      message: "Missing required keys",
      missingKeys: missingKeys,
    });
  }
  next();
};

const validateUserID = async (req, res, next) => {
  const { id } = req.params;
  // Check if the ID parameter is provided
  if (id && isNaN(id)) {
    return res.status(400).json({ error: "User ID should be a number" });
  }

  try {
    // Fetch notes from the service
    const user = await userServices.readUserById(id);
    // Check if the note with the provided ID exists
    if (isEmpty(user)) {
      return res
        .status(404)
        .json({ error: "User with the given ID does not exist" });
    }

    // Proceed to the next middleware/route handler if validation passes
    next();
  } catch (error) {
    // Handle errors that occur while fetching notes
    console.error(error);
    return res
      .status(500)
      .json({ error: "An error occurred while validating the Note ID" });
  }
};

const isEmpty = (value) => {
  return (
    value == null ||
    (typeof value === "object" && Object.keys(value).length === 0)
  );
};

module.exports = { validateUserID, validateUserBody };
