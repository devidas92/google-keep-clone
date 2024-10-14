const noteService = require("../services/notes");

const createNote = async (req, res) => {
  try {
    const { body, userId } = req;
    body.userId = userId; // Assign the userId of the note from the authenticated user
    const newNote = await noteService.createEntity(body);
    return res
      .status(201)
      .json({ message: "Note created successfully", note: newNote });
  } catch (error) {
    console.error("Error creating note:", error);
    return res.status(500).json({ error: "Failed to create the note" });
  }
};

const getAllNotesByUserId = async (req, res) => {
  try {
    const { userId } = req;
    const notes = await noteService.readEntityByUserId(userId);
    if (!notes.length) {
      return res.status(404).json({ message: "No notes found for this user" });
    }
    return res.status(200).json(notes);
  } catch (error) {
    console.error(`Error retrieving notes for user ${req.userId}:`, error);
    return res.status(500).json({ error: "Failed to retrieve user's notes" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    await noteService.deleteEntity(id);
    return res
      .status(200)
      .json({ message: `Note with id ${id} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting note with id ${req.params.id}:`, error);
    return res.status(500).json({ error: "Failed to delete the note" });
  }
};

const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, userId } = req;
    body.userId = userId; // Ensure userId is from the authenticated user

    const updatedNote = await noteService.updateEntity(body, id);
    if (!updatedNote) {
      return res.status(404).json({ error: `Note with id ${id} not found` });
    }
    return res.status(200).json({
      message: `Note with id ${id} updated successfully`,
      note: updatedNote,
    });
  } catch (error) {
    console.error(`Error updating note with id ${req.params.id}:`, error);
    return res.status(500).json({ error: "Failed to update the note" });
  }
};

module.exports = {
  createNote,
  getAllNotesByUserId,
  deleteNote,
  updateNote,
};
