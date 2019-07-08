"use strict";

const express        = require('express');
const router         = express.Router();

const BuyController = require('../controllers/buy');

router.delete('/:userId/:id', BuyController.deleteBuy);
//router.post('/:id', AdController.createKey);
router.put('/', BuyController.updateBuy)

module.exports = router;