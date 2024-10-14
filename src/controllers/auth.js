const authService = require("../services/auth");

// User Registration
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    await authService.registerUser(username, password);
    res.status(200).json({ message: `${username} registered successfully` });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).json({ error: error.message });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "An error occurred while registering user" });
  }
};

// User Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authService.loginUser(username, password);
    res
      .status(200)
      .json({ message: `${username} logined successfully`, token });
  } catch (error) {
    if (
      error.message === "User doesn't exists" ||
      error.message === "Invalid credentials"
    ) {
      return res.status(409).json({ error: error.message });
    }
    console.error("Error logging user:", error);
    res.status(500).json({ error: "An error occurred while logging user" });
  }
};

module.exports = { register, login };
