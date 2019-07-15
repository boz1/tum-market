"use strict";

const express        = require('express');
const router         = express.Router();

const middlewares    = require('../middlewares');
const AdController = require('../controllers/ad');

router.delete('/:userId/:id', middlewares.checkAuthentication, AdController.deleteAd);
router.post('/:id', middlewares.checkAuthentication, AdController.createKey);
router.put('/', middlewares.checkAuthentication, AdController.updateAd)

module.exports = router;