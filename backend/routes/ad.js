"use strict";

const express        = require('express');
const router         = express.Router();

const AdController = require('../controllers/ad');

router.delete('/:userId/:id', AdController.deleteAd);
router.post('/:id', AdController.createKey);
router.put('/', AdController.updateAd)

module.exports = router;