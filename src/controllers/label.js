const labelService = require("../services/labels");

const createLabel = async (req, res) => {
  try {
    const { body, userId } = req;
    body.userId = userId; // Assign the userId  from the authenticated user
    const newlabel = await labelService.createEntity(body);
    return res
      .status(201)
      .json({ message: "label created successfully", label: newlabel });
  } catch (error) {
    if (error.message === "Label already exists") {
      return res.status(409).json({ error: error.message });
    }
    console.error("Error creating label:", error);
    return res.status(500).json({ error: "Failed to create the label" });
  }
};

const getAllLabelsByUserId = async (req, res) => {
  try {
    const { userId } = req;
    const labels = await labelService.readEntityByUserId(userId);
    if (!labels.length) {
      return res.status(404).json({ message: "No lables found for this user" });
    }
    return res.status(200).json(labels);
  } catch (error) {
    console.error(`Error retrieving labels for user ${req.userId}:`, error);
    return res.status(500).json({ error: "Failed to retrieve user's lables" });
  }
};

const getLabelsByLabelId = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    const labels = await labelService.readEntityByLabelId(userId, id);
    if (!labels.length) {
      return res.status(404).json({ message: "No lables found for this user" });
    }
    return res.status(200).json(labels);
  } catch (error) {
    console.error(`Error retrieving labels for user ${req.userId}:`, error);
    return res.status(500).json({ error: "Failed to retrieve user's lables" });
  }
};

const deleteLabel = async (req, res) => {
  try {
    const { userId } = req;
    const { id } = req.params;
    await labelService.deleteEntity(userId, id);
    return res
      .status(200)
      .json({ message: `Label with id ${id} deleted successfully` });
  } catch (error) {
    console.error(`Error deleting label with id ${req.params.id}:`, error);
    return res.status(500).json({ error: "Failed to delete the label" });
  }
};

const updateLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const { body, userId } = req;
    body.userId = userId; // Ensure userId is from the authenticated user

    const updatedLabel = await labelService.updateEntity(body, id);
    if (!updatedLabel) {
      return res.status(404).json({ error: `Label with id ${id} not found` });
    }
    return res.status(200).json({
      message: `Label with id ${id} updated successfully`,
      label: updatedLabel,
    });
  } catch (error) {
    console.error(`Error updating label with id ${req.params.id}:`, error);
    return res.status(500).json({ error: "Failed to update the label" });
  }
};

module.exports = {
  createLabel,
  getAllLabelsByUserId,
  getLabelsByLabelId,
  deleteLabel,
  updateLabel,
};
