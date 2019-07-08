"use strict";

const firebase = require('../firebaseConfig')

const getTradeReq = (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;
    let checkTradeReqRef, checkReceivedReqRef;

    let reqs = { sent: [], received: [] };

    new Promise((resolve) => {
        checkTradeReqRef = firebase.database().ref('trade-requests').child(userId).orderByChild("offeredItemId").equalTo(id)
        checkTradeReqRef.once('value').then(snap => {
            if (snap.val() !== null) {
                reqs.sent = Object.values(snap.val())
            }

            resolve(reqs)
        })
    })
        .then((obj) => {
            return new Promise((resolve) => {
                checkReceivedReqRef = firebase.database().ref('received-offers').child(userId).orderByChild("sentItemId").equalTo(id)
                checkReceivedReqRef.once('value').then(snap => {
                    if (snap.val() !== null) {
                        obj.received = Object.values(snap.val())
                    }

                    resolve(obj)
                })
            })
        })
        .then((obj) => {
            res.status(200).json({ obj })
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

const deleteSentReq = (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;
    const userName = req.params.userName;
    const title = req.params.title;
    let checkTradeReqRef;

    let reqs = [];

    new Promise((resolve) => {
        checkTradeReqRef = firebase.database().ref('trade-requests').child(userId).orderByChild("offeredItemId").equalTo(id)
        checkTradeReqRef.once('value').then(snap => {
            if (snap.val() !== null) {
                reqs = Object.values(snap.val())
            }

            resolve(reqs)
        })
    })
        .then((obj) => {
            obj.forEach((req) => {

                firebase.database().ref('trade-requests').child(userId).child(req.id).remove()
                firebase.database().ref('received-offers').child(req.sellerId).child(req.id).remove()

                var newPostKey = firebase.database().ref('notifications').child(req.sellerId).push().key;

                const notification = {
                    id: newPostKey,
                    message: userName + " has deleted their " + title + " advertisement. The trade offer sent to you is also deleted.",
                    isRead: false
                };

                var updates = {};
                updates['/notifications/' + req.sellerId + '/' + newPostKey] = notification;
                firebase.database().ref().update(updates);
            })

            res.status(200).json({ message: `Sent requests are deleted` })
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

const deleteReceivedReq = (req, res) => {
    const id = req.params.id;
    const userId = req.params.userId;
    const userName = req.params.userName;
    const title = req.params.title;
    let checkReceivedReqRef;
    let reqs = [];

    new Promise((resolve) => {
        checkReceivedReqRef = firebase.database().ref('received-offers').child(userId).orderByChild("sentItemId").equalTo(id)
        checkReceivedReqRef.once('value').then(snap => {
            if (snap.val() !== null) {
                reqs = Object.values(snap.val())
            }

            resolve(reqs)
        })
    })
        .then((obj) => {
            obj.forEach((req) => {
                firebase.database().ref('received-offers').child(userId).child(req.id).remove()
                firebase.database().ref('trade-requests').child(req.buyerId).child(req.id).remove()

                var newPostKey = firebase.database().ref('notifications').child(req.buyerId).push().key;

                const notification = {
                    id: newPostKey,
                    message: userName + " has deleted their " + title + " advertisement. The trade offer you sent is also deleted.",
                    isRead: false
                };

                var updates = {};
                updates['/notifications/' + req.buyerId + '/' + newPostKey] = notification;
                firebase.database().ref().update(updates);
            })

            res.status(200).json({ message: `Received requests are deleted` })
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

const sendTradeReq = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    const ad = req.body.ad;
    const user = req.body.user;
    const itemId = req.body.itemId;

    new Promise((resolve) => {
        // Get a key for a new Post.
        var newPostKey = firebase.database().ref('trade-requests').child(user.info.id).push().key;

        // Get date
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        const postDataBuyer = {
            offeredItemId: itemId,
            sellerId: ad.userId,
            targetItemId: ad.id,
            userId: user.info.id,
            id: newPostKey,
            status: '-',
            date: date
        };

        const postDataSeller = {
            receivedItemId: itemId,
            userId: ad.userId,
            sentItemId: ad.id,
            buyerId: user.info.id,
            id: newPostKey,
            status: '-',
            date: date
        };

        const notification = {
            id: newPostKey,
            message: "You have a new trade request from " + user.info.name + " for your " + ad.title + ".",
            isRead: false
        };

        var updates = {};
        updates['/trade-requests/' + user.info.id + '/' + newPostKey] = postDataBuyer;
        updates['/received-offers/' + ad.userId + '/' + newPostKey] = postDataSeller;
        updates['/notifications/' + ad.userId + '/' + newPostKey] = notification;

        firebase.database().ref().update(updates)

        resolve();
    })
        .then(() => {
            res.status(200).json({ message: `Created new ad` })
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

module.exports = {
    getTradeReq,
    deleteSentReq,
    deleteReceivedReq,
    sendTradeReq
};