const express = require("express");

const router = express.Router();
const userService = require("../services/users");
const { validateEntityID, validateBody } = require("../utils/validateRoute");

const {
  createUser,
  getAllUsers,
  deleteUser,
  updateUser,
  getUserById,
} = require("../controllers/users");


// Retrive All users
router.get("/", getAllUsers);

// Retrive All users by id
router.get("/:id", validateEntityID, getUserById);

// Create a user
router.post("/", validateBody, createUser);

// Update a user
router.put("/:id", [validateEntityID, validateBody], updateUser);

// Delete a user
router.delete("/:id", validateEntityID, deleteUser);

module.exports = router;
