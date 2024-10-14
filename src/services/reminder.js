const path = require("path");
const { readFile, writeFile } = require("fs/promises");

const filePath = path.resolve("src", "db", "reminder.json");

const readReminders = async () => {
  const data = await readFile(filePath, "utf-8").catch(() => "[]");
  return JSON.parse(data || "[]"); // Parse existing reminders or initialize an empty array
};

const writeReminders = async (reminders) => {
  await writeFile(filePath, JSON.stringify(reminders, null, 2));
};

const addReminder = async (note) => {
  const newReminder = {
    noteId: note.id,
    userId: note.userId,
    date: note.reminder,
    isNotified: false,
  };

  const existingReminders = await readReminders();
  let highestId = existingReminders.reduce(
    (max, reminder) => Math.max(max, reminder.id || 0),
    0
  );
  newReminder.id = ++highestId;
  newReminder.createdAt = new Date().toISOString();

  // Save the updated reminders back to the file in one go
  await writeReminders([...existingReminders, newReminder]);
};

const updateReminder = async (note, noteId) => {
  // Read all existing reminders from the data source
  const storedReminders = await readReminders();
  // Check if a reminder with the specified noteId exists
  const oldReminder = storedReminders.find(
    (reminder) => reminder.noteId === Number(noteId)
  );
  // If no reminder exists for the given noteId, add new reminder to reminder.json
  if (!oldReminder) {
    note.id = Number(noteId);
    await addReminder(note);
  } else {
    const { noteId, userId, id } = oldReminder;
    const newReminder = {
      noteId,
      userId,
      id,
      date: note.reminder,
      isNotified: false,
      createdAt: new Date().toISOString(),
    };

    // Filter out the reminder that matches the specified noteId
    const updatedReminders = storedReminders.filter(
      (reminder) => reminder.noteId !== Number(noteId)
    );
    const reminders = [...updatedReminders, newReminder];
    // Write the updated list of reminders back to the data source

    await writeReminders(reminders);
  }
};

// Function to check reminders
const checkReminders = async () => {
  const now = new Date();
  const reminders = await getRemindersDue(now);

  if (reminders.length > 0) {
    // Mark all reminders as notified and update them in one go
    const storedReminders = await readReminders();
    const updatedReminders = storedReminders.map((reminder) => {
      const match = reminders.find((r) => r.id === reminder.id);
      if (match) {
        reminder.isNotified = true;
        reminder.updatedAt = new Date().toISOString();
      }
      return reminder;
    });

    //  Function/Logic to Notify the users with their respective reminders

    // write all reminders in one operation
    await writeReminders(updatedReminders);
  }
};

const getRemindersDue = async (current) => {
  const existingReminders = await readReminders();
  const expiredReminders = existingReminders.filter((each) => {
    const reminderDateTime = new Date(each.date);
    return !each.isNotified && reminderDateTime.getTime() <= current.getTime();
  });
  return expiredReminders;
};

// Fetch all reminders associated with a specific user ID
const fetchRemindersByUserId = async (userId) => {
  const allReminders = await readReminders();

  // Filter reminders by the given user ID
  const userReminders = allReminders.filter(
    (reminder) => reminder.userId === userId
  );

  return userReminders;
};

// Retrieve all notes with associated reminders for a given user
const getAllReminderNotesByUserId = async (userId, noteService) => {
  // Fetch all notes created by the user
  const userNotes = await noteService.readNoteByUserId(userId);

  // Fetch all reminders set by the user
  const userReminders = await fetchRemindersByUserId(userId);

  // Combine notes with their corresponding reminders, if any
  const notesWithReminders = userNotes
    .map((note) => {
      // Find the reminder associated with the current note
      const relatedReminder = userReminders.find(
        (reminder) => reminder.noteId === note.id
      );

      // If a reminder exists, merge reminder data with the note object
      if (relatedReminder) {
        return {
          ...note,
          reminderDate: relatedReminder.date,
          isNotified: relatedReminder.isNotified,
          id: relatedReminder.id,
        };
      }
    })
    .filter(Boolean); // Remove any undefined entries (i.e., notes without reminders)

  return notesWithReminders;
};

const deleteReminder = async (noteId) => {
  // Read all existing reminders from the data source
  const existingReminders = await readReminders();

  // Check if a reminder with the specified noteId exists
  const reminderExists = existingReminders.some(
    (reminder) => reminder.noteId === Number(noteId)
  );

  // If no reminder exists for the given noteId, exit the function
  if (!reminderExists) {
    return;
  }

  // Filter out the reminder that matches the specified noteId
  const updatedReminders = existingReminders.filter(
    (reminder) => reminder.noteId !== Number(noteId)
  );

  // Write the updated list of reminders back to the data source
  await writeReminders(updatedReminders);
};

module.exports = {
  addReminder,
  checkReminders,
  getAllReminderNotesByUserId,
  deleteReminder,
  updateReminder,
};
