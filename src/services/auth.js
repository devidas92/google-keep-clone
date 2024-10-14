const userService = require("../services/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const config = require("../config");
const SECRET_KEY = config.jwt.secret_key;

const registerUser = async (username, password) => {
  const user = { username: username, password: password };
  user.role = "user"; // Assign the role of 'user' as the default for each user.
  return await userService.createUser(user);
};
const loginUser = async (username, password) => {
  const users = await userService.readUsers();
  const userExists = users.find((user) => user?.username === username);
  if (!userExists) {
    throw new Error("User doesn't exists");
  }
  const isMatch = await bcrypt.compare(password, userExists.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  // Generate jwt token
  const token = jwt.sign({ id: userExists.id }, SECRET_KEY, {
    expiresIn: "1h",
  });
  return token;
};
module.exports = { registerUser, loginUser };
