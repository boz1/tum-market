"use strict";

const express        = require('express');
const router         = express.Router();

const HomeController = require('../controllers/home');

router.get('/', HomeController.getMainContent);
router.get('/:id', HomeController.getUserContent);

module.exports = router;