const { readFile, writeFile } = require("fs/promises");
const path = require("path");
const filePath = path.resolve("src", "db", "labels.json");
const noteService = require("./notes");

const readLabels = async () => {
  const data = await readFile(filePath, "utf-8").catch(() => "[]");
  return JSON.parse(data || "[]"); // Parse existing notes or initialize an empty array
};

const writeLabels = async (labels) => {
  await writeFile(filePath, JSON.stringify(labels, null, 2));
};

const createEntity = async (newLabel) => {
  const existingLabels = await readLabels();
  // check the existance of the label
  if (existingLabels.some((each) => each?.labelName === newLabel.labelName)) {
    throw new Error("Label already exists");
  }
  let highestId = existingLabels.reduce(
    (max, label) => Math.max(max, label.id || 0),
    0
  );
  newLabel.id = ++highestId;
  const labelWithTimestamp = {
    ...newLabel,
    createdAt: new Date().toISOString(),
  };
  await writeLabels([...existingLabels, labelWithTimestamp]);
  return labelWithTimestamp;
};

const readEntityByUserId = async (userId) => {
  const labels = await readLabels();
  const userLabels = labels.filter((label) => label.userId === Number(userId));
  return userLabels.map((label) => {
    const { labelName, id } = label;
    return { labelName, id };
  });
};

const readEntityByLabelId = async (userId, labelId) => {
  const userNotes = await noteService.readEntityByUserId(Number(userId));
  return userNotes.filter((note) => note.labelIds.includes(Number(labelId)));
};

const updateEntity = async (labelData, id) => {
  let newLabel = {};
  const storedLables = await readLabels();
  const updatedLabels = storedLables.map((label) => {
    if (label.id == Number(id)) {
      newLabel = { ...label };
      newLabel.createdAt = new Date().toISOString();
      newLabel.labelName = labelData.labelName;
      return newLabel;
    }
    return label;
  });

  await writeLabels(updatedLabels);
  return newLabel;
};

const deleteEntity = async (userId, labelId) => {
  const labels = await readLabels();
  const newData = labels.filter((label) => label.id !== Number(labelId));
  await writeLabels(newData);

  // delete the labels from the notes having the labelId
  const userNotes = await noteService.readEntityByUserId(userId);
  const updatedUserNotes = userNotes.map((note) => {
    note.labelIds = note.labelIds.filter((value) => value != Number(labelId));
    return note;
  });
  const storedNotes = await noteService.readNotes();
  const filteredStoredNotes = storedNotes.filter(
    (note) => note.userId !== Number(userId)
  );
  const updatedNotes = [...filteredStoredNotes, ...updatedUserNotes];
  await noteService.writeNotes(updatedNotes);
};

module.exports = {
  createEntity,
  readEntityByUserId,
  readEntityByLabelId,
  updateEntity,
  deleteEntity,
};
