const { readFile, writeFile } = require("fs/promises");
const { addReminder, deleteReminder, updateReminder } = require("./reminder");
const path = require("path");

const filePath = path.resolve("src", "db", "notes.json");

const readNotes = async () => {
  const data = await readFile(filePath, "utf-8").catch(() => "[]");
  return JSON.parse(data || "[]"); // Parse existing notes or initialize an empty array
};

const writeNotes = async (notes) => {
  await writeFile(filePath, JSON.stringify(notes, null, 2));
};

const createEntity = async (newNote) => {
  const notes = await readNotes();
  let highestId = notes.reduce((max, note) => Math.max(max, note.id || 0), 0);
  newNote.id = ++highestId;
  const noteWithTimestamp = { ...newNote, createdAt: new Date().toISOString() };
  if (newNote.hasOwnProperty("reminder")) {
    await addReminder(newNote); // add reminder notes to the reminder.json
  }
  await writeNotes([...notes, noteWithTimestamp]);
  return noteWithTimestamp;
};

const readEntityByUserId = async (userId) => {
  const notes = await readNotes();
  return notes.filter((note) => note.userId === Number(userId));
};

const updateEntity = async (note, id) => {
  const oldNotes = await readNotes();
  const updatedNotes = oldNotes.filter((oldNote) => oldNote.id != Number(id));
  note.id = Number(id);
  const noteWithTimestamp = {
    ...note,
    createdAt: new Date().toISOString(),
  };
  if (note.hasOwnProperty("reminder")) {
    await updateReminder(note, id); // update reminder notes to the reminder.json
  }
  await writeNotes([...updatedNotes, noteWithTimestamp]);
  return noteWithTimestamp;
};

const deleteEntity = async (noteId) => {
  const notes = await readNotes();
  const newData = notes.filter((note) => note.id !== Number(noteId));
  await writeNotes(newData);
  // delete reminder Data
  await deleteReminder(noteId);
};

module.exports = {
  createEntity,
  readEntityByUserId,
  deleteEntity,
  updateEntity,
  writeNotes,
  readNotes,
};
