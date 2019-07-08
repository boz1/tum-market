"use strict";

const express        = require('express');
const router         = express.Router();

const AdController = require('../controllers/ad');

router.delete('/:userId/:id', AdController.deleteAd);
router.post('/', AdController.createAd);
router.get('/:id', AdController.getKey);
module.exports = router;