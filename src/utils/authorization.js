const userService = require("../services/users");

const authorize = (allowedRoles) => async (req, res, next) => {
  try {
    // Check if req.userId is present
    if (!req.userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized. User ID is missing." });
    }

    // Fetch the user based on userId
    const user = await userService.readEntityById(req.userId);
    // Check if the user exists
    if (!user || user.length == 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Check if the user's role is included in allowed roles
    if (!allowedRoles.includes(user[0].role)) {
      return res.status(403).json({ error: "Access denied." });
    }

    // Proceed to the next middleware if everything is valid
    next();
  } catch (error) {
    console.error("Authorization error:", error); // Log the error for debugging
    return res.status(500).json({ error: "Internal server error." }); // Respond with a 500 error
  }
};

module.exports = authorize;
