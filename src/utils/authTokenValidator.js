const jwt = require("jsonwebtoken");
const config = require("../config");
const SECRET_KEY = config.jwt.secret_key;

const authTokenValidator = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ error: "Authorization failed. No access token." });
    }

    // Using a promise to handle token verification
    const user = await new Promise((resolve, reject) => {
      jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
          return reject(err); // Reject with the error object directly
        }
        resolve(decoded);
      });
    });

    req.userId = user.id; // Set the user ID on the request object
    next(); // Call next() only if there are no errors
  } catch (error) {
    let errorMessage;
    let statusCode;

    // Determine the type of error and set the message and status code
    if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid token. Please provide a valid access token.";
      statusCode = 401;
    } else if (error.name === "TokenExpiredError") {
      errorMessage = "Token expired. Please log in again.";
      statusCode = 401;
    } else {
      errorMessage = "Authorization failed. Could not verify token.";
      statusCode = 403; // Forbidden
    }

    console.log("Error:", error.message);
    return res.status(statusCode).json({ error: errorMessage });
  }
};

module.exports = authTokenValidator;
