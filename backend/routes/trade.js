"use strict";

const express = require('express');
const router = express.Router();

const middlewares = require('../middlewares');
const TradeController = require('../controllers/trade');

router.get('/:userId/:id', middlewares.checkAuthentication, TradeController.getTradeReq);
router.delete('/sent/:userId/:id/:userName/:title/:type/:sellerId', middlewares.checkAuthentication, TradeController.deleteSentReq);
router.delete('/received/:userId/:id/:userName/:title', middlewares.checkAuthentication, TradeController.deleteReceivedReq);
router.post('/', middlewares.checkAuthentication, TradeController.sendTradeReq)
router.get('/received/:buyerId/:receivedItemId/:userId/:sentItemId', middlewares.checkAuthentication, TradeController.getReceivedItem)
router.get('/sent/:sellerId/:targetItemId/:userId/:offeredItemId', middlewares.checkAuthentication, TradeController.getSentItem)
router.post('/updateStatus', middlewares.checkAuthentication, TradeController.updateStatus)

module.exports = router;