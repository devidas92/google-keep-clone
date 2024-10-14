const express = require("express");
const authController = require("../controllers/auth");
const router = express.Router();

// Route to register
router.post("/register", authController.register);

// Route to login
router.post("/login", authController.login);

module.exports = router;


