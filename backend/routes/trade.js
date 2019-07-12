"use strict";

const express        = require('express');
const router         = express.Router();

const TradeController = require('../controllers/trade');

router.get('/:userId/:id', TradeController.getTradeReq);
router.delete('/sent/:userId/:id/:userName/:title/:type/:sellerId', TradeController.deleteSentReq);
router.delete('/received/:userId/:id/:userName/:title', TradeController.deleteReceivedReq);
router.post('/', TradeController.sendTradeReq)
router.get('/received/:buyerId/:receivedItemId/:userId/:sentItemId', TradeController.getReceivedItem)
router.get('/sent/:sellerId/:targetItemId/:userId/:offeredItemId', TradeController.getSentItem)
router.post('/updateStatus', TradeController.updateStatus)

module.exports = router;