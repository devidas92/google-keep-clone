const { readFile, writeFile } = require("fs/promises");
const path = require("path");
const bcrypt = require("bcrypt");

const filePath = path.resolve("src", "db", "users.json");

const readUsers = async () => {
  const data = await readFile(filePath, "utf-8").catch(() => "[]");
  return JSON.parse(data || "[]"); // Parse existing users or initialize an empty array
};

const writeUser = async (users) => {
  await writeFile(filePath, JSON.stringify(users, null, 2));
};

const createEntity = async (newUser) => {
  const users = await readUsers();
  if (users.some((user) => user?.username === newUser.username)) {
    throw new Error("User already exists");
  }

  newUser.password = await bcrypt.hash(newUser.password, 10);
  newUser.id = users.reduce((max, user) => Math.max(max, user.id || 0), 0) + 1;

  const userWithTimestamp = { ...newUser, createdAt: new Date().toISOString() };
  await writeUser([...users, userWithTimestamp]);
  return userWithTimestamp;
};

const readEntityById = async (id) => {
  const users = await readUsers();
  return users.filter((user) => user.id === Number(id));
};

const updateEntity = async (user, id) => {
  const oldUsers = await readUsers();
  const updatedUsers = oldUsers.filter((oldUser) => oldUser.id != Number(id));
  user.id = Number(id);
  const userWithTimestamp = {
    ...user,
    createdAt: new Date().toISOString(),
  };

  await writeUser([...updatedUsers, userWithTimestamp]);
  return userWithTimestamp;
};

const deleteEntity = async (id) => {
  const users = await readUsers();
  const newData = users.filter((user) => user.id !== Number(id));
  await writeUser(newData);
};

module.exports = {
  createEntity,
  readEntityById,
  deleteEntity,
  updateEntity,
  readUsers,
};
