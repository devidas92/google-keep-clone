const express = require("express");
const noteService = require("../services/notes");
const router = express.Router();
const {
  createNote,
  deleteNote,
  updateNote,
  getAllNotesByUserId,
} = require("../controllers/notes");

const authTokenValidator = require("../utils/authTokenValidator");

const { validateEntityID, validateBody } = require("../utils/validateRoute");

const authorize = require("../utils/authorization");

// Retrive All notes by userId
router.get("/", authTokenValidator, authorize(["user"]), getAllNotesByUserId);

// Create a Note
router.post(
  "/",
  authTokenValidator,
  authorize(["user"]),
  validateBody("NOTE"),
  createNote
);

// Update a Note
router.put(
  "/:id",
  [
    authTokenValidator,
    authorize(["user"]),
    validateEntityID("NOTE", noteService),
    validateBody("NOTE"),
  ],
  updateNote
);

// Delete a Note
router.delete(
  "/:id",
  [
    authTokenValidator,
    authorize(["user"]),
    validateEntityID("NOTE", noteService),
    validateBody("NOTE"),
  ],
  deleteNote
);

module.exports = router;
