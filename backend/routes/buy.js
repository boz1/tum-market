"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const BuyController = require('../controllers/buy');

router.delete('/:userId/:id', middlewares.checkAuthentication, BuyController.deleteBuy);
router.post('/:id', middlewares.checkAuthentication, BuyController.createKey);
router.put('/', middlewares.checkAuthentication, BuyController.updateBuy)

module.exports = router;