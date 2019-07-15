"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const HomeController = require('../controllers/home');

router.get('/', middlewares.checkAuthentication, HomeController.getMainContent);
router.get('/:id', middlewares.checkAuthentication, HomeController.getUserContent);

module.exports = router;