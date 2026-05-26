const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  updateUserStatus,
  getAllTasks,
  getAnalytics,
  getActivityLogs,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.use(protect);
router.use(adminOnly);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/status", updateUserStatus);
router.get("/tasks", getAllTasks);
router.get("/analytics", getAnalytics);
router.get("/logs", getActivityLogs);

module.exports = router;
