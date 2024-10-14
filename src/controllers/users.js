const userService = require("../services/users");

const createUser = async (req, res) => {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(409).json({ error: error.message });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ error: "An error occurred while creating the user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.readUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error retrieving users:", error);
    res.status(500).json({ error: "An error occurred while retrieving users" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.readUserById(id);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "An error occurred while retrieving user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userService.deleteUser(id);
    res.status(200).json({ message: `Id: ${id} user deleted successfully` });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "An error occurred while deleting user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;
    const updatedUser = await userService.updateUser(userData, id);
    res.status(200).json({
      message: `Id: ${id} user updated successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "An error occurred while updating user" });
  }
};

module.exports = {
  createUser,
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
};
