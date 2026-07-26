const express = require("express");

const router = express.Router();

const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");

// IMPORTANT: /users/me must come BEFORE /users/:id
// otherwise Express treats "me" as an :id value
router.get("/users/me", verifyToken, userController.getMe);
router.get("/users/:id", verifyToken, userController.getUserById);

module.exports = router;