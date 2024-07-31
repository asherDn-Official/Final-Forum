const express = require("express");
const {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
  markAllNotificationsAsRead,
} = require("../controllers/notificationController");
var router = express.Router();

router.post("/", getNotifications);
router.put("/:id/read", markNotificationAsRead);
router.delete("/:id", deleteNotification);
router.delete("/delete/all", deleteAllNotifications);
router.put("/read/all", markAllNotificationsAsRead);
module.exports = router;
