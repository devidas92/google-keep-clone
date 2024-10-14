const express = require("express");
const labelService = require("../services/labels");
const router = express.Router();
const {
  createLabel,
  getAllLabelsByUserId,
  getLabelsByLabelId,
  deleteLabel,
  updateLabel,
} = require("../controllers/label");

const { validateEntityID, validateBody } = require("../utils/validateRoute");
const authTokenValidator = require("../utils/authTokenValidator");
const authorize = require("../utils/authorization");

// Retrive All labels by userId
router.get("/", authTokenValidator, authorize(["user"]), getAllLabelsByUserId);

router.get(
  "/:id",
  authTokenValidator,
  authorize(["user"]),
  validateEntityID("NOTE", labelService),
  getLabelsByLabelId
);

// Create a Note
router.post(
  "/",
  authTokenValidator,
  authorize(["user"]),
  validateBody("LABEL"),
  createLabel
);

// Update a Note
router.put(
  "/:id",
  [authTokenValidator, authorize(["user"])],
  validateEntityID("LABEL", labelService),
  validateBody("LABEL"),
  updateLabel
);

// Delete a Note
router.delete(
  "/:id",
  [authTokenValidator, authorize(["user"])],
  validateEntityID("LABEL", labelService),
  deleteLabel
);

module.exports = router;
