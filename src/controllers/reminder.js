const reminderService = require("../services/reminder");
const noteService = require("../services/notes");

const getAllReminderNotesByUserId = async (req, res) => {
  try {
    const { userId } = req;
    const reminderNotes = await reminderService.getAllReminderNotesByUserId(
      userId,
      noteService
    );
    if (!reminderNotes.length) {
      return res
        .status(404)
        .json({ message: "No reminders found for this user" });
    }
    return res.status(200).json(reminderNotes);
  } catch (error) {
    console.error(`Error retrieving reminders for user ${req.userId}:`, error);
    return res
      .status(500)
      .json({ error: "Failed to retrieve user's reminders" });
  }
};

module.exports = { getAllReminderNotesByUserId };
