const express = require("express");
const app = express();
const port = 5000;
const notes = require("./routes/notes");
const users = require("./routes/users");
const auth = require("./routes/auth");
const config = require("./config");
const reminder = require("./routes/reminder");
const label = require("./routes/label");

const cron = require("node-cron");
const { checkReminders } = require("./services/reminder");

app.use(express.json()); // Middleware to parse JSON requests

// Load the routes
app.use("/api/notes", notes);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/reminder", reminder);
app.use("/api/label", label);

// Default route for testing
app.all("*", (req, res) => res.send("Google Keep Backend API"));

// Error handling middleware for JSON parsing errors
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next(err); // Pass to the next error handler
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON format" });
  }
  next(err); // Pass to the next error handler
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(port, () => {
  console.log(
    `Server running in ${config.environment} mode on port ${config.port}`
  );

  // Run this job every minute to check reminders
  cron.schedule("*/10 * * * * *", checkReminders);
});
