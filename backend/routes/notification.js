"use strict";

const express        = require('express');
const router         = express.Router();

const NotificationController = require('../controllers/notification');

router.delete('/:userId/:id', NotificationController.deleteNotification);
router.put('/', NotificationController.readNotifications)

module.exports = router;