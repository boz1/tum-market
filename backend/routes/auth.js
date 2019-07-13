"use strict";

const express        = require('express');
const router         = express.Router();

const AuthController = require('../controllers/auth');

router.post('/login', AuthController.login);
router.get('/user', AuthController.getUser);
router.post('/signup', AuthController.signup);
router.get('/logout', AuthController.logout);

module.exports = router;