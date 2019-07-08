"use strict";

const express        = require('express');
const router         = express.Router();

const TradeController = require('../controllers/trade');

router.get('/:userId/:id', TradeController.getTradeReq);
router.delete('/sent/:userId/:id/:userName/:title', TradeController.deleteSentReq);
router.delete('/received/:userId/:id/:userName/:title', TradeController.deleteReceivedReq);
router.post('/', TradeController.sendTradeReq)

module.exports = router;