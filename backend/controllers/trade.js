"use strict"

const firebase = require('../config/firebaseConfig');
const config = require('../config/secret');
const nodemailer = require("nodemailer");


async function sendMail(to, subject, text, ) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.username,
            pass: config.pass
        }
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: "Tum Market", 
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
    });

    console.log("Message sent: %s", info.messageId);
}

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
    const type = req.params.type;
    const sellerId = req.params.sellerId;
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
            if (type === "ad") {
                obj.forEach((req) => {
                    firebase.database().ref('trade-requests').child(userId).child(req.id).remove()
                    firebase.database().ref('received-offers').child(req.sellerId).child(req.id).remove()

                    var newPostKey = firebase.database().ref('notifications').child(req.sellerId).push().key;
                    let message = userName + " has deleted their " + title + " advertisement. The trade request sent to you is also deleted."
                    const notification = {
                        id: newPostKey,
                        message: message,
                        isRead: false
                    };

                    firebase.database().ref('users').child(sellerId).once('value').then(async snap => sendMail(snap.val().email, 'Trade Request Deleted', notification.message))

                    var updates = {};
                    updates['/notifications/' + req.sellerId + '/' + newPostKey] = notification;
                    firebase.database().ref().update(updates);
                })

                res.status(200).json({ message: `Sent requests are deleted` })

            } else {
                firebase.database().ref('trade-requests').child(userId).child(id).remove()
                firebase.database().ref('received-offers').child(sellerId).child(id).remove()

                var newPostKey = firebase.database().ref('notifications').child(sellerId).push().key;
                let message = userName + " has deleted their trade request."
                const notification = {
                    id: newPostKey,
                    message: message,
                    isRead: false
                };

                firebase.database().ref('users').child(sellerId).once('value').then(async snap => sendMail(snap.val().email, 'Trade Request Deleted', notification.message))

                var updates = {};
                updates['/notifications/' + sellerId + '/' + newPostKey] = notification;
                firebase.database().ref().update(updates);

                res.status(200).json({ message: `Sent request is deleted` })
            }
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
                    message: userName + " has deleted their " + title + " advertisement. The trade request you sent is also deleted.",
                    isRead: false
                };

                firebase.database().ref('users').child(buyerId).once('value').then(async snap => sendMail(snap.val().email, 'Trade Request Deleted', notification.message))

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

        sendMail(ad.user.email, 'New Trade Request', notification.message);

        var updates = {};
        updates['/trade-requests/' + user.info.id + '/' + newPostKey] = postDataBuyer;
        updates['/received-offers/' + ad.userId + '/' + newPostKey] = postDataSeller;
        updates['/notifications/' + ad.userId + '/' + newPostKey] = notification;

        firebase.database().ref().update(updates)

        resolve();
    })
        .then(() => {
            res.status(200).json({ message: `Sent trade request` })
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

const getReceivedItem = (req, res) => {
    const buyerId = req.params.buyerId;
    const userId = req.params.userId;
    const receivedItemId = req.params.receivedItemId;
    const sentItemId = req.params.sentItemId;

    let receivedRef, sentItemRef, otherPartyRef;
    let obj = {};

    new Promise((resolve) => {
        receivedRef = firebase.database().ref('advertisements').child(buyerId).child(receivedItemId)
        receivedRef.once('value').then(snap => {
            if (snap.val() !== null) {
                let data = obj;
                data.receivedItem = snap.val()
                obj = data;
                resolve(obj)
            }
        })
    })
        .then((obj) => {
            return new Promise((resolve) => {
                sentItemRef = firebase.database().ref('advertisements').child(userId).child(sentItemId)
                sentItemRef.once('value').then(snap => {
                    if (snap.val() !== null) {
                        let data = obj;
                        data.sentItem = snap.val()
                        obj = data;
                        resolve(obj)
                    }
                })
            })
        })
        .then((obj) => {
            return new Promise((resolve) => {
                otherPartyRef = firebase.database().ref('users').child(buyerId)
                otherPartyRef.once('value').then(snap => {
                    if (snap.val() !== null) {
                        let data = obj;
                        data.otherParty = snap.val()
                        obj = data;
                        resolve(obj)
                    }
                })
            })
        })
        .then((obj) => {
            res.status(200).json({ obj });
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

const getSentItem = (req, res) => {
    const sellerId = req.params.sellerId;
    const userId = req.params.userId;
    const targetItemId = req.params.targetItemId;
    const offeredItemId = req.params.offeredItemId;

    let receivedRef, sentItemRef, otherPartyRef;
    let obj = {};

    new Promise((resolve) => {
        receivedRef = firebase.database().ref('advertisements').child(sellerId).child(targetItemId)
        receivedRef.once('value').then(snap => {
            if (snap.val() !== null) {
                let data = obj;
                data.receivedItem = snap.val()
                obj = data;
                resolve(obj)
            }
        })
    })
        .then((obj) => {
            return new Promise((resolve) => {
                sentItemRef = firebase.database().ref('advertisements').child(userId).child(offeredItemId)
                sentItemRef.once('value').then(snap => {
                    if (snap.val() !== null) {
                        let data = obj;
                        data.sentItem = snap.val()
                        obj = data;
                        resolve(obj)
                    }
                })
            })
        })
        .then((obj) => {
            return new Promise((resolve) => {
                otherPartyRef = firebase.database().ref('users').child(sellerId)
                otherPartyRef.once('value').then(snap => {
                    if (snap.val() !== null) {
                        let data = obj;
                        data.otherParty = snap.val()
                        obj = data;
                        resolve(obj)
                    }
                })
            })
        })
        .then((obj) => {
            res.status(200).json({ obj });
        })
        .catch(error => {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message
            })
        })
};

const updateStatus = (req, res) => {
    if (Object.keys(req.body).length === 0) return res.status(400).json({
        error: 'Bad Request',
        message: 'The request body is empty'
    });

    const item = req.body.item;
    const user = req.body.user;
    const title = req.body.title;
    const status = req.body.status;

    new Promise((resolve) => {
        // Get a key for a new Post.
        var newPostKey = firebase.database().ref('notifications').child(item.buyerId).push().key;

        const notification = {
            id: newPostKey,
            message: user.name + " has " + status.toLowerCase() + " your trade request for " + title + ".",
            isRead: false
        };

        var updates = {};
        updates['/trade-requests/' + item.buyerId + '/' + item.id + '/status'] = status;
        updates['/received-offers/' + item.userId + '/' + item.id + '/status'] = status;
        updates['/notifications/' + item.buyerId + '/' + newPostKey] = notification;

        firebase.database().ref().update(updates);

        resolve();
    })
        .then(() => {
            res.status(200).json({ message: `Updated status` })
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
    sendTradeReq,
    getReceivedItem,
    getSentItem,
    updateStatus
};