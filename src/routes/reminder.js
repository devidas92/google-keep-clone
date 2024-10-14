const express = require("express");

const router = express.Router();
const authTokenValidator = require("../utils/authTokenValidator");
const authorize = require("../utils/authorization");

const { getAllReminderNotesByUserId } = require("../controllers/reminder");

// Retrive All reminders by userId
router.get(
  "/",
  authTokenValidator,
  authorize(["user"]),
  getAllReminderNotesByUserId
);

module.exports = router;
