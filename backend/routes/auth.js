"use strict";

const express        = require('express');
const router         = express.Router();

const AuthController = require('../controllers/auth');

router.post('/', AuthController.login);

module.exports = router;