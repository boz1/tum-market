"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const NotificationController = require('../controllers/notification');

router.delete('/:userId/:id', middlewares.checkAuthentication, NotificationController.deleteNotification);
router.put('/', middlewares.checkAuthentication, NotificationController.readNotifications)

module.exports = router;